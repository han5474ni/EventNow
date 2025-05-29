# PostgreSQL Setup Script for EventNow
# This script will help set up PostgreSQL for the EventNow project

# Check if PostgreSQL is installed
$pgInstalled = Get-Command psql -ErrorAction SilentlyContinue

if (-not $pgInstalled) {
    Write-Host "PostgreSQL is not installed or not in PATH." -ForegroundColor Red
    Write-Host "Please install PostgreSQL from: https://www.postgresql.org/download/windows/"
    Write-Host "Make sure to remember the password you set for the 'postgres' user during installation."
    exit 1
}

# Default PostgreSQL credentials
$pgUser = "postgres"
$pgPassword = Read-Host -Prompt "Enter PostgreSQL password for user 'postgres'"
$pgHost = "localhost"
$pgPort = "5432"
$dbName = "eventnow"

# Set environment variables for the current session
$env:PGPASSWORD = $pgPassword

# Create .env file
$envContent = @"
# Database Configuration
DATABASE_TYPE=postgresql
DATABASE_NAME=$dbName
DATABASE_USER=$pgUser
DATABASE_PASSWORD=$pgPassword
DATABASE_HOST=$pgHost
DATABASE_PORT=$pgPort

# JWT Configuration
SECRET_KEY=$(New-Guid)
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
"@

# Save to .env file
$envContent | Out-File -FilePath ".\.env" -Encoding utf8

# Create database if it doesn't exist
$checkDbExists = & psql -U $pgUser -h $pgHost -p $pgPort -lqt | findstr "\b$dbName\b"

if (-not $checkDbExists) {
    Write-Host "Creating database '$dbName'..."
    & createdb -U $pgUser -h $pgHost -p $pgPort $dbName
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Database '$dbName' created successfully!" -ForegroundColor Green
    } else {
        Write-Host "Failed to create database. Please check your PostgreSQL credentials and try again." -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "Database '$dbName' already exists." -ForegroundColor Yellow
}

# Install required Python packages
Write-Host "Installing required Python packages..."
pip install psycopg2-binary python-dotenv

Write-Host "`n✅ PostgreSQL setup complete!" -ForegroundColor Green
Write-Host "You can now run the application with: python -m uvicorn main:app --reload" -ForegroundColor Cyan
Write-Host "`n⚠️  Important: The .env file contains sensitive information. Do not commit it to version control." -ForegroundColor Yellow
