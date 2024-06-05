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
