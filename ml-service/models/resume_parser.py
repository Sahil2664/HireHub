import PyPDF2
import spacy
import re
from typing import Dict, List

# Load spaCy model
nlp = spacy.load("en_core_web_sm")

class ResumeParser:
    def __init__(self):
        # Common skill keywords
        self.skills_db = {
            'programming': ['python', 'javascript', 'java', 'c++', 'react', 'node.js', 'angular', 'vue', 'typescript'],
            'backend': ['django', 'flask', 'fastapi', 'express', 'spring', 'mongodb', 'postgresql', 'mysql', 'redis'],
            'frontend': ['html', 'css', 'tailwind', 'bootstrap', 'sass', 'webpack', 'redux'],
            'devops': ['docker', 'kubernetes', 'aws', 'azure', 'gcp', 'jenkins', 'ci/cd', 'terraform'],
            'ml': ['tensorflow', 'pytorch', 'scikit-learn', 'keras', 'nlp', 'opencv', 'pandas', 'numpy'],
            'tools': ['git', 'github', 'gitlab', 'jira', 'agile', 'scrum']
        }
        
        # Flatten all skills
        self.all_skills = []
        for category in self.skills_db.values():
            self.all_skills.extend(category)
    
    def extract_text_from_pdf(self, pdf_file) -> str:
        """Extract text from PDF file"""
        try:
            pdf_reader = PyPDF2.PdfReader(pdf_file)
            text = ""
            for page in pdf_reader.pages:
                text += page.extract_text()
            return text
        except Exception as e:
            raise Exception(f"Error reading PDF: {str(e)}")
    
    def extract_email(self, text: str) -> str:
        """Extract email using regex"""
        email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
        emails = re.findall(email_pattern, text)
        return emails[0] if emails else ""
    
    def extract_phone(self, text: str) -> str:
        """Extract phone number"""
        phone_pattern = r'[\+\(]?[1-9][0-9 .\-\(\)]{8,}[0-9]'
        phones = re.findall(phone_pattern, text)
        return phones[0] if phones else ""
    
    def extract_name(self, text: str) -> str:
        """Extract name using NER"""
        doc = nlp(text[:500])  # Check first 500 chars
        for ent in doc.ents:
            if ent.label_ == "PERSON":
                return ent.text
        return ""
    
    def extract_skills(self, text: str) -> List[str]:
        """Extract skills from text"""
        text_lower = text.lower()
        found_skills = []
        
        for skill in self.all_skills:
            # Look for whole word matches
            pattern = r'\b' + re.escape(skill.lower()) + r'\b'
            if re.search(pattern, text_lower):
                if skill not in found_skills:
                    found_skills.append(skill)
        
        return found_skills
    
    def extract_education(self, text: str) -> List[str]:
        """Extract education details"""
        education_keywords = ['bachelor', 'master', 'phd', 'b.tech', 'm.tech', 'bsc', 'msc', 'mba', 'degree']
        education = []
        
        lines = text.split('\n')
        for line in lines:
            line_lower = line.lower()
            for keyword in education_keywords:
                if keyword in line_lower:
                    education.append(line.strip())
                    break
        
        return education[:3]  # Max 3 entries
    
    def extract_experience_years(self, text: str) -> int:
        """Estimate years of experience"""
        # Look for patterns like "3 years", "5+ years", etc.
        year_patterns = [
            r'(\d+)\+?\s*years?\s+(?:of\s+)?experience',
            r'experience\s*:?\s*(\d+)\+?\s*years?',
        ]
        
        for pattern in year_patterns:
            matches = re.findall(pattern, text.lower())
            if matches:
                return int(matches[0])
        
        # Fallback: count different job titles mentioned
        job_keywords = ['developer', 'engineer', 'analyst', 'manager', 'intern']
        count = sum(1 for keyword in job_keywords if keyword in text.lower())
        return min(count, 5)  # Cap at 5
    
    def parse(self, pdf_file) -> Dict:
        """Main parsing function"""
        # Extract text
        text = self.extract_text_from_pdf(pdf_file)
        
        # Parse all fields
        result = {
            'name': self.extract_name(text),
            'email': self.extract_email(text),
            'phone': self.extract_phone(text),
            'skills': self.extract_skills(text),
            'education': self.extract_education(text),
            'experience_years': self.extract_experience_years(text),
            'raw_text': text[:500]  # First 500 chars for preview
        }
        
        return result