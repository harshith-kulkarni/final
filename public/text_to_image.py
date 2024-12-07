import requests
import numpy as np
import cv2
import io
from PIL import Image

# API URL for the Stable Diffusion model
API_URL = "https://api-inference.huggingface.co/models/stable-diffusion-v1-5/stable-diffusion-v1-5"

# Replace with your actual Hugging Face API token
headers = {"Authorization": "Bearer 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"}

def query_model(payload):
    response = requests.post(API_URL, headers=headers, json=payload)
    if response.status_code != 200:
        return None, response.text  # Return error message if request fails
    return response.content, None

def generate_image_from_text(prompt):
    # Call the model with the prompt
    image_bytes, error_message = query_model({
        "inputs": prompt,   
    })

    if error_message:
        return None, error_message

    if image_bytes is not None:
        # Convert byte stream to an image using OpenCV
        nparr = np.frombuffer(image_bytes, np.uint8)
        image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        if image is not None:
            # Convert BGR to RGB for Flask response
            image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

            # Convert image to PIL format to save and send as a response
            pil_img = Image.fromarray(image_rgb)
            img_io = io.BytesIO()
            pil_img.save(img_io, 'PNG')  # Save as PNG
            img_io.seek(0)

            return img_io, None  # Return image buffer and no error message

        return None, "Unable to decode the image"

    return None, "No image data received"