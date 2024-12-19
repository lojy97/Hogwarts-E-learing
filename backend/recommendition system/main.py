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
import logging

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
    num_recommendations: int = 2  # Default number of recommendations

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Fetch and preprocess data from MongoDB
def fetch_data():
    logger.info("Fetching data from MongoDB collections...")
    try:
        progress_data = list(progress_collection.find())
        progress_df = pd.DataFrame(progress_data)
        logger.debug(f"Progress data fetched: {len(progress_data)} records.")

        responses_data = list(responses_collection.find())
        responses_df = pd.DataFrame(responses_data)
        logger.debug(f"Responses data fetched: {len(responses_data)} records.")

        combined_df = pd.merge(progress_df, responses_df, on='user_id', how='outer')
        logger.debug(f"Combined DataFrame shape: {combined_df.shape}")

        course_data = list(courses_collection.find())
        course_df = pd.DataFrame(course_data)
        logger.debug(f"Course data fetched: {len(course_data)} records.")

        quizzes_data = list(quizzes_collection.find())
        quizzes_df = pd.DataFrame(quizzes_data)
        logger.debug(f"Quizzes data fetched: {len(quizzes_data)} records.")

        modules_data = list(modules_collection.find())
        modules_df = pd.DataFrame(modules_data)
        logger.debug(f"Modules data fetched: {len(modules_data)} records.")

        # Convert ObjectId columns to strings in DataFrames
        for df in [combined_df, course_df, quizzes_df, modules_df]:
            for column in df.columns:
                if df[column].dtype == 'object' and df[column].apply(lambda x: isinstance(x, ObjectId)).any():
                    df[column] = df[column].apply(lambda x: str(x) if isinstance(x, ObjectId) else x)

        # Ensure valid numeric data
        combined_df['score'] = pd.to_numeric(combined_df['score'], errors='coerce').fillna(0)
        combined_df['completion_percentage'] = pd.to_numeric(combined_df['completion_percentage'], errors='coerce').fillna(0)

        # Create combined features for courses
        course_df['combined_features'] = course_df['_id'].astype(str) + " " + modules_df['_id'].astype(str).fillna('')

        return combined_df, course_df, modules_df
    except Exception as e:
        logger.error(f"Error fetching data: {str(e)}")
        raise RuntimeError(f"An error occurred while fetching data: {str(e)}") from e

# Preprocess data globally
combined_df, course_df, modules_df = fetch_data()

# Create the combined features for content-based filtering
# Create the combined features for content-based filtering
vectorizer = TfidfVectorizer(max_features=1000)

# Handle NaN values in the combined_features column
course_df['combined_features'] = course_df['combined_features'].fillna('')

# Create the count matrix
count_matrix = vectorizer.fit_transform(course_df['combined_features'])

# Compute the cosine similarity
cosine_sim = cosine_similarity(count_matrix)


# Create collaborative filtering matrix
user_course_matrix = combined_df.pivot_table(
    index='user_id',
    columns='course_id',
    values=['score', 'completion_percentage']
).fillna(0)

user_course_matrix = (
    user_course_matrix - user_course_matrix.mean(axis=1).values[:, np.newaxis]
).fillna(0)
user_course_sparse = csr_matrix(user_course_matrix)

# Dimensionality reduction
num_features = min(20, user_course_matrix.shape[1])
svd = TruncatedSVD(n_components=num_features, random_state=42)
latent_matrix = svd.fit_transform(user_course_sparse)
collaborative_sim = cosine_similarity(latent_matrix)

# Recommendation function
def hybrid_recommendation(user_id, num_recommendations=2, alpha=0.9, threshold=0.05):
    logger.info(f"Generating recommendations for user_id: {user_id}")
    try:
        if user_id not in user_course_matrix.index:
            logger.warning(f"User {user_id} not found in the course matrix.")
            return {
                "recommended_courses": pd.DataFrame(columns=['_id']),
                "recommended_modules": pd.DataFrame(columns=['courseId', '_id'])
            }

        user_index = user_course_matrix.index.get_loc(user_id)
        user_scores = user_course_matrix.iloc[user_index].values
        user_scores = user_scores / (np.linalg.norm(user_scores) + 1e-9)

        content_scores = np.mean(cosine_sim, axis=0)
        collaborative_scores = collaborative_sim[user_index]

        max_len = max(len(content_scores), len(collaborative_scores))
        content_scores = np.pad(content_scores, (0, max_len - len(content_scores)), 'constant')
        collaborative_scores = np.pad(collaborative_scores, (0, max_len - len(collaborative_scores)), 'constant')

        hybrid_scores = alpha * content_scores + (1 - alpha) * collaborative_scores
        hybrid_scores = np.array([score if score >= threshold else 0 for score in hybrid_scores])

        enrolled_course_ids = {str(course_id) for course_id in users_collection.find_one({"_id": ObjectId(user_id)}).get("courses", [])}
        available_course_indices = [
            i for i, course_id in enumerate(course_df['_id'])
            if str(course_id) not in enrolled_course_ids and hybrid_scores[i] > 0
        ]

        if not available_course_indices:
            return {
                "recommended_courses": pd.DataFrame(columns=['_id']),
                "recommended_modules": pd.DataFrame(columns=['courseId', '_id'])
            }

        recommended_indices = sorted(available_course_indices, key=lambda x: hybrid_scores[x], reverse=True)[:num_recommendations]
        recommended_courses = course_df.iloc[recommended_indices][['_id']]
        module_recommendations = modules_df[modules_df['courseId'].isin(recommended_courses['_id'])][['courseId', '_id']].drop_duplicates()

        return {
            "recommended_courses": recommended_courses,
            "recommended_modules": module_recommendations
        }
    except Exception as e:
        logger.error(f"Error in hybrid_recommendation for user {user_id}: {str(e)}")
        raise e

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
        logger.error(f"Error in recommendation endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
async def root():
    return {"message": "AI Recommendation System is running!"}

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

if __name__ == "__main__":
    logger.info("Starting FastAPI server...")
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
