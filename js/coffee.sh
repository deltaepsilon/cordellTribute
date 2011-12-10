cd "$( dirname "$0" )"
for f in *coffee
do
  echo "Processing $f file..."
  coffee -c $f
done