#!/bin/bash
npm run build:prod
scp -r dist/. root@47.108.63.117:/www/wwwroot/admin.jyx.gzyczx.net/
