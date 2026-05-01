from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from models.resume_parser import ResumeParser
from models.job_matcher import JobMatcher
from typing import List, Dict
import uvicorn

app = FastAPI(title="HireHub ML Service")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize models
resume_parser = ResumeParser()
job_matcher = JobMatcher()

@app.get("/")
def home():
    return {"message": "HireHub ML Service is running 🤖"}

@app.post("/parse-resume")
async def parse_resume(file: UploadFile = File(...)):
    """
    Parse uploaded resume PDF
    """
    try:
        if not file.filename.endswith('.pdf'):
            raise HTTPException(status_code=400, detail="Only PDF files are supported")
        
        # Parse resume
        result = resume_parser.parse(file.file)
        
        return {
            "success": True,
            "data": result
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/match-score")
async def calculate_match_score(data: Dict):
    """
    Calculate match score between resume and job
    """
    try:
        resume_text = data.get('resume_text', '')
        job_description = data.get('job_description', '')
        
        if not resume_text or not job_description:
            raise HTTPException(status_code=400, detail="Both resume_text and job_description are required")
        
        score = job_matcher.compute_match_score(resume_text, job_description)
        
        return {
            "success": True,
            "match_score": score
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/rank-jobs")
async def rank_jobs(data: Dict):
    """
    Rank jobs based on resume match
    """
    try:
        resume_text = data.get('resume_text', '')
        jobs = data.get('jobs', [])
        
        if not resume_text or not jobs:
            raise HTTPException(status_code=400, detail="Both resume_text and jobs are required")
        
        ranked = job_matcher.rank_jobs(resume_text, jobs)
        
        return {
            "success": True,
            "ranked_jobs": ranked
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/skill-gap")
async def analyze_skill_gap(data: Dict):
    """
    Analyze skill gap
    """
    try:
        user_skills = data.get('user_skills', [])
        required_skills = data.get('required_skills', [])
        
        analysis = job_matcher.analyze_skill_gap(user_skills, required_skills)
        
        return {
            "success": True,
            "analysis": analysis
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)