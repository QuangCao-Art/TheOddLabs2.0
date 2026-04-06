$filePath = "src/engine/overworld.js"
$backupPath = "src/engine/overworld.js.bak"

# Create backup
Copy-Item $filePath $backupPath

# Read content
$content = Get-Content $filePath

# Keep lines 1-208 (indices 0-207) and 1737 onwards (index 1736 to end)
$newContent = $content[0..207] + $content[1736..($content.Length-1)]

# Write back
$newContent | Set-Content $filePath

Write-Host "Cleanup complete. Original lines: $($content.Length). New lines: $($newContent.Length)."
