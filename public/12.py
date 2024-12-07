import torch
from transformers import DPTForDepthEstimation, DPTImageProcessor
import numpy as np
import open3d as o3d
from PIL import Image
import cv2

# Load DPT model and feature extractor
model = DPTForDepthEstimation.from_pretrained("Intel/dpt-large")
feature_extractor = DPTImageProcessor.from_pretrained("Intel/dpt-large")

# Load and preprocess image
image_path = r"C:\Users\hariv\Downloads\WhatsApp Image 2024-12-02 at 12.17.14_0a6ae684.jpg"
image = Image.open(image_path).convert("RGB")
image_np = np.array(image)

# Convert to grayscale and apply Gaussian Blur
gray = cv2.cvtColor(image_np, cv2.COLOR_RGB2GRAY)
blurred = cv2.GaussianBlur(gray, (5, 5), 0)

# Apply edge detection
edges = cv2.Canny(blurred, 50, 150)

# Dilate edges to make them more pronounced
dilated_edges = cv2.dilate(edges, np.ones((5, 5), np.uint8), iterations=2)

# Find contours
contours, _ = cv2.findContours(dilated_edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

# Create mask for the detected objects
object_mask = np.zeros_like(edges)
cv2.drawContours(object_mask, contours, -1, (255), thickness=cv2.FILLED)

# Apply the mask to the original image to isolate objects
isolated_objects = cv2.bitwise_and(image_np, image_np, mask=object_mask)
isolated_objects[object_mask == 0] = [0, 0, 0]  # Black-out background

# Convert isolated objects to PIL format for depth estimation
isolated_objects_pil = Image.fromarray(isolated_objects)

# Preprocess image for depth estimation
inputs = feature_extractor(images=isolated_objects_pil, return_tensors="pt")

# Perform inference for depth estimation
with torch.no_grad():
    outputs = model(**inputs)
    depth_map = outputs.predicted_depth.squeeze().cpu().numpy()

# Normalize the depth map
depth_map = (depth_map - depth_map.min()) / (depth_map.max() - depth_map.min())

# Apply a scaling factor to exaggerate depth (e.g., 1.5)
depth_scaling_factor = 1.5
depth_map *= depth_scaling_factor

# Generate 3D point cloud from depth map, excluding background
h, w = depth_map.shape
x = np.linspace(0, w, w)
y = np.linspace(0, h, h)
X, Y = np.meshgrid(x, y)
Z = depth_map

# Flatten and filter points with valid object depth
points = np.stack([X.ravel(), Y.ravel(), Z.ravel()], axis=1)

# Resize the object_mask to match depth map dimensions
object_mask_resized = cv2.resize(object_mask, (w, h), interpolation=cv2.INTER_NEAREST)
mask = (object_mask_resized > 0).ravel()  # Apply mask to filter valid points

# Filter points and colors
points = points[mask]

# Get RGB values from the isolated objects image
rgb = np.array(isolated_objects_pil.resize((w, h))) / 255.0  # Normalize to [0, 1]
colors = rgb.reshape(-1, 3)[mask]  # Apply the mask to colors

# Create the point cloud
pcd = o3d.geometry.PointCloud()
pcd.points = o3d.utility.Vector3dVector(points)
pcd.colors = o3d.utility.Vector3dVector(colors)

# Compute normals for better shading
pcd.estimate_normals(search_param=o3d.geometry.KDTreeSearchParamHybrid(radius=0.1, max_nn=30))

# Visualize the point cloud
o3d.visualization.draw_geometries([pcd])

# Optionally, convert the point cloud to a mesh using Poisson surface reconstruction
mesh, densities = o3d.geometry.TriangleMesh.create_from_point_cloud_poisson(pcd, depth=9)

# Visualize the mesh (surface) instead of the point cloud
o3d.visualization.draw_geometries([mesh])

# Save the generated mesh
o3d.io.write_triangle_mesh("3d_model_mesh.ply", mesh)
import cv2
import numpy as np
import matplotlib.pyplot as plt

# Load the image
import cv2
# import matplotlib.pyplot as plt
#
# # Load the image in grayscale
# image_path = r"C:\Users\hariv\Downloads\2048_colour-20241120T060913Z-001\2048_colour\padded_img104.jpg"  # Update with the correct path
# original_image = cv2.imread(image_path)
# gray_image = cv2.cvtColor(original_image, cv2.COLOR_BGR2GRAY)
#
# # Invert the grayscale image
# inverted_image = cv2.bitwise_not(gray_image)
#
# # Apply Gaussian Blur to the inverted image
# blurred_image = cv2.GaussianBlur(inverted_image, (21, 21), sigmaX=0, sigmaY=0)
#
# # Invert the blurred image
# inverted_blurred = cv2.bitwise_not(blurred_image)
#
# # Create the sketch by blending the grayscale image and the inverted blurred image
# sketch_image = cv2.divide(gray_image, inverted_blurred, scale=256.0)
#
# # Display the results
# plt.figure(figsize=(15, 10))
#
# # Original Image
# plt.subplot(1, 3, 1)
# plt.title("Original Image")
# plt.imshow(cv2.cvtColor(original_image, cv2.COLOR_BGR2RGB))
# plt.axis('off')
#
# # Grayscale Image
# plt.subplot(1, 3, 2)
# plt.title("Grayscale Image")
# plt.imshow(gray_image, cmap='gray')
# plt.axis('off')
#
# # Sketch Image
# plt.subplot(1, 3, 3)
# plt.title("Sketch Image")
# plt.imshow(sketch_image, cmap='gray')
# plt.axis('off')
#
# plt.show()
#
# # Save the sketch
# cv2.imwrite('sketch_output.jpg', sketch_image)



