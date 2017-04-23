#!/bin/sh
git pull
git add .
git commit -m "updated weather conditions"
git push origin gh-pages
