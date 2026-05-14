@echo off
cd /d "C:\Users\Eman\Hanta Virus Tracker\Hanta-Virus Tracker"
git remote set-url origin https://EmanGrib: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@github.com/EmanGrib/hantavirus-tracker.git
git rm --cached package-lock.json 2>nul
git add -A
git commit -m "Remove package-lock.json (Win32 esbuild lock conflicts with Cloudflare Linux build)" 2>nul
git push origin main
del "%~f0"
echo.
echo === PUSHED — Cloudflare will now rebuild ===
pause
