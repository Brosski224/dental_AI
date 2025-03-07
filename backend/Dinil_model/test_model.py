# import torch
# from torchvision import transforms
# from PIL import Image
# import torch.nn as nn
# from torchvision.models import densenet121, DenseNet121_Weights

# num_classes = 6
# class CustomDenseNet(nn.Module):
#     def __init__(self, num_classes):
#         super(CustomDenseNet, self).__init__()
#         self.model = densenet121(weights=DenseNet121_Weights.IMAGENET1K_V1)  # Load pre-trained weights
#         self.model.classifier = nn.Linear(self.model.classifier.in_features, num_classes)

#     def forward(self, x):
#         return self.model(x)
    
# Load the trained model
# device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
# num_classes = 6  # Update this based on your dataset
# model = CustomDenseNet(num_classes)
# model.load_state_dict(torch.load(r"D:\Dental-Clinic-Management\backend\Dinil_model\dense_weights.pth", map_location=device))
# model.to(device)
# model.eval()

# # Define the same preprocessing used during training
# test_transform = transforms.Compose([
#     transforms.Resize((128, 128)),
#     transforms.CenterCrop((128, 128)),
#     transforms.ToTensor(),
#     transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225]),
# ])

# # Load an image for testing
# image_path = r"D:\Dental-Clinic-Management\backend\Dinil_model\Mouth_Ulcer_0_1003.jpeg"  # Update with the actual image path
# image = Image.open(image_path).convert("RGB")
# input_tensor = test_transform(image).unsqueeze(0).to(device)

# # Make a prediction
# with torch.no_grad():
#     output = model(input_tensor)
#     predicted_class = torch.argmax(output, dim=1).item()

# # Load class labels
# class_labels = ['Calculus', 'Caries', 'Gingivitis', 'Hypodontia', 'Tooth Discoloration', 'Ulcers']
# predicted_label = class_labels[predicted_class]

# print(f"Predicted Class: {predicted_label}")
import torch
from torchvision import transforms
from PIL import Image
import torch.nn as nn
from torchvision.models import densenet121, DenseNet121_Weights
import os

# Load the trained model
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
num_classes = 6  # Update based on dataset

# Define the model class
class CustomDenseNet(nn.Module):
    def __init__(self, num_classes):
        super(CustomDenseNet, self).__init__()
        self.model = densenet121(weights=DenseNet121_Weights.IMAGENET1K_V1)
        self.model.classifier = nn.Linear(self.model.classifier.in_features, num_classes)

    def forward(self, x):
        return self.model(x)

# Initialize and load model weights
model = CustomDenseNet(num_classes).to(device)
weights_path = r"D:/Dental-Clinic-Management/backend/Dinil_model/dense_weights.pth"

if not os.path.exists(weights_path):
    raise FileNotFoundError(f"Model weights not found at {weights_path}")

model.load_state_dict(torch.load(weights_path, map_location=device))
model.eval()

# Define image preprocessing
test_transform = transforms.Compose([
    transforms.Resize((128, 128)),
    transforms.CenterCrop((128, 128)),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225]),
])

# Class labels
class_labels = ['Calculus', 'Caries', 'Gingivitis', 'Hypodontia', 'Tooth Discoloration', 'Ulcers']

def predict_image(image: Image.Image) -> str:
    """ Preprocesses image, predicts class, and returns label. """
    input_tensor = test_transform(image).unsqueeze(0).to(device)

    with torch.no_grad():
        output = model(input_tensor)
        predicted_class = torch.argmax(output, dim=1).item()

    return class_labels[predicted_class]
