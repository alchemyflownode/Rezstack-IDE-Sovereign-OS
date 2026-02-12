# audit-project.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "     REZSTACK PROJECT AUDIT" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 1. Check package manager lock files
Write-Host "📦 PACKAGE MANAGER FILES:" -ForegroundColor Yellow
Get-ChildItem -Path . -Include package-lock.json, bun.lock, yarn.lock, pnpm-lock.yaml -Recurse -File -ErrorAction SilentlyContinue | ForEach-Object {
    Write-Host "  • $($_.Name) - $($_.Length) bytes" -ForegroundColor White
}
Write-Host ""

# 2. Check all configuration files
Write-Host "⚙️  CONFIGURATION FILES:" -ForegroundColor Yellow
$configFiles = @("package.json", "tsconfig.json", "next.config.ts", "tailwind.config.ts", "components.json", ".env.local", ".env", ".eslintrc.json", ".prettierrc", "postcss.config.js")
foreach ($file in $configFiles) {
    if (Test-Path $file) {
        $item = Get-Item $file
        Write-Host "  • $file - $($item.Length) bytes" -ForegroundColor Green
    } else {
        Write-Host "  • $file - ❌ NOT FOUND" -ForegroundColor Red
    }
}
Write-Host ""

# 3. Check all script files
Write-Host "📜 SCRIPT FILES:" -ForegroundColor Yellow
Get-ChildItem -Path . -Include *.ps1, *.sh, *.bat, *.cmd -Recurse -File -ErrorAction SilentlyContinue | ForEach-Object {
    Write-Host "  • $($_.FullName.Replace((Get-Location).Path + "\", "")) - $($_.Length) bytes" -ForegroundColor White
}
Write-Host ""

# 4. Check all TypeScript/JavaScript files
Write-Host "📁 SOURCE FILES:" -ForegroundColor Yellow
$tsFiles = Get-ChildItem -Path src -Include *.ts, *.tsx, *.js, *.jsx -Recurse -File -ErrorAction SilentlyContinue
Write-Host "  📊 TypeScript/JavaScript files: $($tsFiles.Count)" -ForegroundColor White

$tsFiles | Group-Object Extension | ForEach-Object {
    Write-Host "    • $($_.Name): $($_.Count) files" -ForegroundColor Gray
}
Write-Host ""

# 5. Check for mini-services
Write-Host "🔧 MINI-SERVICES:" -ForegroundColor Yellow
if (Test-Path "mini-services") {
    $miniServices = Get-ChildItem -Path mini-services -Directory -ErrorAction SilentlyContinue
    Write-Host "  • mini-services directory found with $($miniServices.Count) subdirectories" -ForegroundColor Green
    foreach ($service in $miniServices) {
        if (Test-Path "$($service.FullName)/package.json") {
            Write-Host "    ✅ $($service.Name) - has package.json" -ForegroundColor Green
        } else {
            Write-Host "    ⚠️  $($service.Name) - no package.json" -ForegroundColor Yellow
        }
    }
} else {
    Write-Host "  • mini-services directory ❌ NOT FOUND" -ForegroundColor Red
}
Write-Host ""

# 6. Check .zscripts folder
Write-Host "📂 .ZSCRIPTS FOLDER:" -ForegroundColor Yellow
if (Test-Path ".zscripts") {
    $zscripts = Get-ChildItem -Path .zscripts -File -ErrorAction SilentlyContinue
    Write-Host "  • .zscripts directory found with $($zscripts.Count) files" -ForegroundColor Green
    foreach ($script in $zscripts) {
        Write-Host "    • $($script.Name) - $($script.Length) bytes" -ForegroundColor Gray
    }
} else {
    Write-Host "  • .zscripts directory ❌ NOT FOUND" -ForegroundColor Red
}
Write-Host ""

# 7. Check node_modules status
Write-Host "📦 NODE_MODULES:" -ForegroundColor Yellow
if (Test-Path "node_modules") {
    $nodeModulesSize = (Get-ChildItem -Path node_modules -Recurse -File -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum).Sum
    $nodeModulesCount = (Get-ChildItem -Path node_modules -Recurse -File -ErrorAction SilentlyContinue).Count
    $nodeModulesSizeMB = [math]::Round($nodeModulesSize / 1MB, 2)
    Write-Host "  • node_modules exists - $nodeModulesCount files, $nodeModulesSizeMB MB" -ForegroundColor Green
    
    # Check critical packages
    Write-Host "  • Critical packages:" -ForegroundColor White
    $criticalPackages = @("next", "react", "react-dom", "react-syntax-highlighter", "prisma", "@prisma/client")
    foreach ($pkg in $criticalPackages) {
        if (Test-Path "node_modules/$pkg") {
            Write-Host "    ✅ $pkg - installed" -ForegroundColor Green
        } else {
            Write-Host "    ❌ $pkg - MISSING" -ForegroundColor Red
        }
    }
} else {
    Write-Host "  • node_modules ❌ NOT FOUND" -ForegroundColor Red
}
Write-Host ""

# 8. Check Prisma
Write-Host "🗄️  PRISMA:" -ForegroundColor Yellow
if (Test-Path "prisma") {
    $prismaFiles = Get-ChildItem -Path prisma -File -ErrorAction SilentlyContinue
    Write-Host "  • prisma directory found with $($prismaFiles.Count) files" -ForegroundColor Green
    foreach ($file in $prismaFiles) {
        Write-Host "    • $($file.Name)" -ForegroundColor Gray
    }
} else {
    Write-Host "  • prisma directory ❌ NOT FOUND" -ForegroundColor Red
}
Write-Host ""

# 9. Check public folder
Write-Host "🖼️  PUBLIC FOLDER:" -ForegroundColor Yellow
if (Test-Path "public") {
    $publicFiles = Get-ChildItem -Path public -Recurse -File -ErrorAction SilentlyContinue
    Write-Host "  • public directory found with $($publicFiles.Count) files" -ForegroundColor Green
} else {
    Write-Host "  • public directory ❌ NOT FOUND" -ForegroundColor Red
}
Write-Host ""

# 10. Check .next folder (build output)
Write-Host "🏗️  NEXT BUILD:" -ForegroundColor Yellow
if (Test-Path ".next") {
    $nextFiles = Get-ChildItem -Path .next -Recurse -File -ErrorAction SilentlyContinue
    $nextCount = $nextFiles.Count
    Write-Host "  • .next directory found with $nextCount files" -ForegroundColor Green
} else {
    Write-Host "  • .next directory ❌ NOT FOUND (run build first)" -ForegroundColor Yellow
}
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "        AUDIT COMPLETE" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan