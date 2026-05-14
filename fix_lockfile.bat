@echo off
cd /d "C:\Users\Eman\Hanta Virus Tracker\Hanta-Virus Tracker"
git remote set-url origin https://EmanGrib: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@github.com/EmanGrib/hantavirus-tracker.git
del package-lock.json
echo package-lock.json >> .gitignore
git add .gitignore
git rm --cached package-lock.json 2>nul
git add -A
git commit -m "Fix: remove package-lock.json (Windows esbuild conflict with Cloudflare Linux build)"
git push origin main
del "%~f0"
echo.
echo === PUSHED — Cloudflare will now rebuild with a fresh npm install ===
pause
