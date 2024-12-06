
from flask import Flask, request, jsonify
from pymongo import MongoClient
import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.decomposition import TruncatedSVD
from scipy.sparse import csr_matrix
import logging

logging.basicConfig(level=logging.DEBUG)

app = Flask(__name__)

# Connect to MongoDB
mongo_client = MongoClient("mongodb+srv://Yabany:0000@cluster0.5vcpt.mongodb.net/Ytest?retryWrites=true&w=majority&appName=Cluster0")
db = mongo_client['Ytest']
progress_collection = db['Progress']
quizzes_collection = db['Quizzes']
responses_collection = db['Responses']

# Fetch user progress data from the Progress collection
def get_user_progress(user_id):
    try:
        progress_data = list(progress_collection.find({'user_id': user_id}))
        logging.debug(f"Progress data for user_id {user_id}: {progress_data}")
        return progress_data
    except Exception as e:
        logging.debug(f"Error fetching progress data for user_id {user_id}: {e}")
        return []

# Fetch quizzes data from the Quizzes collection
def get_user_quizzes(user_id):
    try:
        quizzes_data = list(quizzes_collection.find({'user_id': user_id}))
        logging.debug(f"Quizzes data for user_id {user_id}: {quizzes_data}")
        return quizzes_data
    except Exception as e:
        logging.debug(f"Error fetching quizzes data for user_id {user_id}: {e}")
        return []

# Fetch quiz responses data from the Responses collection
def get_user_responses(user_id):
    try:
        responses_data = list(responses_collection.find({'user_id': user_id}))
        logging.debug(f"Responses data for user_id {user_id}: {responses_data}")
        return responses_data
    except Exception as e:
        logging.debug(f"Error fetching responses data for user_id {user_id}: {e}")
        return []

# Hybrid Recommendation function
def hybrid_recommendation(user_id, progress_data, quizzes_data, responses_data, num_recommendations=5, alpha=0.9, threshold=0.5):
    # Combine data into a pandas DataFrame
    combined_data = []

    for progress in progress_data:
        course_id = progress.get('course_id')
        completion_percentage = progress['completion_percentage']

        # Find the quizzes related to the course
        quizzes_for_course = [quiz for quiz in quizzes_data if quiz['course_id'] == course_id]

        for quiz in quizzes_for_course:
            module_id = quiz['module_id']
            quiz_id = quiz['_id']  # Quiz ID from the Quizzes collection

            # Get the score from the Responses collection based on quiz_id
            response = next((resp for resp in responses_data if resp['quiz_id'] == quiz_id), None)
            score = response['score'] if response else 0  # Default to 0 if no response found

            # Combine course_id, module_id, and score for content-based filtering
            if score >= threshold and completion_percentage > 50:
                combined_data.append({
                    'user_id': user_id,
                    'course_id': course_id,
                    'module_id': module_id,
                    'score': score,
                    'completion_percentage': completion_percentage,
                    'combined_features': f"{course_id} {module_id} {score}"  # Combine for TF-IDF
                })

    # Convert to DataFrame
    data = pd.DataFrame(combined_data)

    if data.empty:
        logging.debug("No data available for recommendations.")
        return []

    # Content-Based Filtering using TF-IDF Vectorization and Cosine Similarity
    vectorizer = TfidfVectorizer(max_features=1000)
    count_matrix = vectorizer.fit_transform(data['combined_features'])
    cosine_sim = cosine_similarity(count_matrix)

    # Collaborative Filtering using SVD (Singular Value Decomposition)
    user_course_matrix = data.pivot_table(index='user_id', columns='course_id', values='score', aggfunc='mean').fillna(0)
    user_course_sparse = csr_matrix(user_course_matrix)

    # Apply SVD for Latent Feature Extraction
    num_features = min(20, user_course_matrix.shape[1])  # Ensure n_components <= n_features
    svd = TruncatedSVD(n_components=num_features, random_state=42)
    latent_matrix = svd.fit_transform(user_course_sparse)

    # Calculate user similarity (collaborative filtering)
    user_similarity = cosine_similarity(latent_matrix)

    # Final Recommendations: Combine content-based and collaborative filtering
    recommendations = []

    for index, row in data.iterrows():
        course_id = row['course_id']
        module_id = row['module_id']
        score = row['score']
        completion_percentage = row['completion_percentage']

        # Compute hybrid score by blending content-based and collaborative similarity
        content_score = cosine_sim[index].mean()  # Mean similarity for the course/module
        collaborative_score = user_similarity[index].mean()  # Mean similarity for the user

        # Weighted average based on alpha
        hybrid_score = alpha * content_score + (1 - alpha) * collaborative_score

        recommendations.append({
            'course_id': course_id,
            'module_id': module_id,
            'score': score,
            'completion_percentage': completion_percentage,
            'hybrid_score': hybrid_score
        })

    # Sort recommendations by hybrid score and return the top N recommendations
    recommendations = sorted(recommendations, key=lambda x: x['hybrid_score'], reverse=True)

    return [rec['course_id'] for rec in recommendations[:num_recommendations]]  # Top N recommendations

@app.route('/recommend', methods=['POST'])
def recommend():
    try:
        # Parse request data
        request_data = request.get_json()
        user_id = request_data['user_id']
        
        # Fetch user progress, quizzes, and quiz responses data
        progress_data = get_user_progress(user_id)
        quizzes_data = get_user_quizzes(user_id)
        responses_data = get_user_responses(user_id)

        # Debug log the fetched data
        logging.debug(f"Progress Data: {progress_data}")
        logging.debug(f"Quizzes Data: {quizzes_data}")
        logging.debug(f"Responses Data: {responses_data}")
        
        # Generate recommendations
        recommendations = hybrid_recommendation(user_id, progress_data, quizzes_data, responses_data)

        # Debug log the recommendations
        logging.debug(f"Recommendations: {recommendations}")

        # Return recommendations as JSON
        return jsonify({'recommendations': recommendations})

    except Exception as e:
        logging.debug(f"Error in recommendation process: {e}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
