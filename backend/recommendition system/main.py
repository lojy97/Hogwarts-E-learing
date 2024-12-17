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
MONGO_URI = "your_mongo_connection_string_here"
client = MongoClient(MONGO_URI)
db = client["your_database_name"]
users_collection = db["users"]
courses_collection = db["courses"]
modules_collection = db["modules"]
progress_collection = db["progress"]
responses_collection = db["responses"]
quizzes_collection = db["quizzes"]

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Request schema
class RecommendationRequest(BaseModel):
    user_id: str
    num_recommendations: int = 2

# Fetch and preprocess data
def fetch_data():
    progress_data = list(progress_collection.find())
    responses_data = list(responses_collection.find())
    courses_data = list(courses_collection.find())
    quizzes_data = list(quizzes_collection.find())
    modules_data = list(modules_collection.find())

    progress_df = pd.DataFrame(progress_data)
    responses_df = pd.DataFrame(responses_data)
    courses_df = pd.DataFrame(courses_data)
    quizzes_df = pd.DataFrame(quizzes_data)
    modules_df = pd.DataFrame(modules_data)

    # Ensure ObjectId columns are converted to strings
    for df in [progress_df, responses_df, courses_df, quizzes_df, modules_df]:
        for col in df.columns:
            if df[col].apply(lambda x: isinstance(x, ObjectId)).any():
                df[col] = df[col].astype(str)

    # Combine features for courses
    if not quizzes_df.empty:
        courses_df["combined_features"] = courses_df["_id"].astype(str) + " " + quizzes_df["module_id"].fillna('').astype(str)
    else:
        courses_df["combined_features"] = courses_df["_id"].astype(str)

    return progress_df, responses_df, courses_df, modules_df

progress_df, responses_df, courses_df, modules_df = fetch_data()

# Vectorize features
vectorizer = TfidfVectorizer(max_features=1000)
count_matrix = vectorizer.fit_transform(courses_df["combined_features"])
cosine_sim = cosine_similarity(count_matrix)

# Collaborative filtering matrix
user_course_matrix = progress_df.pivot_table(index="user_id", columns="course_id", values="score").fillna(0)
user_course_sparse = csr_matrix(user_course_matrix)

# Latent features using SVD
num_features = min(20, user_course_matrix.shape[1])
svd = TruncatedSVD(n_components=num_features, random_state=42)
latent_matrix = svd.fit_transform(user_course_sparse)
collaborative_sim = cosine_similarity(latent_matrix)

# Hybrid recommendation
def hybrid_recommendation(user_id, num_recommendations=2, alpha=0.9, threshold=0.05):
    if user_id not in user_course_matrix.index:
        logger.warning(f"User {user_id} not found.")
        return {
            "recommended_courses": [],
            "recommended_modules": []
        }

    user_index = user_course_matrix.index.get_loc(user_id)
    collaborative_scores = collaborative_sim[user_index]
    content_scores = cosine_sim.mean(axis=0)

    # Combine scores
    hybrid_scores = alpha * content_scores + (1 - alpha) * collaborative_scores
    hybrid_scores[hybrid_scores < threshold] = 0

    recommended_indices = np.argsort(hybrid_scores)[::-1][:num_recommendations]
    recommended_courses = courses_df.iloc[recommended_indices]["_id"].tolist()
    recommended_modules = modules_df[modules_df["courseId"].isin(recommended_courses)][["courseId", "_id"]].drop_duplicates().to_dict(orient="records")

    return {
        "recommended_courses": recommended_courses,
        "recommended_modules": recommended_modules
    }

@app.post("/recommendations/")
async def recommendation_endpoint(request: RecommendationRequest):
    try:
        user_id = request.user_id
        if not users_collection.find_one({"_id": ObjectId(user_id)}):
            raise HTTPException(status_code=404, detail="User not found.")

        recommendations = hybrid_recommendation(user_id, request.num_recommendations)
        return {
            "user_id": user_id,
            "recommended_courses": recommendations["recommended_courses"],
            "recommended_modules": recommendations["recommended_modules"]
        }
    except Exception as e:
        logger.error(f"Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "AI Recommendation System is running!"}
