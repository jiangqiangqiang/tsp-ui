#!/bin/bash

# https://linuxstory.org/grep-regular-expressions/
#docker images | grep '[2-4][0-9]\{1,10\} hours ago' | grep 'epuchain-ui' | awk '{print $3}' | xargs --no-run-if-empty docker rmi
#docker images | grep '[0-9] days ago' | grep 'epuchain-ui' | awk '{print $3}' | xargs --no-run-if-empty docker rmi
#docker images | grep 'weeks ago' | grep 'epuchain-ui' | awk '{print $3}' | xargs --no-run-if-empty docker rmi
#docker images | grep 'months ago' | grep 'epuchain-ui' | awk '{print $3}' | xargs --no-run-if-empty docker rmi

# 取后n行
#docker images | grep '[2-4][0-9]\{0,10\} hours ago' | awk '{print $3}' | tail -10
#docker images | grep '[2-4][0-9]\{0,10\} hours ago' | awk '{print $3}' | sed -n '9,$p'
# 行数
# docker images | grep '[2-4][0-9]\{0,10\} hours ago' | awk '{print $3}' | wc -l
# http://www.cnblogs.com/wangkongming/p/3684905.html

docker ps -a | grep 'Exited' | grep -E 'epuchain-ui' | awk '{print $1}' | xargs --no-run-if-empty docker rm

docker images | grep 'epuchain-ui' | grep '[2-9][0-9]\{1,10\} hours ago' | awk '{print $3}' | xargs --no-run-if-empty docker rmi
docker images | grep 'epuchain-ui' | grep 'days ago' | awk '{print $3}' | xargs --no-run-if-empty docker rmi
docker images | grep 'epuchain-ui' | grep 'weeks ago' | awk '{print $3}' | xargs --no-run-if-empty docker rmi
docker images | grep 'epuchain-ui' | grep 'months ago' | awk '{print $3}' | xargs --no-run-if-empty docker rmi
