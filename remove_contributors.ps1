# PowerShell script to remove all contributors from git history

Write-Host "Starting to remove all contributors from git history..."

# Create a backup first
Write-Host "Creating backup..."
Copy-Item -Path "." -Destination "..\goldavenue-backup-$(Get-Date -Format 'yyyyMMdd-HHmmss')" -Recurse

# Initialize a new git repository
Write-Host "Initializing new git repository..."
Remove-Item -Path ".git" -Recurse -Force -ErrorAction SilentlyContinue
git init

# Set git config
git config user.name "Anonymous"
git config user.email "anonymous@example.com"

# Add all files to the new repository
Write-Host "Adding all files to new repository..."
git add .

# Create initial commit
Write-Host "Creating initial commit..."
git commit -m "Initial commit - contributors removed"

Write-Host "Contributors have been removed from git history."
Write-Host "All commits now show as 'Anonymous <anonymous@example.com>'"
