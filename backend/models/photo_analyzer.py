import torch
from torchvision import transforms
from PIL import Image
import torch.nn as nn
from torchvision.models import densenet121, DenseNet121_Weights
import os

# Path to the model weights - update this to your actual path
MODEL_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), "Dinil_model", "dense_weights.pth")

# Device configuration
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# Define the model class
class CustomDenseNet(nn.Module):
    def __init__(self, num_classes):
        super(CustomDenseNet, self).__init__()
        self.model = densenet121(weights=DenseNet121_Weights.IMAGENET1K_V1)
        self.model.classifier = nn.Linear(self.model.classifier.in_features, num_classes)

    def forward(self, x):
        return self.model(x)

# Initialize model (lazy loading)
model = None
class_labels = ['Calculus', 'Caries', 'Gingivitis', 'Hypodontia', 'Tooth Discoloration', 'Ulcers']
def load_model():
    """Load the DenseNet model"""
    global model
    if model is None:
        if not os.path.exists(MODEL_PATH):
            raise FileNotFoundError(f"Model weights not found at {MODEL_PATH}")

        # Initialize model
        num_classes = len(class_labels)
        model = CustomDenseNet(num_classes).to(device)

        # Load weights
        state_dict = torch.load(MODEL_PATH, map_location=device)
        print(f"Model weights loaded: {MODEL_PATH}")  # ✅ Debug log
        print("Model state dict keys:", state_dict.keys())  # ✅ Debug log
        model.load_state_dict(state_dict)
        model.eval()

    return model


# Define image preprocessing
test_transform = transforms.Compose([
    transforms.Resize((128, 128)),
    transforms.CenterCrop((128, 128)),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225]),
])

def analyze_dental_photo(image_path):
    try:
        model = load_model()
        
        # Load and preprocess the image
        image = Image.open(image_path).convert("RGB")
        input_tensor = test_transform(image).unsqueeze(0).to(device)

        # Make prediction
        with torch.no_grad():
            output = model(input_tensor)
            probabilities = torch.nn.functional.softmax(output, dim=1)[0]

        print(f"Raw model output: {output}")  # ✅ Debug log
        print(f"Class probabilities: {probabilities.tolist()}")  # ✅ Debug log

        predicted_class_idx = torch.argmax(probabilities).item()
        confidence = float(probabilities[predicted_class_idx].item())

        predicted_label = class_labels[predicted_class_idx]
        severity = "High" if confidence > 0.8 else "Moderate" if confidence > 0.6 else "Low"
        recommendations = get_recommendations_for_condition(predicted_label)

        return {
            "predicted_class": predicted_label,
            "confidence": confidence,
            "severity": severity,
            "recommendations": recommendations,
            "all_probabilities": {class_labels[i]: float(probabilities[i].item()) for i in range(len(class_labels))}
        }

    except Exception as e:
        print(f"Error in analyze_dental_photo: {str(e)}")
        return {
            "predicted_class": "Analysis Error",
            "confidence": 0.0,
            "severity": "Unknown",
            "recommendations": "Error analyzing the image. Please try again with a different image.",
            "error": str(e)
        }


def get_recommendations_for_condition(condition: str) -> str:
    """Return recommendations based on dental condition"""
    recommendations = {
        "Calculus": "Professional dental cleaning (scaling) is recommended to remove calculus buildup.",
        "Caries": "Dental fillings or restorations may be needed to treat cavities. Improve oral hygiene and reduce sugar intake.",
        "Gingivitis": "Improve oral hygiene with regular brushing and flossing. Professional cleaning recommended.",
        "Hypodontia": "Consultation with orthodontist for treatment options such as implants, bridges, or orthodontic space closure.",
        "Tooth Discoloration": "Professional teeth whitening or veneers may be considered depending on the cause of discoloration.",
        "Ulcers": "Topical medications to relieve pain. Avoid spicy foods and maintain good oral hygiene."
    }
    
    return recommendations.get(condition, "Consult with dentist for appropriate treatment options.")

# For testing
if __name__ == "__main__":
    # Test with a sample image
    test_image = "../Dinil_model/Mouth_Ulcer_0_1003.jpeg"
    if os.path.exists(test_image):
        result = analyze_dental_photo(test_image)
        print(f"Predicted class: {result['predicted_class']}")
        print(f"Confidence: {result['confidence']:.4f}")
        print(f"Severity: {result['severity']}")
        print(f"Recommendations: {result['recommendations']}")
    else:
        print(f"Test image not found: {test_image}")

