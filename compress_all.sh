#!/bin/bash
for ext in js css
  do
    echo "cleaning all .min.$ext"
    find . -name "*.min.$ext" -exec rm -f {} \;
    echo "looking for $ext"
    for f in `find . -name "*.$ext"`
      do
	pathf=$(dirname $f)
	namef=$(basename $f ".$ext")
	resf="$pathf/$namef.min.$ext"
	echo "minimizing $f to $resf"
	java -jar yuicompressor.jar -o $resf $f
      done
    done