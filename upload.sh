#!/bin/bash
npm run build:prod
scp -r dist/. root@121.36.42.208:/www/wwwroot/admin.yunxinjiang.net/
