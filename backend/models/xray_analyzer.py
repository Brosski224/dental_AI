from ultralytics import YOLO
import torch
import os
import cv2
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

def save_annotated_image(image_path, results, output_path):
    """Save image with bounding boxes drawn"""
    image = cv2.imread(image_path)

    class_mapping = {
        0: "Normal",
        1: "Periodontal Disease",
        2: "Caries",
        3: "Periapical Lesion",
        4: "Dental Calculus",
        5: "Impacted Teeth"
    }

    for result in results:
        for box in result.boxes:
            x_min, y_min, x_max, y_max = map(int, box.xyxy[0].tolist())
            cls_id = int(box.cls.item())
            conf = float(box.conf.item())

            cls_name = class_mapping.get(cls_id, f"Class_{cls_id}")

            # Draw bounding box
            cv2.rectangle(image, (x_min, y_min), (x_max, y_max), (0, 255, 0), 2)
            label = f"{cls_name} ({conf:.2f})"
            cv2.putText(image, label, (x_min, y_min - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)

    cv2.imwrite(output_path, image)  # Save the image

def analyze_xray_image(image_path):
    """
    Analyze dental X-ray image using YOLO model and save output image
    
    Args:
        image_path: Path to the X-ray image
        
    Returns:
        List of detections with class, confidence, and coordinates
    """
    # Load the model
    model = load_model()
    
    # Run inference
    results = model(image_path)

    # Save annotated image
    output_path = os.path.join(os.path.dirname(image_path), "output.jpg")
    save_annotated_image(image_path, results, output_path)

    # Process results
    detections = []
    
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
            cls_id = int(box.cls.item())
            cls_name = class_mapping.get(cls_id, result.names.get(cls_id, f"Class_{cls_id}"))
            conf = float(box.conf.item())
            coords = box.xyxy[0].tolist()

            detections.append({
                "id": i,
                "class": cls_name,
                "confidence": conf,
                "coordinates": [round(c, 2) for c in coords]
            })
    
    return detections


# For testing
if __name__ == "__main__":
    test_image = "../Eldho_model/112.jpg"
    if os.path.exists(test_image):
        results = analyze_xray_image(test_image)
        print(f"Detected {len(results)} objects:")
        for det in results:
            print(f"  {det['class']} (confidence: {det['confidence']:.2f})")
        print("Annotated image saved as output.jpg")
    else:
        print(f"Test image not found: {test_image}")
