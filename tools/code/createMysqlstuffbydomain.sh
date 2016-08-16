#!/bin/bash

  DOMAIN=`ls /etc/apache2/sites-enabled/ | cut -f1 -d.`
  DBNAME=`ls /etc/apache2/sites-enabled/ | cut -f1 -d. | head -c${1:-16}`
  USERNAME=`ls /etc/apache2/sites-enabled/ | cut -f1 -d. | head -c${1:-16}`
  PASSWORD=$(date +%s | sha256sum | base64 | head -c 16; echo)
  IPADD=`curl -s checkip.dyndns.org|sed -e 's/.*Current IP Address: //' -e 's/<.*$//'`
  DOCROOT=`grep DocumentRoot -R /etc/apache2/sites-enabled/ | grep -v '#' | awk '{print $3}'`
  mysqladmin create ${DBNAME}
  echo "GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, DROP, INDEX, ALTER, CREATE TEMPORARY TABLES ON ${DBNAME}.* to '${USERNAME}'@'localhost' identified by '${PASSWORD}';" | mysql
  echo "flush privileges;" | mysql
  chown -R www-data:www-data $DOCROOT
  find $DOCROOT -type d -print0 | xargs -0 chmod 02775
  find $DOCROOT -type f -print0 | xargs -0 chmod 0664


  echo "********************"
  echo ">> DOMAIN: ${DOMAIN}.com"
  echo ">> IP: ${IPADD}"
  echo ">> Database: ${DBNAME}"
  echo ">> Username: ${USERNAME}"
  echo ">> Password: ${PASSWORD}"
  echo "********************"
