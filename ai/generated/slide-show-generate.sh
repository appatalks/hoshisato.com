#!/bin/bash
# Generate Slide-Show HTML
# Hoshisato.com
# modified from https://lokeshdhakar.com/projects/lightbox2/#getting-started

dname=$1
echo $dname


processFile() {
    thumb=$(ls $img | sed "s/upscale//g" |sed "s/768/thumb/g")
    upscale=$img
    echo Processing image:$img

    if [ ! `echo $img|cut -c1-6` == "768-" ]; then
#       echo   "         <div style=\"background-image:url(https://hoshisato.com/ai/generated/upscale/$upscale)\"></div>" >> $indexfile
       echo   "        <a href=\"https://hoshisato.com/ai/generated/$upscale\" data-lightbox=\"stablediffusion\"><img src=thumb$thumb></a>" >> $indexfile
    fi
}

# Length of argument string is greater than zero
if [ -n "$dname" ] # Directory for creating index
then
   echo "dname" is $dname
   cd $dname
   fullpath=`pwd`

   indexfile=$fullpath/index.html
   if [ -f $fullpath/index.html ]
   then
      # Check if re-creating index.hml is wanted, overwriting old file
      echo "Overwrite index.html in ${fullpath}? (y/n)"
      read ANS
      case $ANS in
         "Y"|"y")
            echo rewriting ${fullpath}/index.html
            > ${fullpath}/index.html;;
          *) echo "Index file preserved - exiting"
            exit;;
      esac
   fi


# Prepare index file with headers
cat header.txt > $indexfile

cat <<EOF >> $indexfile
EOF
   if stat --printf='' upscale/*.jpeg 2>/dev/null; then
      for img in upscale/*.jpeg; do processFile; done
   fi
   cat <<EOF >>$indexfile

<pre><em>PLEASE SUPPORT - BITCOIN: 16CowvxvLSR4BPEP9KJZiR622UU7hGEce5<br /></em></pre>
<pre><a href="https://hoshisato.com/" title="Home">Return to Home Page</a>
<p>
<a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/"><img alt="Creative Commons License" style="border-width:0" src="https://i.creativecommons.org/l/by-nc-sa/4.0/88x31.png" /></a><br />This work is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/">Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License</a>

<script src="js/lightbox-plus-jquery.js"></script>
</body>
</html>
EOF

echo "That's it"

else
   echo "Directory parameter required in calling this program."
   exit
fi


