import os
import subprocess

# The email that previously resulted in green squares:
target_email = "prajesh7894@users.noreply.github.com"

# Set git configs
os.system(f'git config --global user.email "{target_email}"')
os.system(f'git config user.email "{target_email}"')

# Set up rebase editor
os.environ["GIT_SEQUENCE_EDITOR"] = "python rebase_editor.py"

# Start interactive rebase
os.system("git rebase -i HEAD~4")

# Amend each commit
for _ in range(4):
    os.system("git commit --amend --reset-author --no-edit")
    os.system("git rebase --continue")

# Force push
os.system("git push --force")
