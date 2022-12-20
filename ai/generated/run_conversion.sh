#!/bin/bash
# Creates an index.html web page that displays image contents with a thumbnail image
# Adapted and modified from;
# User: keirvt - https://www.linuxquestions.org/questions/linux-software-2/browser-directroy-listing-with-thumbnails-4175681907/ 

# Rebuild and Rename all files to number increments.
rm -fr thumb/*
rm -fr upscale/*
rm -fr src/*
cp import/* .
sync
find . | grep -v import | grep -v images | grep -v page | grep 'jpeg' | nl -nrz -w3 -v1 | while read n f; do mv "$f" "$n.jpeg" && sync; done

codesrcdir='./'
thisdomain="https://hoshisato.com"

dname=$1
echo $dname

processFile() {
    extention=${img##*.}
    thumb=thumb-$img
    upscale=768-$img
    echo thumbname: $thumb
    echo Processing image:$img
    if [ $extention = "pdf" ]; then
       echo "Nothing to do!"

    elif [ $extention = "mp4" ]; then
       echo "Nothing to do!"

    else
       if [ -f "$thumb" ]; then
          echo Thumb $thumb exists - skipping
       else
          echo "converting $img to thumb-$img"
          convert -thumbnail 180 $img $thumb && sync
	  convert -scale 768 $img $upscale && sync
       fi
    fi
}

# Length of argument string is greater than zero
if [ -n "$dname" ] # Directory for creating index
then
   echo "dname" is $dname
   cd $dname
   fullpath=`pwd`
   
   if stat --printf='' *.jpg 2> /dev/null; then
      for img in *.jpg; do processFile; done
   fi
   if stat --printf='' *.JPG 2> /dev/null; then
      for img in *.JPG; do processFile; done
   fi
   if stat --printf='' *.png 2>/dev/null; then
      for img in *.png; do processFile; done
   fi
   if stat --printf='' *.jpeg 2>/dev/null; then
      for img in *.jpeg; do processFile; done
   fi

echo "Setting EXIF"
exiftool -author="hoshisato.com | AppaTalks" import/*jpeg 
exiftool -author="hoshisato.com | AppaTalks" *jpeg 
echo "Moving files into place"
mv 768*jpeg upscale/
mv thumb*jpeg thumb/
mv *jpeg src/

echo "That's it"

else
   echo "Directory parameter required in calling this program."
   exit
fi
