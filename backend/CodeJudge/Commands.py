# Dictionary to store compile commands for different file extensions
compile_commands = {
    'c': 'gcc test.c -o test',
    'cpp': 'g++ test.cpp -o test',
    'py': ""  # No compilation needed for Python
}

# Dictionary to store run commands for different file extensions
run_commands = {
    'c': './test < input.txt > output.txt',
    'cpp': './test < input.txt > output.txt',
    'py': 'python3 test.py< input.txt > output.txt'
}

# Dictionary to store compile commands for tester/checker program
cheker_compile_commands = {
    'c': 'gcc tester.c -o tester',
    'cpp': 'g++ tester.cpp -o tester',
    'py': ""  # No compilation needed for Python
}

# Dictionary to store run commands for tester/checker program
checker_run_commands = {
    'c': './tester < input.txt',
    'cpp': './tester < input.txt',
    'py': 'python3 tester.py < input.txt'
}

