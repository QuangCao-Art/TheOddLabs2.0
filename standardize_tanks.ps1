$content = Get-Content -Raw "src\engine\overworld.js"
$pattern = "(id:\s*'labTank(Green|Blue|Red)-[TB]_[^']+',\s*x:\s*\d+,\s*y:\s*\d+,\s*type:\s*'prop',\s*name:\s*')[^']+'"

$evaluator = [System.Text.RegularExpressions.MatchEvaluator] {
    param([System.Text.RegularExpressions.Match]$match)
    
    $prefix = $match.Groups[1].Value
    $color = $match.Groups[2].Value
    
    return "${prefix}${color} Specimen Tank'"
}

$newContent = [System.Text.RegularExpressions.Regex]::Replace($content, $pattern, $evaluator)

Set-Content -Path "src\engine\overworld.js" -Value $newContent -Encoding UTF8
Write-Host "Replaced tank names successfully."
