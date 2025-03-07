import pickle
import os

# ------------------------------ 
# 1️⃣ Load Extracted Medical Data & X-ray Results 
# ------------------------------ 
def load_data(medical_file="D:/Dental-Clinic-Management/backend/dentalchtabot/scripts/medical_record.pkl",
              xray_file="D:/Dental-Clinic-Management/backend/dentalchtabot/scripts/xray_results.pkl"):
    """Load medical records and X-ray disease classification."""
    
    # Check if medical records file exists
    if not os.path.exists(medical_file):
        print(f"❌ Error: Medical records file not found -> {medical_file}")
        return None, None
    
    # Load medical records
    with open(medical_file, "rb") as f:
        medical_records_raw = pickle.load(f)
    print("✅ Medical records loaded successfully!")
    
    # Print the first few keys to understand the structure
    print(f"Keys in medical_records: {list(medical_records_raw.keys())[:5]}")
    
    # Restructure the data if it's in field-based format instead of patient-based
    restructured_records = {}
    
    # Check if this is field-based data (based on the output we saw)
    field_keys = ["Name", "Age", "Gender", "Blood Group", "Current Medications", 
                  "Existing Conditions", "Doctor Notes", "Previous Dental Procedures"]
    
    # Check if keys match expected field names (case insensitive)
    field_based = any(key.lower() in [f.lower() for f in field_keys] for key in list(medical_records_raw.keys())[:5])
    
    if field_based:
        print("📊 Detected field-based data structure. Restructuring...")
        # Create a dummy patient record assuming the first value in each key is for the same patient
        patient_record = {}
        for field, value in medical_records_raw.items():
            if isinstance(value, str) or isinstance(value, int):
                patient_record[field] = value
        
        # Store this restructured record
        restructured_records["Patient"] = patient_record
    else:
        # Keep the original structure if it's already patient-based
        restructured_records = medical_records_raw
    
    # Load X-ray results if available
    if os.path.exists(xray_file):
        with open(xray_file, "rb") as f:
            xray_results = pickle.load(f)
        print("✅ X-ray results loaded successfully!")
    else:
        print(f"⚠️ Warning: X-ray results file not found -> {xray_file}")
        # Create a dummy X-ray result
        xray_results = {"Patient": "Periodontal Disease"}
    
    return restructured_records, xray_results

# ------------------------------ 
# 2️⃣ Rule-Based Treatment Suggestion 
# ------------------------------ 
def suggest_treatment(medical_data, xray_disease):
    """Determine the treatment plan based on medical history and X-ray classification."""
    
    # Example Rules:
    if "Periodontal Disease" in xray_disease:
        if medical_data.get("Existing Conditions") and "Diabetes" in medical_data.get("Existing Conditions"):
            return "Deep cleaning with antibiotic therapy due to increased infection risk."
        return "Recommend scaling and root planing for periodontal disease."
    
    if "Cavity" in xray_disease:
        if medical_data.get("Current Medications") and "Blood Thinners" in medical_data.get("Current Medications"):
            return "Cavity detected. Avoid invasive procedures due to blood thinners. Consider fluoride treatment."
        return "Recommend tooth filling or root canal."
    
    if "Tooth Fracture" in xray_disease:
        return "Suggest dental crown or extraction depending on severity."
    
    return "No immediate treatment required. Regular monitoring suggested."

# ------------------------------ 
# 3️⃣ Generate Patient Report 
# ------------------------------ 
def generate_report(patient_name, patient_data, xray_disease):
    """Generate a structured report for a patient."""
    
    # Create the formatted report
    report = f"""🦷 **Dental Report for {patient_data.get('Name', patient_name)}**  
- **Date of Birth:** {patient_data.get('DOB', 'N/A')}  
- **Gender:** {patient_data.get('Gender', 'N/A')}  
- **Blood Group:** {patient_data.get('Blood Group', 'N/A')}  
- **Phone:** {patient_data.get('Phone', 'N/A')}  
- **Email:** {patient_data.get('Email', 'N/A')}  
- **Address:** {patient_data.get('Address', 'N/A')}  
- **Emergency Contact:** {patient_data.get('Emergency Contact', 'N/A')}  
**Medical History:**  
- **Allergies:** {patient_data.get('Allergies', 'None')}  
- **Existing Conditions:** {patient_data.get('Existing Conditions', 'None')}  
- **Current Medications:** {patient_data.get('Current Medications', 'None')}  
- **Previous Dental Procedures:** {patient_data.get('Previous Dental Procedures', 'None')}  
**Doctor's Notes:** {patient_data.get('Doctor Notes', 'No notes available.')}  
**X-ray Analysis:**  
- **Disease Detected:** {xray_disease}  
📌 **Treatment Plan:** {suggest_treatment(patient_data, xray_disease)}"""
    
    return report

# ------------------------------ 
# 4️⃣ Manual Demo Data Setup
# ------------------------------ 
def create_demo_data():
    """Create demo patient data in the expected format."""
    patient_record = {
        "Name": "John Doe",
        "DOB": "1990-05-15",
        "Gender": "Male",
        "Blood Group": "O+",
        "Phone": "123-456-7890",
        "Email": "john.doe@example.com",
        "Address": "123 Main St, Anytown, USA",
        "Emergency Contact": "Jane Doe (Wife) - 987-654-3210",
        "Allergies": "Penicillin",
        "Existing Conditions": "None",
        "Current Medications": "None",
        "Previous Dental Procedures": "Root canal on tooth #19 (2023)",
        "Doctor Notes": "Patient reported tooth sensitivity."
    }
    
    demo_records = {"John Doe": patient_record}
    demo_xray = {"John Doe": "Periodontal Disease"}
    
    return demo_records, demo_xray

# ------------------------------ 
# 5️⃣ Main Execution 
# ------------------------------ 
if __name__ == "__main__":
    # Try to load from pickle files
    medical_records, xray_results = load_data()
    
    # If no proper records found, use demo data
    if not medical_records or len(medical_records) == 0:
        print("ℹ️ Using demo data instead...")
        medical_records, xray_results = create_demo_data()
    
    # Generate reports for all patients
    for patient_name, patient_data in medical_records.items():
        try:
            xray_disease = xray_results.get(patient_name, "Unknown Disease")
            report = generate_report(patient_name, patient_data, xray_disease)
            print(report)
            print("\n" + "-" * 60 + "\n")
        except Exception as e:
            print(f"❌ Error processing patient '{patient_name}': {str(e)}")
            print("\n" + "-" * 60 + "\n")
    
    # Demo report as a fallback
    if len(medical_records) == 0:
        demo_records, demo_xray = create_demo_data()
        patient_name = "John Doe"
        report = generate_report(
            patient_name, 
            demo_records[patient_name], 
            demo_xray[patient_name]
        )
        print("💡 Demo Report:")
        print(report)