#!/usr/bin/env bash
cd "$( dirname "$0" )"
for f in ../js/*coffee
do
  echo "Processing $f file..."
  coffee -c $f
done