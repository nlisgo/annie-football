# Use the official Nginx image as the base image
FROM nginx:latest

# Copy the custom Nginx configuration file
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the content of the src directory to the Nginx html directory
COPY src /usr/share/nginx/html
