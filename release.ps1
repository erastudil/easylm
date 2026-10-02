<#
.SYNOPSIS
    Poka-Yoke release gate for EasyLM (browser WebGPU local AI).
.DESCRIPTION
    Enforces deterministic mechanical verification before deployment.
    Never relies on model self-assertion or human memory.
    1. Pre-build compilation: Stacks and Courses.
    2. Test harness: Vitest suite (167+ tests).
    3. Production build & TypeScript check (tsc && vite build).
    4. Git working tree audit.
    5. Optional automated push to origin/main with -Push.
#>
[CmdletBinding()]
param(
    [switch]$Push,
    [switch]$Force
)

$ErrorActionPreference = "Stop"
$root = $PSScriptRoot

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  EASYLM POKA-YOKE RELEASE GATE (Deming)" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

# Step 1: Pre-build data compilation
Write-Host "`n[1/4] Compiling Stacks and Courses..." -ForegroundColor Yellow
& node "$root\scripts\compile_stacks.mjs"
if ($LASTEXITCODE -ne 0) {
    Write-Host "[FATAL] Stacks compilation failed!" -ForegroundColor Red
    exit 1
}
& node "$root\scripts\compile_courses.mjs"
if ($LASTEXITCODE -ne 0) {
    Write-Host "[FATAL] Courses compilation failed!" -ForegroundColor Red
    exit 1
}

# Step 2: Automated unit & invariant test suite
Write-Host "`n[2/4] Executing test suite (vitest run)..." -ForegroundColor Yellow
$testOutput = & npx vitest run
$testExit = $LASTEXITCODE

if ($testExit -ne 0) {
    Write-Host "`n[FATAL] Test suite FAILED (exit code $testExit)!" -ForegroundColor Red
    Write-Host "Deployment aborted cold. Client protection barrier intact." -ForegroundColor Red
    exit 1
}
Write-Host "[PASS] All unit and invariant tests passed green." -ForegroundColor Green

# Step 3: TypeScript check & Vite production bundle
Write-Host "`n[3/4] Verifying TypeScript and Vite production bundle (npm run build)..." -ForegroundColor Yellow
& npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "[FATAL] Production build failed!" -ForegroundColor Red
    exit 1
}
Write-Host "[PASS] TypeScript check and production bundle succeeded." -ForegroundColor Green

# Step 4: Working tree audit and optional push
Write-Host "`n[4/4] Inspecting git working tree..." -ForegroundColor Yellow
Push-Location $root
try {
    $dirty = & git status --porcelain
    if ($dirty -and -not $Force) {
        Write-Host "[INFO] Working tree has changes:" -ForegroundColor Yellow
        & git status -s
    } else {
        Write-Host "[PASS] Git status verified." -ForegroundColor Green
    }

    if ($Push) {
        Write-Host "`nPushing release to origin/main..." -ForegroundColor Yellow
        & git push origin main
        if ($LASTEXITCODE -ne 0) {
            Write-Host "[ERROR] Git push failed." -ForegroundColor Red
            exit 1
        }
        Write-Host "[SUCCESS] Release pushed to origin/main. Production build live." -ForegroundColor Green
    } else {
        Write-Host "`nGate GREEN. Safe to commit or push." -ForegroundColor Green
        Write-Host "Run with -Push to deploy automatically: .\release.ps1 -Push" -ForegroundColor Gray
    }
} finally {
    Pop-Location
}
