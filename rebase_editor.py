import sys
import re

filepath = sys.argv[1]
with open(filepath, 'r') as f:
    content = f.read()

content = re.sub(r'^pick ', 'edit ', content, flags=re.MULTILINE)

with open(filepath, 'w') as f:
    f.write(content)
