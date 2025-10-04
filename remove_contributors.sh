#!/bin/bash

# Script to remove all contributors from git history
echo "Starting to remove all contributors from git history..."

# Create a backup first
echo "Creating backup..."
cd ..
cp -r goldavenue goldavenue-backup-$(date +%Y%m%d-%H%M%S)
cd goldavenue

# Use git filter-branch to rewrite history
echo "Rewriting git history..."
git filter-branch --env-filter '
    export GIT_AUTHOR_NAME="Anonymous"
    export GIT_AUTHOR_EMAIL="anonymous@example.com"
    export GIT_COMMITTER_NAME="Anonymous"
    export GIT_COMMITTER_EMAIL="anonymous@example.com"
' -- --all

# Clean up the backup refs
echo "Cleaning up backup references..."
git for-each-ref --format="delete %(refname)" refs/original | git update-ref --stdin

# Force garbage collection
echo "Running garbage collection..."
git reflog expire --expire=now --all
git gc --prune=now --aggressive

echo "Contributors have been removed from git history."
echo "All commits now show as 'Anonymous <anonymous@example.com>'"
