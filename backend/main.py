from fastapi import FastAPI, File, UploadFile, HTTPException, Form, Body, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
import os
import shutil
import tempfile
from typing import List, Dict, Any, Optional
from pydantic import BaseModel
import json
import pickle
from datetime import datetime
import re
import logging
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles



# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Import model modules
from models.xray_analyzer import analyze_xray_image
from models.photo_analyzer import analyze_dental_photo
from models.prescription_extractor import extract_medical_data
from models.treatment_recommender import generate_treatment_plan

# Create FastAPI app
app = FastAPI(title="Dental Clinic AI Backend")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create temp directory for file uploads if it doesn't exist
os.makedirs("static/temp", exist_ok=True)

# Define data models
class PatientData(BaseModel):
    name: str
    gender: Optional[str] = None
    bloodGroup: Optional[str] = None
    allergies: Optional[str] = None
    existingConditions: Optional[str] = None
    currentMedications: Optional[str] = None
    previousDentalProcedures: Optional[str] = None
    xrayFindings: Optional[str] = None
    photoFindings: Optional[str] = None

class TreatmentPlan(BaseModel):
    diagnosis: str
    symptoms: Optional[str] = None
    treatment: str
    medications: Optional[List[Dict[str, str]]] = None

class PatientRecord(BaseModel):
    firstName: str
    lastName: str
    dob: Optional[str] = None
    gender: Optional[str] = None
    bloodGroup: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    address: Optional[str] = None
    emergencyContact: Optional[str] = None
    allergies: Optional[str] = None
    existingConditions: Optional[str] = None
    currentMedications: Optional[List[Dict[str, str]]] = None
    previousDentalProcedures: Optional[str] = None
    notes: Optional[str] = None
    xrayAnalysis: Optional[Dict[str, Any]] = None
    photoAnalysis: Optional[Dict[str, Any]] = None
    treatmentPlan: Optional[Dict[str, Any]] = None
print("checkpoint1")
# API Endpoints
os.makedirs("temp", exist_ok=True)
@app.get("/")
async def root():
    print("Root endpoint called")  # Debug log
    return {"message": "Dental Clinic AI Backend API"}

# 1. Prescription Extraction Endpoint
@app.post("/api/extract")
async def extract_prescription(file: UploadFile = File(...)):
    print("Extract prescription endpoint called")  # Debug log
    if not file.filename.endswith('.pdf'):
        print("Invalid file type for prescription extraction")  # Debug log
        raise HTTPException(status_code=400, detail="Only PDF files are supported")
    
    # Save uploaded file temporarily
    temp_file_path = f"staic/temp/{file.filename}"
    with open(temp_file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    try:
        # Extract data from PDF
        logger.info(f"Extracting data from PDF: {file.filename}")
        print(f"Extracting data from PDF: {file.filename}")  # Debug log
        patient_data = extract_medical_data(temp_file_path)
        if not patient_data:
            logger.error("Failed to extract data from PDF")
            print("Failed to extract data from PDF")  # Debug log
            raise HTTPException(status_code=500, detail="Failed to extract data from PDF")
        
        logger.info(f"Successfully extracted data: {patient_data}")
        print(f"Successfully extracted data: {patient_data}")  # Debug log
        return patient_data
    except Exception as e:
        logger.error(f"Error processing PDF: {str(e)}")
        print(f"Error processing PDF: {str(e)}")  # Debug log
        raise HTTPException(status_code=500, detail=f"Error processing PDF: {str(e)}")
    finally:
        # Clean up temp file
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)
print("checkpoint2")
@app.post("/api/extract")
async def extract_prescription(file: UploadFile = File(...)):
    print("Extract prescription endpoint called")  # Debug log
    if not file.filename.endswith('.pdf'):
        print("Invalid file type for prescription extraction")  # Debug log
        raise HTTPException(status_code=400, detail="Only PDF files are supported")

    # ✅ Correct indentation
    temp_file_path = f"static/temp/{file.filename}"
    with open(temp_file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    try:
        # Extract data from PDF
        logger.info(f"Extracting data from PDF: {file.filename}")
        print(f"Extracting data from PDF: {file.filename}")  # Debug log
        patient_data = extract_medical_data(temp_file_path)
        if not patient_data:
            logger.error("Failed to extract data from PDF")
            print("Failed to extract data from PDF")  # Debug log
            raise HTTPException(status_code=500, detail="Failed to extract data from PDF")

        logger.info(f"Successfully extracted data: {patient_data}")
        print(f"Successfully extracted data: {patient_data}")  # Debug log
        return patient_data
    except Exception as e:
        logger.error(f"Error processing PDF: {str(e)}")
        print(f"Error processing PDF: {str(e)}")  # Debug log
        raise HTTPException(status_code=500, detail=f"Error processing PDF: {str(e)}")
    finally:
        # Clean up temp file
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)


# ✅ Serve images from "temp" instead of "static"
app.mount("/static/temp", StaticFiles(directory="temp"), name="temp")

@app.post("/api/analyze-xray")
async def analyze_xray(file: UploadFile = File(...)):
    print("Analyze X-ray endpoint called")  # Debug log

    if not file.filename.lower().endswith(('.png', '.jpg', '.jpeg')):
        print("Invalid file type for X-ray analysis")  # Debug log
        raise HTTPException(status_code=400, detail="Only image files (PNG, JPG, JPEG) are supported")

    # ✅ Ensure static/temp exists
    os.makedirs("static/temp", exist_ok=True)

    # ✅ Save uploaded file in static/temp
    temp_file_path = f"static/temp/{file.filename}"
    with open(temp_file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    try:
        # Analyze X-ray image (which also saves the processed image)
        logger.info(f"Analyzing X-ray image: {file.filename}")
        print(f"Analyzing X-ray image: {file.filename}")  # Debug log
        detections = analyze_xray_image(temp_file_path)

        # ✅ Save the processed image in static/temp
        output_image_path = "static/temp/output.jpg"

        logger.info(f"X-ray analysis results: {len(detections)} detections")
        print(f"X-ray analysis results: {len(detections)} detections")  # Debug log

        # ✅ Return detection details and image URL
        return {
            "detections": detections,
            "image_url": f"http://localhost:8000/static/temp/output.jpg"
        }

    except Exception as e:
        logger.error(f"Error analyzing X-ray: {str(e)}")
        print(f"Error analyzing X-ray: {str(e)}")  # Debug log
        raise HTTPException(status_code=500, detail=f"Error analyzing X-ray: {str(e)}")

    finally:
        # ✅ Remove the uploaded file after processing (optional)
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)

# 4. Treatment Plan Generation Endpoint
@app.post("/api/treatment-plan")
async def create_treatment_plan(patient_data: PatientData):
    print("Create treatment plan endpoint called")  # Debug log
    try:
        # Generate treatment plan
        logger.info(f"Generating treatment plan for patient: {patient_data.name}")
        print(f"Generating treatment plan for patient: {patient_data.name}")  # Debug log
        treatment_plan = generate_treatment_plan(
            patient_data.dict(),
            xray_findings=patient_data.xrayFindings,
            photo_findings=patient_data.photoFindings
        )
        
        logger.info(f"Treatment plan generated: {treatment_plan['diagnosis']}")
        print(f"Treatment plan generated: {treatment_plan['diagnosis']}")  # Debug log
        return treatment_plan
    except Exception as e:
        logger.error(f"Error generating treatment plan: {str(e)}")
        print(f"Error generating treatment plan: {str(e)}")  # Debug log
        raise HTTPException(status_code=500, detail=f"Error generating treatment plan: {str(e)}")

# 5. Save Patient Record Endpoint
@app.post("/api/patients")
async def save_patient(patient: PatientRecord):
    print("Save patient endpoint called")  # Debug log
    try:
        # In a real application, you would save to a database
        # For this example, we'll save to a JSON file
        
        # Generate a unique ID for the patient
        patient_id = f"P{datetime.now().strftime('%Y%m%d%H%M%S')}"
        
        # Add the patient ID to the record
        patient_dict = patient.dict()
        patient_dict["id"] = patient_id
        patient_dict["createdAt"] = datetime.now().isoformat()
        
        # Save to a JSON file (in a real app, save to database)
        patients_file = "data/patients.json"
        
        # Create data directory if it doesn't exist
        os.makedirs("data", exist_ok=True)
        
        # Load existing patients or create empty list
        if os.path.exists(patients_file):
            with open(patients_file, "r") as f:
                patients = json.load(f)
        else:
            patients = []
        
        # Add new patient
        patients.append(patient_dict)
        
        # Save updated list
        with open(patients_file, "w") as f:
            json.dump(patients, f, indent=2)
        
        logger.info(f"Patient record saved with ID: {patient_id}")
        print(f"Patient record saved with ID: {patient_id}")  # Debug log
        return {"id": patient_id, "message": "Patient record saved successfully"}
    except Exception as e:
        logger.error(f"Error saving patient record: {str(e)}")
        print(f"Error saving patient record: {str(e)}")  # Debug log
        raise HTTPException(status_code=500, detail=f"Error saving patient record: {str(e)}")

# Debug endpoint to check model paths
@app.get("/api/debug/model-paths")
async def debug_model_paths():
    print("Debug model paths endpoint called")  # Debug log
    from models.xray_analyzer import MODEL_PATH as XRAY_MODEL_PATH
    from models.photo_analyzer import MODEL_PATH as PHOTO_MODEL_PATH
    
    xray_model_exists = os.path.exists(XRAY_MODEL_PATH)
    photo_model_exists = os.path.exists(PHOTO_MODEL_PATH)
    
    return {
        "xray_model_path": XRAY_MODEL_PATH,
        "xray_model_exists": xray_model_exists,
        "photo_model_path": PHOTO_MODEL_PATH,
        "photo_model_exists": photo_model_exists
    }

if __name__ == "__main__":
    print("Starting server...")  # Debug log
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
