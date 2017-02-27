```
cd WORKSPACE

cd iotp-nitro-components
git checkout master
git pull origin master
git co -b task/prepare_release_X.Y.Z
## edit package.json to change version number    #"version": "X.Y.0"

git commit -a -m"release X.Y.0"        #be careful when commiting, do not add other local changes
git push origin task/prepare_release_X.Y.Z

## PR from task/prepare_release_X.Y.Z to master
## once merged...

git checkout master
git pull origin master
git tag -a X.Y.0 -m"release X.Y.0"
git push origin --tags
git checkout -b release/X.Y.0

git push origin release/X.Y.0

# return to develop status
git checkout -b task/prepare_X.Y.0-next
## edit package.json to change version number    #"version": "X.Y.0-next"

git commit -a -m"next version"
git push origin task/prepare_X.Y.Z-next

## PR from task/prepare_X.Y.Z-next to master
```
