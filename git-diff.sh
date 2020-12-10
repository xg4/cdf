#!/bin/bash

if [ -n "$(git status --porcelain)" ]; then
  echo "there are changes";
  git config user.name github-actions[bot]
  git config user.email github-actions[bot]@users.noreply.github.com
  git add .
  git commit -m "chore: update data source"
  git push
else
  echo "no changes";
fi
