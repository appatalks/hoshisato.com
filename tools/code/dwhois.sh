#!/bin/bash
echo "######## WHOIS RESULT ########"
 
# Whois using the input variable
whois $1 |\
 
# Remove EOL characters
tr -d '\015\032' |\
 
# Remove leading spaces
sed 's/^ *//' |\
 
# Remove common unnecessary words from output
grep -v -e "@" -e "http://" -e "WHOIS" > wtmp1.txt
 
# Display domain name line
egrep 'omain .*ame.*(:|\.\.)' wtmp1.txt
 
# Display date lines
egrep -i "date|expir|create" wtmp1.txt
 
# Find out if the registrar value is on
# a separate line from the header field
if grep -i 'registrar.*[:.]$' wtmp1.txt 1> /dev/null
then
 # Return match for the registrar even if on a separate line
 # from the match
 egrep -i -A1 'registrar*(:|\.\.)$' wtmp1.txt
else
 # Return registrar if not on separate line
 egrep -i 'registrar.*(:|\.\.)|registration.*(:|\.\.)' wtmp1.txt
fi
 
# Display the name server lines
egrep -A 5 -m 5 'erver.*(:|\.\.)' wtmp1.txt |\
 
# remove empty lines
sed '/^$/d'
 
# Remove tmp file
rm -rf wtmp1.txt
 
echo "###############################"
