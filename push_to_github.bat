@echo off
cd /d "c:\Users\abiji\OneDrive\Desktop\Next-3d-app\next-3d-pallet"
git init
git add .
git commit -m "Add pallet assembly with sandwich fix and rotation controls"
git remote add origin https://github.com/Riicko-19/ITJUSTWORKS.git
git branch -M main
git push -u origin main
pause
