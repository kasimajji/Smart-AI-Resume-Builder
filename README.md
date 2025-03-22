# ATS Resume Analyzer

A simple Flask API that analyzes resumes for ATS compatibility.

## Setup

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Run the server:
```bash
python app.py
```

## API Endpoints

### POST /api/ats/analyze

Analyzes a resume file for ATS compatibility.

**Request:**
- Method: POST
- Content-Type: multipart/form-data
- Body: 
  - file: PDF or DOCX file

**Response:**
```json
{
  "score": 85,
  "feedback": [
    {
      "type": "success",
      "message": "File format (PDF) is valid and commonly accepted by ATS systems"
    },
    {
      "type": "warning",
      "message": "Images detected: This may reduce ATS compatibility"
    }
  ],
  "keywords": ["experience", "skills", "education"]
}
```

## Features

- File format validation (PDF/DOCX)
- Table detection
- Image detection
- Keyword analysis
- Scoring system
- Detailed feedback




- npm install
- npm run dev
- npm run test

# start a feature
- git checkout -b feat/some-feature

# make changes
- git add .
- git commit -m "feat: short clear message"
- git push -u origin feat/some-feature

# when done
- git checkout master
- git pull origin master
- git merge feat/some-feature
- git push origin master
