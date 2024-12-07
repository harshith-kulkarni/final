from PIL import Image
import io
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import load_model
from tensorflow.keras.utils import load_img, img_to_array
import matplotlib.pyplot as plt

def preprocess_image(img_path, target_size=(1280, 1280)):
    img = load_img(img_path, target_size=target_size, color_mode='rgb')
    img_array = img_to_array(img)
    img_array = (img_array / 127.5) - 1.0
    img_array = np.expand_dims(img_array, axis=0)
    return img_array

def generate_image_from_input(generator_path, img_path):
    generator = load_model(generator_path, compile=False)
    input_image = preprocess_image(img_path)
    generated_image = generator.predict(input_image)
    generated_image = 0.5 * generated_image + 0.5
    gen_img = generated_image[0]
    return gen_img

def numpy_image_to_bytestring(image_array, format='PNG'):
    pil_image = Image.fromarray(np.uint8(image_array * 255))
    bytes_io = io.BytesIO()
    pil_image.save(bytes_io, format=format)
    bytestring = bytes_io.getvalue()
    return bytestring