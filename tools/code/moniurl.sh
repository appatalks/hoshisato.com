#!/bin/bash

# monitor.sh - Monitors a web page for changes
# eSpeak alert if non 200 code is found
# Usage: ./moniurl.sh https://hoshisato.com

DOMAIN=$1

while true; do
if curl -s --head $DOMAIN | grep "200 OK" > /dev/null
 then
        sleep 10
 else
        espeak -k20 -v +f4 -p 70 -s 200 "Site down!"
	echo "Site Down <10 seconds"
fi
done

