import subprocess

if __name__=="__main__":
    docker_image_name = "cpp_runner_image"
    
    # Build the Docker image 
    subprocess.run(["docker", "build", "-t", docker_image_name, "-f", "./Dockerfile", "."], check=True)