import os
import subprocess
import shutil
import threading
from CodeJudge.Commands import compile_commands, run_commands, cheker_compile_commands, checker_run_commands

def stop_and_remove_container(docker_container_name):
    # stop  the container after execution
    subprocess.run([
        "docker", "stop", docker_container_name
    ])

    print("Stopped")

    # Clean up: remove the container
    subprocess.run(["docker", "rm", docker_container_name])

    print(f"{docker_container_name} removed successfully")

def compile(docker_container_name: str, directory_name: str, extension: str):
    result = []

    docker_image_name = "cpp_runner_image"


    # Run the Docker container
    container_process = subprocess.run([
        "docker", "run", "--name", docker_container_name, "-v", f"{directory_name}:/usr/src/app","-d", "-i", "-t", docker_image_name
    ])
    if container_process.returncode !=0:  #Failed to create container
        result=[False, "something went wrong"]
        return result


    # Compile the program
    compile_process = subprocess.run(["docker", "exec", docker_container_name, "sh", "-c", compile_commands[extension]], stderr=subprocess.PIPE, text=True)
    return compile_process

def runSingleTestcase(docker_container_name: str, time_limit: int, extension: str):
    result=[]
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
    return result
        
def checker(docker_container_name: str,  tester_code_extension: str):
    try:
        execution_process = subprocess.run(
            ["docker", "exec", docker_container_name, "sh", "-c", checker_run_commands[tester_code_extension]],
            stdout=subprocess.PIPE,
            timeout=3,
            check=True,
            text=True
        )
        return [True, execution_process.stdout]
    except subprocess.TimeoutExpired:
        print(f"Execution exceeded the time limit of seconds")
        return [False, "Internal error"]
    except subprocess.CalledProcessError as e:
        print(f"Execution failed with error: {e}")
        return [False, "Internal error"]
    

def docker_handler(docker_container_name: str,directory_name: str,  time_limit: int, extension: str, tester_code: str, tester_code_extension: str, test_cases: list[str])->str:
    result = [True, "Accepted"]


    # if not os.path.exists(input_file_path):
        # raise FileNotFoundError(f"Input file {input_file_path} not found")

    #Compile the code submitted by the user
    compile_process=compile(docker_container_name, directory_name, extension)

    if compile_process.returncode !=0:
        print("Compilation error")
        result=[False, "Compilation error"]
    else: 
        #Compiled successfully
        #execute the program
        
        #Compile the tester's code
        subprocess.run(["docker", "exec", docker_container_name, "sh", "-c", cheker_compile_commands[tester_code_extension]], stderr=subprocess.PIPE, text=True)
        #run and check each test case
        for index,tc in enumerate(test_cases):
            #write down the test cae in input.txt
            input_source_path = f"{directory_name}input.txt"
            with open(input_source_path, "w") as input_file:
                input_file.write(tc)
                
            res = runSingleTestcase(docker_container_name, time_limit, extension)
            if res[0]:
                verdict = checker(docker_container_name, tester_code_extension)
                if(verdict[0] and (verdict[1].strip().lower() == "accepted")):
                    continue
                else:
                    print(verdict)
                    result = [False, f"Wrong answer on testcase {index+1}"]
                    break
            else:
                result=[False, f"{res[1]} on Test Case {index+1}"]
                break
            
    
        

    # Start a new thread to stop and remove the container 
    # Threading is used to return the result without waiting for the stop_and_remove_container to be completed
    thread = threading.Thread(target=stop_and_remove_container, args=(docker_container_name,))
    thread.start()
        

    print("Done")
    return result



def Judge(code: str, submission_id: str, extension: str, time_limit: int, tester_code: str, tester_code_extension: str, test_cases: list[str]):

    #Directory
    directory_name = f"{os.getcwd()}/{submission_id}/"
    #Create the directory first
    os.makedirs(directory_name, exist_ok=True)

    #Save the code in a file
    code_source_path = f"{directory_name}test.{extension}"
    with open(code_source_path, "w") as source_code:
        source_code.write(code)
        
    #Save the tester's code in a file
    tester_code_source_path = f"{directory_name}tester.{tester_code_extension}"
    with open(tester_code_source_path, "w") as source_code:
        source_code.write(tester_code)
    
    #Input will be temporarily storedin input.txt
    input_source_path = f"{directory_name}input.txt"

    docker_container_name = f"container{submission_id}"

    result = docker_handler(docker_container_name,directory_name, time_limit, extension,tester_code, tester_code_extension,test_cases)
    files = os.listdir(directory_name)

            
    thread = threading.Thread(target=shutil.rmtree, args=(directory_name,))
    thread.start()
    

    return result

# if __name__ == '__main__':
#     code = '''
# #include <iostream>
# #include <vector>
# using namespace std;
# int main()
# {
#     int n;
#     cin >> n;
#     while(n--){
#         int x;
#         cin>>x;
#         cout<<x*x<<" ";
#     }
#     return 0;
# }
# '''
#     input_="5\n1 2 3 4 5"
#     tester_code='''
# def test():
#     n = int(input())
#     a = list(map(int,input().split()))
#     ans =[ i*i for i in a]

#     with open('output.txt', 'r') as file:
#         lines = file.readlines()
#         non_blank_lines = [line.split() for line in lines if line.strip()]

#     if len(non_blank_lines)!=1:
#         print("WA1")
#         return
#     else:
#         try:
#             for i in range(len(ans)):
#                 if ans[i]!=int(non_blank_lines[0][i]):
#                     print("WA2")
#                     return
#             print("Accepted")
#         except Exception as e:
#             print("WA3")
#             return
    
# if __name__ == "__main__":
#     test()
#     '''
    
    
#     res=Judge(code, "123", "cpp", 3, tester_code, 'py', [input_,input_])
#     print(res)
    
