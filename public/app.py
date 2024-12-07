from flask import Flask, request, jsonify, send_file
import io
from text_to_image import generate_image_from_text
from flask_cors import CORS
# Initialize Flask app
app = Flask(__name__)
CORS(app)


# Route for the root URL
@app.route('/')
def index():
    return "Welcome to the Image Generation API! Use /generate-image to generate images."


# Route to handle image generation request
@app.route('/generate-image', methods=['POST'])
def generate_image():
    try:
        # Get the JSON data containing the text prompt
        data = request.json
        prompt = data.get('prompt')

        if not prompt:
            return jsonify({"error": "No prompt provided"}), 400

        # Call the text-to-image function
        img_io, error_message = generate_image_from_text(prompt)

        if error_message:
            return jsonify({"error": error_message}), 500

        return send_file(img_io, mimetype='image/png')

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Run the Flask app
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)