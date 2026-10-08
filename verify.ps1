$ErrorActionPreference = "Stop"
Push-Location $PSScriptRoot
try {
    Write-Host "==> Running EasyLM deterministic verification..." -ForegroundColor Cyan
    node scripts/verify.mjs
    if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
    Write-Host "`n==> All EasyLM verification checks passed green!" -ForegroundColor Green
} finally {
    Pop-Location
}
