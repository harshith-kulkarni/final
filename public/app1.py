from flask import Flask, request, send_file, jsonify
from sketch_to_color import generate_image_from_input, numpy_image_to_bytestring
import io
import os
from flask_cors import CORS
import uuid

app = Flask(__name__)
CORS(app)

GENERATOR_PATH = r"C:\Kmit\Project\my-app\public\pix2pix_generator_last.h5"

@app.route('/generate-image', methods=['POST'])
def generate_image():
    if 'image' not in request.files:
        return jsonify({"error": "No image file provided"}), 400

    img_file = request.files['image']
    temp_img_path = f'temp_image_{uuid.uuid4().hex}.png'  # Unique filename
    img_file.save(temp_img_path)

    try:
        gen_img_array = generate_image_from_input(GENERATOR_PATH, temp_img_path)
        img_bytes = numpy_image_to_bytestring(gen_img_array)

        return send_file(io.BytesIO(img_bytes), mimetype='image/png')
    except Exception as e:
        print(f"Error generating image: {e}")
        return jsonify({"error": "Failed to generate the image"}), 500
    finally:
        # Ensure the temporary image is deleted after processing
        if os.path.exists(temp_img_path):
            os.remove(temp_img_path)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)