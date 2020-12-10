#!/bin/bash

if [ -n "$(git diff --exit-code)" ]; then
  echo "no changes";
  exit 0
else
  echo "there are changes";
fi
