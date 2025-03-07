from ultralytics import YOLO
import torch

# Check if CUDA (GPU) is available
device = "cuda" if torch.cuda.is_available() else "cpu"

# Load a pre-trained YOLO model with explicit task definition
model = YOLO('best.pt', task='detect').to(device)  # Explicitly define the task

# Run inference on a test image
image_path = "91.jpg"  # Replace with your image path
results = model(image_path)

# Print detections
for result in results:
    result.show()  # Show image with detections
    print(result.boxes)  # Print bounding box details