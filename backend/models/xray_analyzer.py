from ultralytics import YOLO
import torch
import os
import tempfile
from PIL import Image
import numpy as np


# Check if CUDA (GPU) is available
device = "cuda" if torch.cuda.is_available() else "cpu"

# Path to the model weights - update this to your actual path
MODEL_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), "Eldho_model", "best.pt")

# Initialize the model (lazy loading)
model = None

def load_model():
    """Load the YOLO model"""
    global model
    if model is None:
        if not os.path.exists(MODEL_PATH):
            raise FileNotFoundError(f"Model weights not found at {MODEL_PATH}")
        model = YOLO(MODEL_PATH, task='detect').to(device)
    return model

def analyze_xray_image(image_path):
    """
    Analyze dental X-ray image using YOLO model
    
    Args:
        image_path: Path to the X-ray image
        
    Returns:
        List of detections with class, confidence, and coordinates
    """
    # Load the model
    model = load_model()
    
    # Run inference
    results = model(image_path)
    
    # Process results
    detections = []
    
    # Class mapping based on your output
    class_mapping = {
        0: "Normal",
        1: "Periodontal Disease",
        2: "Caries",
        3: "Periapical Lesion",
        4: "Dental Calculus",
        5: "Impacted Teeth"
    }
    
    for result in results:
        boxes = result.boxes
        for i, box in enumerate(boxes):
            # Get class, confidence and coordinates
            cls_id = int(box.cls.item())
            # Use the mapping or fallback to the model's names
            cls_name = class_mapping.get(cls_id, result.names.get(cls_id, f"Class_{cls_id}"))
            conf = float(box.conf.item())
            coords = box.xyxy[0].tolist()  # Convert to list for JSON serialization
            
            detections.append({
                "id": i,
                "class": cls_name,
                "confidence": conf,
                "coordinates": [round(c, 2) for c in coords]
            })
    
    return detections

# For testing
if __name__ == "__main__":
    # Test with a sample image
    test_image = "../Eldho_model/112.jpg"
    if os.path.exists(test_image):
        results = analyze_xray_image(test_image)
        print(f"Detected {len(results)} objects:")
        for det in results:
            print(f"  {det['class']} (confidence: {det['confidence']:.2f})")
    else:
        print(f"Test image not found: {test_image}")
