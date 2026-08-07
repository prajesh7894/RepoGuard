# This is a dummy file to test RepoGuard's SAST Python scanner.
import os
import subprocess
import pickle
import yaml

# Debug Mode Enabled
DEBUG = True
app.run(host='0.0.0.0', port=5000, debug=True)

# Insecure Deserialization
def load_data(payload):
    data = pickle.loads(payload)
    data2 = yaml.load(payload)
    return data

# Arbitrary Code Execution
def execute_code(user_input):
    eval(user_input)
    exec(user_input)

# Command Injection
def run_command(cmd):
    os.system("ls -la " + cmd)
    subprocess.Popen("echo " + cmd, shell=True)
