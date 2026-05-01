from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
from typing import List, Dict

class JobMatcher:
    def __init__(self):
        # Load pre-trained model (downloads first time, ~400MB)
        print("Loading sentence transformer model...")
        self.model = SentenceTransformer('all-MiniLM-L6-v2')
        print("Model loaded!")
    
    def compute_match_score(self, resume_text: str, job_description: str) -> float:
        """
        Compute similarity between resume and job description
        Returns: float between 0 and 1 (0 = no match, 1 = perfect match)
        """
        # Generate embeddings
        resume_embedding = self.model.encode([resume_text])
        job_embedding = self.model.encode([job_description])
        
        # Calculate cosine similarity
        similarity = cosine_similarity(resume_embedding, job_embedding)[0][0]
        
        # Convert to percentage
        return round(float(similarity) * 100, 2)
    
    def rank_jobs(self, resume_text: str, jobs: List[Dict]) -> List[Dict]:
        """
        Rank jobs based on match with resume
        """
        # Create job descriptions from job objects
        job_descriptions = [
            f"{job['title']} {job['description']} {' '.join(job.get('skills', []))}"
            for job in jobs
        ]
        
        # Generate embeddings
        resume_embedding = self.model.encode([resume_text])
        job_embeddings = self.model.encode(job_descriptions)
        
        # Calculate similarities
        similarities = cosine_similarity(resume_embedding, job_embeddings)[0]
        
        # Add match scores to jobs
        for i, job in enumerate(jobs):
            job['match_score'] = round(float(similarities[i]) * 100, 2)
        
        # Sort by match score
        ranked_jobs = sorted(jobs, key=lambda x: x['match_score'], reverse=True)
        
        return ranked_jobs
    
    def analyze_skill_gap(self, user_skills: List[str], required_skills: List[str]) -> Dict:
        """
        Analyze skill gap between user and job requirements
        """
        user_skills_lower = [s.lower() for s in user_skills]
        required_skills_lower = [s.lower() for s in required_skills]
        
        # Find matching and missing skills
        matching_skills = [s for s in required_skills if s.lower() in user_skills_lower]
        missing_skills = [s for s in required_skills if s.lower() not in user_skills_lower]
        
        match_percentage = (len(matching_skills) / len(required_skills) * 100) if required_skills else 0
        
        return {
            'matching_skills': matching_skills,
            'missing_skills': missing_skills,
            'match_percentage': round(match_percentage, 2),
            'total_required': len(required_skills),
            'total_matched': len(matching_skills)
        }