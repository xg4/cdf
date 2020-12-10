#!/bin/bash

if [ -n "$(git diff --exit-code)" ]; then
  echo "no changes";
  exit 0
else
  echo "there are changes";
  git config user.name github-actions[bot]
  git config user.email github-actions[bot]@users.noreply.github.com
  git add .
  git commit -m "chore: update data source"
  git push
fi
