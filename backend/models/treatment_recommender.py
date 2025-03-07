import os
import pickle
from typing import Dict, List, Any, Optional

def generate_treatment_plan(
    patient_data: Dict[str, Any],
    xray_findings: Optional[str] = None,
    photo_findings: Optional[str] = None
) -> Dict[str, Any]:
    """
    Generate a treatment plan based on patient data and analysis results
    
    Args:
        patient_data: Dictionary with patient information
        xray_findings: String with X-ray findings (comma-separated)
        photo_findings: String with photo findings (comma-separated)
        
    Returns:
        Dictionary with treatment plan
    """
    # Extract patient information
    name = patient_data.get("name", "")
    gender = patient_data.get("gender", "")
    blood_group = patient_data.get("bloodGroup", "")
    allergies = patient_data.get("allergies", "")
    existing_conditions = patient_data.get("existingConditions", "")
    current_medications = patient_data.get("currentMedications", "")
    previous_procedures = patient_data.get("previousDentalProcedures", "")
    
    # Process findings
    xray_conditions = parse_findings(xray_findings)
    photo_conditions = parse_findings(photo_findings)
    
    # Combine all conditions
    all_conditions = xray_conditions + photo_conditions
    
    # If no conditions found, return generic plan
    if not all_conditions:
        return {
            "diagnosis": "No specific dental issues detected",
            "symptoms": "None reported",
            "treatment": "Regular dental checkup and cleaning recommended",
            "medications": []
        }
    
    # Generate diagnosis based on conditions
    diagnosis = ", ".join(all_conditions)
    
    # Generate treatment plan based on conditions and patient data
    treatment_plan = determine_treatment(all_conditions, patient_data)
    
    # Generate medication recommendations
    medications = recommend_medications(all_conditions, allergies)
    
    return {
        "diagnosis": diagnosis,
        "symptoms": determine_symptoms(all_conditions),
        "treatment": treatment_plan,
        "medications": medications
    }

def parse_findings(findings_str: Optional[str]) -> List[str]:
    """Parse comma-separated findings into a list"""
    if not findings_str:
        return []
    
    return [finding.strip() for finding in findings_str.split(",") if finding.strip()]

def determine_symptoms(conditions: List[str]) -> str:
    """Determine symptoms based on conditions"""
    symptom_map = {
        "Calculus": "Visible tartar buildup, gum inflammation, bad breath",
        "Caries": "Tooth sensitivity, pain when eating sweet foods, visible holes or pits",
        "Gingivitis": "Red, swollen gums, bleeding when brushing, bad breath",
        "Hypodontia": "Missing teeth, difficulty chewing, speech issues",
        "Tooth Discoloration": "Yellow, brown, or gray staining on teeth",
        "Ulcers": "Painful sores in the mouth, difficulty eating or speaking",
        "Cavity": "Tooth sensitivity, pain, visible holes",
        "Periodontal Disease": "Receding gums, loose teeth, persistent bad breath",
        "Tooth Fracture": "Sharp pain when biting, sensitivity to temperature"
    }
    
    symptoms = [symptom_map.get(condition, "Unknown symptoms") for condition in conditions]
    return "; ".join(symptoms)

def determine_treatment(conditions: List[str], patient_data: Dict[str, Any]) -> str:
    """Determine treatment based on conditions and patient data"""
    # Check for special considerations based on patient data
    has_diabetes = "diabetes" in patient_data.get("existingConditions", "").lower()
    on_blood_thinners = "blood thinner" in patient_data.get("currentMedications", "").lower()
    
    # Generate treatment plan for each condition
    treatments = []
    
    for condition in conditions:
        if condition == "Calculus":
            treatments.append("Professional dental cleaning (scaling and root planing)")
            
        elif condition == "Caries" or condition == "Cavity":
            if on_blood_thinners:
                treatments.append("Conservative cavity treatment with fluoride application; avoid invasive procedures due to blood thinners")
            else:
                treatments.append("Dental filling or restoration to treat cavities")
                
        elif condition == "Gingivitis":
            treatments.append("Deep cleaning, improved oral hygiene routine, and antimicrobial mouthwash")
            
        elif condition == "Periodontal Disease":
            if has_diabetes:
                treatments.append("Intensive periodontal therapy with antibiotic treatment due to increased infection risk from diabetes")
            else:
                treatments.append("Scaling and root planing, possible surgical intervention if advanced")
                
        elif condition == "Hypodontia":
            treatments.append("Consultation for dental implants, bridges, or orthodontic treatment")
            
        elif condition == "Tooth Discoloration":
            treatments.append("Professional teeth whitening or dental veneers depending on cause of discoloration")
            
        elif condition == "Ulcers":
            treatments.append("Topical pain relief medication, antimicrobial mouthwash, and soft diet")
            
        elif condition == "Tooth Fracture":
            if on_blood_thinners:
                treatments.append("Temporary crown or protective covering; consult with physician before invasive procedures")
            else:
                treatments.append("Dental crown or extraction depending on fracture severity")
    
    # Add general recommendations
    treatments.append("Regular follow-up appointments to monitor progress")
    
    return ". ".join(treatments)

def recommend_medications(conditions: List[str], allergies: str) -> List[Dict[str, str]]:
    """Recommend medications based on conditions and allergies"""
    # Check for allergies
    is_allergic_to_penicillin = "penicillin" in allergies.lower()
    
    medications = []
    
    for condition in conditions:
        if condition == "Gingivitis" or condition == "Periodontal Disease":
            if is_allergic_to_penicillin:
                medications.append({
                    "name": "Clindamycin",
                    "dosage": "300mg",
                    "frequency": "twice daily",
                    "duration": "7 days"
                })
            else:
                medications.append({
                    "name": "Amoxicillin",
                    "dosage": "500mg",
                    "frequency": "three times daily",
                    "duration": "7 days"
                })
            
            medications.append({
                "name": "Chlorhexidine Gluconate Mouthwash",
                "dosage": "0.12%",
                "frequency": "twice daily",
                "duration": "14 days"
            })
            
        elif condition == "Caries" or condition == "Cavity":
            medications.append({
                "name": "Fluoride Toothpaste",
                "dosage": "1450ppm",
                "frequency": "twice daily",
                "duration": "ongoing"
            })
            
        elif condition == "Ulcers":
            medications.append({
                "name": "Benzocaine Gel",
                "dosage": "20%",
                "frequency": "as needed for pain",
                "duration": "7 days"
            })
            
        elif condition == "Tooth Fracture" or "Caries" in conditions:
            medications.append({
                "name": "Ibuprofen",
                "dosage": "400mg",
                "frequency": "every 6-8 hours as needed for pain",
                "duration": "3-5 days"
            })
    
    return medications

# For testing
if __name__ == "__main__":
    # Test with sample data
    test_patient = {
        "name": "John Doe",
        "gender": "Male",
        "bloodGroup": "O+",
        "allergies": "Penicillin",
        "existingConditions": "Diabetes",
        "currentMedications": "Metformin",
        "previousDentalProcedures": "Root canal (2023)"
    }
    
    test_xray = "Cavity, Periodontal Disease"
    test_photo = "Gingivitis"
    
    plan = generate_treatment_plan(test_patient, test_xray, test_photo)
    
    print("Treatment Plan:")
    print(f"Diagnosis: {plan['diagnosis']}")
    print(f"Symptoms: {plan['symptoms']}")
    print(f"Treatment: {plan['treatment']}")
    print("Medications:")
    for med in plan['medications']:
        if isinstance(med, dict):
            print(f"  {med['name']} {med['dosage']} - {med['frequency']} for {med['duration']}")
        else:
            print(f"  {med}")

