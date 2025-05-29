# Database Setup Script for EventNow

# Ask for PostgreSQL password
$pgPassword = Read-Host -Prompt "Enter your PostgreSQL 'postgres' user password" -AsSecureString
$pgPassword = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($pgPassword))

# Create .env file
$envContent = @"
# Database Configuration
DATABASE_TYPE=postgresql
DATABASE_NAME=eventnow
DATABASE_USER=postgres
DATABASE_PASSWORD=$pgPassword
DATABASE_HOST=localhost
DATABASE_PORT=5432

# JWT Configuration
SECRET_KEY=$([guid]::NewGuid().ToString())
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
"@

# Save to .env file
$envContent | Out-File -FilePath ".\.env" -Encoding utf8

# Set environment variable for current session
$env:PGPASSWORD = $pgPassword

# Check if database exists and create if it doesn't
$dbExists = & psql -U postgres -lqt | findstr "\beventnow\b"

if (-not $dbExists) {
    Write-Host "Creating database 'eventnow'..."
    & createdb -U postgres -h localhost -p 5432 eventnow
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Database 'eventnow' created successfully!" -ForegroundColor Green
    } else {
        Write-Host "Failed to create database. Please check your PostgreSQL installation and credentials." -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "Database 'eventnow' already exists." -ForegroundColor Yellow
}

# Run database migrations
Write-Host "Running database migrations..."
python -m alembic upgrade head

Write-Host "`n✅ Setup complete! You can now start the application with: python -m uvicorn main:app --reload" -ForegroundColor Green
