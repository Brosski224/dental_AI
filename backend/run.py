import uvicorn
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(),
        logging.FileHandler('app.log')
    ]
)

if __name__ == "__main__":
    print("Starting Dental Clinic AI Backend...")
    print("Press Ctrl+C to stop the server")
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

