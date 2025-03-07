import os
import re
import pickle
from pypdf import PdfReader
import tempfile
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def extract_medical_data(pdf_path):
    """
    Extract structured medical details from a PDF file
    
    Args:
        pdf_path: Path to the PDF file
        
    Returns:
        Dictionary with extracted medical data
    """
    if not os.path.exists(pdf_path):
        raise FileNotFoundError(f"File not found: {pdf_path}")

    try:
        pdf_reader = PdfReader(pdf_path)
        text = "\n".join([page.extract_text() for page in pdf_reader.pages if page.extract_text()])
        
        # Log the extracted text for debugging
        logger.info(f"Extracted text from PDF: {text[:200]}...")  # Log first 200 chars
    except Exception as e:
        logger.error(f"Error reading PDF: {str(e)}")
        raise ValueError(f"Error reading PDF: {str(e)}")

    # Extract structured details using regex
    patient_info = {
        "Name": extract_field(text, r"Patient Name:\s*(.*)", ""),
        "Age": extract_field(text, r"Age:\s*(\d+)", ""),
        "Gender": extract_field(text, r"Gender:\s*(.*)", ""),
        "Blood Group": extract_field(text, r"Blood Group:\s*(.*)", ""),
        "Allergies": extract_field(text, r"Allergies:\s*(.*)", ""),
        "Existing Conditions": extract_field(text, r"Existing Conditions:\s*(.*)", ""),
        "Current Medications": extract_field(text, r"Current Medications:\s*(.*)", ""),
        "Doctor's Notes": extract_field(text, r"Doctor's Notes:\s*(.*)", ""),
        "Previous Dental Procedures": extract_field(text, r"Previous Dental Procedures:\s*(.*)", ""),
    }
    
    # If no name was found, try alternative patterns
    if not patient_info["Name"]:
        # Try other common patterns
        name_patterns = [
            r"Name:\s*(.*)",
            r"Patient:\s*(.*)",
            r"Patient Information\s*\n\s*(.*)",
            r"PATIENT NAME:\s*(.*)"
        ]
        
        for pattern in name_patterns:
            name = extract_field(text, pattern, "")
            if name:
                patient_info["Name"] = name
                break
    
    # Log the extracted info
    logger.info(f"Extracted patient info: {patient_info}")
    
    # If still no name found, don't default to "John Doe"
    if not patient_info["Name"]:
        patient_info["Name"] = ""  # Empty string instead of default
    
    # Save a copy of the extracted data (for debugging/reference)
    save_data(patient_info)

    return patient_info

def extract_field(text, pattern, default=""):
    """Extract a field using regex pattern"""
    match = re.search(pattern, text, re.IGNORECASE)
    if match:
        value = match.group(1).strip()
        # Log successful extraction
        logger.debug(f"Extracted '{value}' using pattern '{pattern}'")
        return value
    else:
        # Log failed extraction
        logger.debug(f"Failed to extract using pattern '{pattern}'")
        return default

def save_data(patient_info, file_name="medical_record.pkl"):
    """Save structured patient records for reference"""
    # Create directory if it doesn't exist
    os.makedirs("data", exist_ok=True)
    
    file_path = os.path.join("data", file_name)
    with open(file_path, "wb") as f:
        pickle.dump(patient_info, f)

# For testing
if __name__ == "__main__":
    # Test with a sample PDF
    test_pdf = "../dentalchtabot/sample_medical_record.pdf"
    if os.path.exists(test_pdf):
        data = extract_medical_data(test_pdf)
        print("Extracted medical details:")
        for key, value in data.items():
            print(f"  {key}: {value}")
    else:
        print(f"Test PDF not found: {test_pdf}")

