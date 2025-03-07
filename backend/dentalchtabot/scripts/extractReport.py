import os
import re
import pickle
from pypdf import PdfReader
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ------------------------------
# 1️⃣ Extract Structured Data from a Single PDF
# ------------------------------
def extract_medical_data(pdf_path):
    """Extract structured medical details from a single PDF file."""
    if not os.path.exists(pdf_path):
        print(f"❌ Error: File not found -> {pdf_path}")
        return None

    pdf_reader = PdfReader(pdf_path)
    text = "\n".join([page.extract_text() for page in pdf_reader.pages if page.extract_text()])

    # Extract structured details using regex
    patient_info = {
        "Name": re.search(r"Patient Name:\s*(.*)", text).group(1) if re.search(r"Patient Name:\s*(.*)", text) else "Unknown",
        "Age": int(re.search(r"Age:\s*(\d+)", text).group(1)) if re.search(r"Age:\s*(\d+)", text) else "Unknown",
        "Gender": re.search(r"Gender:\s*(.*)", text).group(1) if re.search(r"Gender:\s*(.*)", text) else "Unknown",
        "Blood Group": re.search(r"Blood Group:\s*(.*)", text).group(1) if re.search(r"Blood Group:\s*(.*)", text) else "Unknown",
        "Allergies": re.search(r"Allergies:\s*(.*)", text).group(1) if re.search(r"Allergies:\s*(.*)", text) else "None",
        "Existing Conditions": re.search(r"Existing Conditions:\s*(.*)", text).group(1) if re.search(r"Existing Conditions:\s*(.*)", text) else "None",
        "Current Medications": re.search(r"Current Medications:\s*(.*)", text).group(1) if re.search(r"Current Medications:\s*(.*)", text) else "None",
        "Doctor's Notes": re.search(r"Doctor's Notes:\s*(.*)", text).group(1) if re.search(r"Doctor's Notes:\s*(.*)", text) else "No Notes",
        "Previous Dental Procedures": re.search(r"Previous Dental Procedures:\s*(.*)", text).group(1) if re.search(r"Previous Dental Procedures:\s*(.*)", text) else "None",
    }

    print("✅ Extracted medical details:")
    for key, value in patient_info.items():
        print(f"   {key}: {value}")

    return patient_info

# ------------------------------
# 2️⃣ Save Extracted Data
# ------------------------------
def save_data(patient_info, file_name="medical_record.pkl"):
    """Save structured patient records."""
    with open(file_name, "wb") as f:
        pickle.dump(patient_info, f)
    print(f"✅ Medical record saved as {file_name}")

# ------------------------------
# 3️⃣ Main Execution
# ------------------------------
@app.post("/api/extract")
async def extract(file: UploadFile = File(...)):
    os.makedirs("temp", exist_ok=True)  # Ensure the temp directory exists
    file_path = f"temp/{file.filename}"
    with open(file_path, "wb") as f:
        f.write(await file.read())
    
    patient_data = extract_medical_data(file_path)
    os.remove(file_path)
    
    if patient_data:
        return patient_data
    return {"error": "Failed to extract data"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
