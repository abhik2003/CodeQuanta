# Use an official GCC image from the Docker Hub
FROM gcc:latest

# Install Python and other necessary packages
RUN apt-get update && \
    apt-get install -y python3 python3-pip

# Verify installations
RUN gcc --version && \
    g++ --version && \
    python3 --version

# Create a working directory
WORKDIR /usr/src/app
