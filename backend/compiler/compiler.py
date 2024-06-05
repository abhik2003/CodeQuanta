import os
import subprocess
import shutil
import threading
from compiler.commands import compile_commands, run_commands

def stop_and_remove_container(docker_container_name):
    # stop  the container after execution
    subprocess.run([
        "docker", "stop", docker_container_name
    ])

    print("Stopped")

    # Clean up: remove the container
    subprocess.run(["docker", "rm", docker_container_name])

    print(f"{docker_container_name} removed successfully")


def docker_handler(docker_container_name: str,directory_name: str, source_path: str, input_file_path: str, time_limit: int, extension: str)->str:
    result = []

    docker_image_name = "cpp_runner_image"

    # Ensure the necessary files exist
    if not os.path.exists(source_path):
        raise FileNotFoundError(f"source file {source_path} not found")
    if not os.path.exists(input_file_path):
        raise FileNotFoundError(f"Input file {input_file_path} not found")

    # Run the Docker container
    container_process = subprocess.run([
        "docker", "run", "--name", docker_container_name, "-v", f"{directory_name}:/usr/src/app","-d", "-i", "-t", docker_image_name
    ])
    if container_process.returncode !=0:  #Failed to create container
        result=[False, "something went wrong"]
        return result


    # Compile the program
    compile_process = subprocess.run(["docker", "exec", docker_container_name, "sh", "-c", compile_commands[extension]], stderr=subprocess.PIPE, text=True)
    if compile_process.returncode !=0:
        print("Compilation error")
        result=[False, compile_process.stderr]
    else: 
        #Compiled successfully
        #execute the program

        # Execute the Docker command with a time limit
        try:
            execution_process = subprocess.run(
                ["docker", "exec", docker_container_name, "sh", "-c", run_commands[extension]],
                timeout=time_limit,
                check=True
            )
            print("Execution completed successfully")
            result= [True, "Successfully executed"]
        except subprocess.TimeoutExpired:
            print(f"Execution exceeded the time limit of {time_limit} seconds")
            result=[False, "Time limit exceeded"]
        except subprocess.CalledProcessError as e:
            print(f"Execution failed with error: {e}")
            result=[False, "Runtime error"]
        

    # Start a new thread to stop and remove the container 
    # Threading is used to return the result without waiting for the stop_and_remove_container to be completed
    thread = threading.Thread(target=stop_and_remove_container, args=(docker_container_name,))
    thread.start()
        

    print("Done")
    return result



def compile_and_run(code: str, input_: str, submission_id: str, extension: str, time_limit: int):

    #Directory
    directory_name = f"{os.getcwd()}/{submission_id}/"
    #Create the directory first
    os.makedirs(directory_name, exist_ok=True)

    #Save the code in a file
    code_source_path = f"{directory_name}test.{extension}"
    with open(code_source_path, "w") as source_code:
        source_code.write(code)
        
    #Save the input_ in a file
    input_source_path = f"{directory_name}input.txt"
    with open(input_source_path, "w") as input_file:
        input_file.write(input_)

    docker_container_name = f"container{submission_id}"

    result = docker_handler(docker_container_name,directory_name, code_source_path, input_source_path, time_limit, extension)
    files = os.listdir(directory_name)

    if result[0]:
        output_file_path = f'{directory_name}output.txt'
        file = open(output_file_path, 'r')
        file_content = file.read()
        file.close()

        result[1]=file_content
            
    thread = threading.Thread(target=shutil.rmtree, args=(directory_name,))
    thread.start()
    

    return result
