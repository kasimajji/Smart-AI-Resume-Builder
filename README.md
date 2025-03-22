- npm install
- npm run dev
- npm run test

# start a feature
- git checkout -b feat/some-feature

# make changes
- git add .
- git commit -m "feat: short clear message"
- git push -u origin feat/some-feature

# when done
- git checkout master
- git pull origin master
- git merge feat/some-feature
- git push origin master
