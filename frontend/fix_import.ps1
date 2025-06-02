$filePath = "c:\Users\acer\OneDrive\Pictures\New folder\EventNow\frontend\src\pages\EventDetail.js"
$content = Get-Content -Path $filePath -Raw
$newContent = $content -replace 'import \{ useState, useEffect \} from ''react'';', 'import { useState, useEffect, useCallback } from ''react'';'
Set-Content -Path $filePath -Value $newContent
Write-Host "File updated successfully!"
