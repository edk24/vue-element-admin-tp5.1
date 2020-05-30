#!/bin/bash

# 本地文件是否发生了改变
woc=$(git status -s)
# 当前分支
branch=$(git symbolic-ref --short -q HEAD)

if [ 0 -lt ${#woc} ]; then
    remark="update"
    git add . && git commit -m "$USER $remark" && git pull origin $branch && git push origin $branch
else
    echo "本地代码没有改变 正在拉取代码";
    git pull origin $branch
fi
