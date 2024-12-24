from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from pymongo import MongoClient
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
import pandas as pd
from scipy.sparse import csr_matrix
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.decomposition import TruncatedSVD
from bson import ObjectId
from fastapi.middleware.cors import CORSMiddleware
# Initialize FastAPI app
app = FastAPI()

# MongoDB connection
MONGO_URI = "mongodb+srv://Yabany:0000@cluster0.5vcpt.mongodb.net/Ytest?retryWrites=true&w=majority&appName=Cluster0"
client = MongoClient(MONGO_URI)
db = client["Ytest"]  # Replace with your database name
users_collection = db["users"]
courses_collection = db["courses"]
modules_collection = db["modules"]
progress_collection = db["Progress"]
responses_collection = db["responses"]
quizzes_collection = db["quizzes"]

# Request schema
class RecommendationRequest(BaseModel):
    user_id: str
    num_recommendations: int = 2  


# Fetch and preprocess data from MongoDB
def fetch_data():
    progress_data = list(progress_collection.find())
    progress_df = pd.DataFrame(progress_data)

    responses_data = list(responses_collection.find())
    responses_df = pd.DataFrame(responses_data)

    combined_df = pd.merge(progress_df, responses_df, on='user_id', how='outer')

    course_data = list(courses_collection.find())
    course_df = pd.DataFrame(course_data)

    quizzes_data = list(quizzes_collection.find())
    quizzes_df = pd.DataFrame(quizzes_data)

    modules_data = list(modules_collection.find())
    modules_df = pd.DataFrame(modules_data)

    # Convert ObjectId columns to strings in DataFrames
    for df in [combined_df, course_df, quizzes_df, modules_df]:
        for column in df.columns:
            if df[column].dtype == 'object' and df[column].apply(lambda x: isinstance(x, ObjectId)).any():
                df[column] = df[column].apply(lambda x: str(x) if isinstance(x, ObjectId) else x)

    combined_df['score'] = pd.to_numeric(combined_df['score'], errors='coerce').fillna(0)
    combined_df['completion_percentage'] = pd.to_numeric(combined_df['completion_percentage'], errors='coerce').fillna(0)

    course_df['combined_features'] = course_df['_id'].astype(str) + " " + quizzes_df['module_id'].astype(str).fillna('')

    return combined_df, course_df, modules_df


# Preprocess data globally
combined_df, course_df, modules_df = fetch_data()

# Create the combined features for content-based filtering
vectorizer = TfidfVectorizer(max_features=1000)
count_matrix = vectorizer.fit_transform(course_df['combined_features'])
cosine_sim = cosine_similarity(count_matrix)

user_course_matrix = combined_df.pivot_table(
    index='user_id',
    columns='course_id',
    values=['score', 'completion_percentage']
).fillna(0)

user_course_matrix = (
    user_course_matrix - user_course_matrix.mean(axis=1).values[:, np.newaxis]
).fillna(0)
user_course_sparse = csr_matrix(user_course_matrix)

num_features = min(20, user_course_matrix.shape[1])
svd = TruncatedSVD(n_components=num_features, random_state=42)
latent_matrix = svd.fit_transform(user_course_sparse)
collaborative_sim = cosine_similarity(latent_matrix)

def hybrid_recommendation(user_id, num_recommendations=2, alpha=0.9, threshold=0.05):
    if user_id not in user_course_matrix.index:
        raise ValueError("User ID not found in the data.")
    
    user = users_collection.find_one({"_id": ObjectId(user_id)})
    if not user:
        raise ValueError("User not found.")
    
    enrolled_course_ids = {str(course_id) for course_id in user.get("courses", [])}
    print(f"Enrolled course IDs for user {user_id}: {enrolled_course_ids}")

    if not enrolled_course_ids:
        print("User is not enrolled in any courses.")
    
    user_index = user_course_matrix.index.get_loc(user_id)
    user_scores = user_course_matrix.iloc[user_index].values
    collaborative_scores = user_scores / (np.linalg.norm(user_scores) + 1e-9)

    content_scores = np.mean(cosine_sim, axis=0)
    if len(collaborative_scores) < len(content_scores):
        collaborative_scores = np.pad(collaborative_scores, (0, len(content_scores) - len(collaborative_scores)), 'constant')

    hybrid_scores = alpha * content_scores + (1 - alpha) * collaborative_scores
    print(f"Hybrid scores before thresholding: {hybrid_scores}")
    hybrid_scores = np.array([score if score >= threshold else 0 for score in hybrid_scores])
    print(f"Hybrid scores after thresholding: {hybrid_scores}")

    available_course_indices = [
        i for i, course_id in enumerate(course_df['_id'])
        if (course_id not in enrolled_course_ids) and (hybrid_scores[i] > 0)
    ]
    print(f"Available course indices: {available_course_indices}")

    if not available_course_indices:
        print("No available courses for recommendations.")
        return {
            "recommended_courses": pd.DataFrame(columns=['_id']),
            "recommended_modules": pd.DataFrame(columns=['courseId', '_id'])
        }

    recommended_indices = sorted(available_course_indices, key=lambda x: hybrid_scores[x], reverse=True)[:num_recommendations]
    print(f"Recommended indices: {recommended_indices}")

    recommended_courses = course_df.iloc[recommended_indices][['_id']]
    module_recommendations = modules_df[modules_df['courseId'].isin(recommended_courses['_id'])]
    module_recommendations = module_recommendations[['courseId', '_id']].drop_duplicates()

    return {
        "recommended_courses": recommended_courses,
        "recommended_modules": module_recommendations
    }


@app.post("/recommendations/")
async def recommendation_endpoint(request: RecommendationRequest):
    try:
        user_id = request.user_id

        if not users_collection.find_one({"_id": ObjectId(user_id)}):
            raise HTTPException(status_code=404, detail="User not found.")
        
        recommended_courses = hybrid_recommendation(user_id, num_recommendations=request.num_recommendations)

        recommended_courses['recommended_courses']['_id'] = recommended_courses['recommended_courses']['_id'].apply(
            lambda x: str(x) if isinstance(x, ObjectId) else x
        )
        recommended_courses['recommended_modules']['_id'] = recommended_courses['recommended_modules']['_id'].apply(
            lambda x: str(x) if isinstance(x, ObjectId) else x
        )

        response_data = {
            "user_id": user_id,
            "recommended_courses": recommended_courses['recommended_courses'].to_dict(orient='records'),
            "recommended_modules": recommended_courses['recommended_modules'].to_dict(orient='records')
        }

        return response_data
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Use "*" to allow all origins, or list specific origins like ["http://localhost:3000"]
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods, or specify methods like ["GET", "POST"]
    allow_headers=["*"],  # Allow all headers, or specify headers like ["Content-Type"]
)

@app.get("/")
async def root():
    return {"message": "AI Recommendation System is running!"}
if __name__ == "__main__":
    print("Starting FastAPI server...")
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)