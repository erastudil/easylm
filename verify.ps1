$ErrorActionPreference = "Stop"
Push-Location $PSScriptRoot
try {
    Write-Host "==> Running EasyLM deterministic verification..." -ForegroundColor Cyan
    python scripts/compile_adapter_datasets.py --self-test
    if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
    node scripts/verify.mjs
    if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
    Write-Host "`n==> All EasyLM verification checks passed green!" -ForegroundColor Green
} finally {
    Pop-Location
}
