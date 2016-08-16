
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html lang="en" xml:lang='en' xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Hoshi Sato - Tools</title>
    <meta name="description" content="TNT Notes" />
    <meta name="keywords" content="Hoshi, Sato, TNT, training, Linux" />
    <meta name="msvalidate.01" content="43F521FF5D6075596721E017ACC164F7" />
  
<!--- To activate Konami: UP UP DOWN DOWN LEFT RIGHT LEFT RIGHT B A -->
  <script type="text/javascript" src="konami.js"></script>
  <script type="text/javascript">
	var konami = new Konami('http://lindapark.net/');	
  </script>
<!-------------------------------------------------------------------->

</head>
<body>
<pre>
 ▄         ▄  ▄▄▄▄▄▄▄▄▄▄▄  ▄▄▄▄▄▄▄▄▄▄▄  ▄         ▄  ▄▄▄▄▄▄▄▄▄▄▄       ▄▄▄▄▄▄▄▄▄▄▄  ▄▄▄▄▄▄▄▄▄▄▄  ▄▄▄▄▄▄▄▄▄▄▄  ▄▄▄▄▄▄▄▄▄▄▄ 
▐░▌       ▐░▌▐░░░░░░░░░░░▌▐░░░░░░░░░░░▌▐░▌       ▐░▌▐░░░░░░░░░░░▌     ▐░░░░░░░░░░░▌▐░░░░░░░░░░░▌▐░░░░░░░░░░░▌▐░░░░░░░░░░░▌
▐░▌       ▐░▌▐░█▀▀▀▀▀▀▀█░▌▐░█▀▀▀▀▀▀▀▀▀ ▐░▌       ▐░▌ ▀▀▀▀█░█▀▀▀▀      ▐░█▀▀▀▀▀▀▀▀▀ ▐░█▀▀▀▀▀▀▀█░▌ ▀▀▀▀█░█▀▀▀▀ ▐░█▀▀▀▀▀▀▀█░▌
▐░▌       ▐░▌▐░▌       ▐░▌▐░▌          ▐░▌       ▐░▌     ▐░▌          ▐░▌          ▐░▌       ▐░▌     ▐░▌     ▐░▌       ▐░▌
▐░█▄▄▄▄▄▄▄█░▌▐░▌       ▐░▌▐░█▄▄▄▄▄▄▄▄▄ ▐░█▄▄▄▄▄▄▄█░▌     ▐░▌          ▐░█▄▄▄▄▄▄▄▄▄ ▐░█▄▄▄▄▄▄▄█░▌     ▐░▌     ▐░▌       ▐░▌
▐░░░░░░░░░░░▌▐░▌       ▐░▌▐░░░░░░░░░░░▌▐░░░░░░░░░░░▌     ▐░▌          ▐░░░░░░░░░░░▌▐░░░░░░░░░░░▌     ▐░▌     ▐░▌       ▐░▌
▐░█▀▀▀▀▀▀▀█░▌▐░▌       ▐░▌ ▀▀▀▀▀▀▀▀▀█░▌▐░█▀▀▀▀▀▀▀█░▌     ▐░▌           ▀▀▀▀▀▀▀▀▀█░▌▐░█▀▀▀▀▀▀▀█░▌     ▐░▌     ▐░▌       ▐░▌
▐░▌       ▐░▌▐░▌       ▐░▌          ▐░▌▐░▌       ▐░▌     ▐░▌                    ▐░▌▐░▌       ▐░▌     ▐░▌     ▐░▌       ▐░▌
▐░▌       ▐░▌▐░█▄▄▄▄▄▄▄█░▌ ▄▄▄▄▄▄▄▄▄█░▌▐░▌       ▐░▌ ▄▄▄▄█░█▄▄▄▄       ▄▄▄▄▄▄▄▄▄█░▌▐░▌       ▐░▌     ▐░▌     ▐░█▄▄▄▄▄▄▄█░▌
▐░▌       ▐░▌▐░░░░░░░░░░░▌▐░░░░░░░░░░░▌▐░▌       ▐░▌▐░░░░░░░░░░░▌     ▐░░░░░░░░░░░▌▐░▌       ▐░▌     ▐░▌     ▐░░░░░░░░░░░▌
 ▀         ▀  ▀▀▀▀▀▀▀▀▀▀▀  ▀▀▀▀▀▀▀▀▀▀▀  ▀         ▀  ▀▀▀▀▀▀▀▀▀▀▀       ▀▀▀▀▀▀▀▀▀▀▀  ▀         ▀       ▀       ▀▀▀▀▀▀▀▀▀▀▀ 
</pre>

<br>
Hello. Here are a list of tools I have created/assembled that I believe would make life of a Linux Admin all the better.<br> 
Took a while, but I think I finally got my space legs. -Ensign Hoshi Sato
<br>
<p>
<pre>
<b>Name:</b> <a href="watchconnections.sh">watchconnections.sh</a> Release v.0.0.1 (Oct. 20, 2014)
<b>Function:</b> Watch unique active connections to ports and number of connections individual IPs make.
<b>Usage:</b> bash <(curl -s http://hoshisato.com/tools/watchconnections.sh) # Snapshot
       while bash <(curl -s http://hoshisato.com/tools/watchconnections.sh); do sleep 10; done # Update Every 10 Seconds

<br>

Now that you have the basic knowledge in how to use Linux, and navigate a *nix system with ease, our next goal is to bridge the gap from technical knowledge to
how certain things are done on the floor as well as quick tips and userful tools that you will find invaluable with day to day use.

Note: With TNT, you have been given the tools and knowledge to learn everything you need to know through dedication, hard work and research.
If something seems to hard or the answers proves out of reach... Then just try harder! (or don't be afraid to ask for help ;)

What you have covered:

1) Setting up vhosts
Lets make it easy with:
# bash <(curl justcurl.com  -H "host: example.com " -H "x-docroot: /var/www/vhosts/example.com/public_html ")

#############################################################
#############################################################

2) Most common redirects:
Redirect / Redirects / Rewrite / Rewrites

=====================================
Redirect .org to .com
RewriteEngine on
RewriteCond %{HTTP_HOST} !^example\.org$
RewriteRule ^ http://example.org%{REQUEST_URI} [L,R=301]

=====================================

Redirect to HTTPS
RewriteEngine On
RewriteCond %{HTTPS} !=on
RewriteRule ^/?(.*) https://%{SERVER_NAME}/$1 [R,L]

=====================================

Nginx Redirect to non-www
    if ($host !~* ^www\.) {
    rewrite ^(.*)$ http://www.$host$1 permanent;
    }

=====================================

=====================================

URL Redirect to differect Location - but not exposed

Redirect to non-www
RewriteEngine On
RewriteCond %{HTTP_HOST} ^www.example.com$ [NC]
RewriteRule ^(.*)$ http://example.com/$1 [R=301,L]

=====================================

301 Redirect
Redirect 301 /api http://api.compucram.com
Redirect permanent /programs/example.php http://www.example.org/events/

=====================================

Force HTTPS for Admin
<Directory /var/www/vhosts/twmenu/admin>              
     RewriteEngine on
     RewriteCond %{HTTPS} off
     RewriteRule (.*) https://%{SERVER_NAME}%{REQUEST_URI} [L,R]
</Directory>

====================================

Rewrite a to localhost
RewriteRule ^xmlrpc\.php$ "http\:\/\/0\.0\.0\.0\/" [R=301,L]

====================================

To append a trailing slash
RewriteBase /
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_URI} !example.php
RewriteCond %{REQUEST_URI} !(.*)/$
RewriteRule ^(.*)$ http://domain.com/$1/ [L,R=301]

#############################################################
#############################################################

3) The only MySQL Commands you will ever need (at least till you learn to learn MySQL)
mysql> CREATE DATABASE databasename;
mysql> GRANT ALL PRIVILEGES ON databasename.* TO "wordpressusername"@"hostname" IDENTIFIED BY "password";
mysql> FLUSH PRIVILEGES;
mysql> UPDATE mysql.user SET Password=PASSWORD('AFNLmehYPT7uY') WHERE User='root';
mysql> RENAME USER 'magentouser'@'192.168.1.1' to 'magentouser'@'%';
mysql> SHOW DATABASES;
mysql> SHOW GRANTS FOR root@localhost;
mysql> select user,host,password from mysql.user;

mysqldump --all-databases --master-data | gzip -1 > /home/rack/<ticket-number>/all.sql.gz
zcat db_name.sql.gz | mysql db_name

mysql database < data.sql

perl <( curl -L https://raw.githubusercontent.com/major/MySQLTuner-perl/master/mysqltuner.pl)

#############################################################
#############################################################

4) Memcache
https://one.rackspace.com/display/MGC/Setup+memcache

php -i | grep session.save
memcached on the server
memcahce on the client.
port Opened in firewall.
Profit.

5) Varnish
https://one.rackspace.com/display/MGC/Varnish+Portal
http://www.varnish-cache.org

varnishstat
varnishd -C -f /etc/varnish/default.vcl
https://www.liberiangeek.net/2014/10/install-vanish-caches-accelerator-centos-7/

(For two webheads)
backend default {
    .host = "127.0.0.1";
    .port = "8080";
}
backend master {
    .host = "10.x.x.x"; ### WARNING: Do not pass Varnish to another Varnish instance
    .port = "8080";     ### If the master server has Apache/nginx/appname on port 8080, pass to 8080
}

6) Magento
https://one.rackspace.com/display/MGC/Magento+Spheres+of+Support

./shell
php indexer.php reindexall

7) Drupal
For Migrations:
https://www.drupal.org/node/776864

Permissions
[root@localhost]cd /path_to_drupal_installation
[root@localhost]chown -R greg:www-data .
[root@localhost]find . -type d -exec chmod u=rwx,g=rx,o= '{}' \;
[root@localhost]find . -type f -exec chmod u=rw,g=r,o= '{}' \;

[root@localhost]cd /path_to_drupal_installation/sites
[root@localhost]find . -type d -name files -exec chmod ug=rwx,o= '{}' \;
[root@localhost]for d in ./*/files
do
   find $d -type d -exec chmod ug=rwx,o= '{}' \;
   find $d -type f -exec chmod ug=rw,o= '{}' \;
done


Failed Login attempts:
mysql> use database;
mysql> DELETE FROM `flood`;


8) MailGun

==========================================================================================


<b>Name:</b> <a href="quick.php">Other Quick Commands</a>

</pre>



<br>
<form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
<input type="hidden" name="cmd" value="_s-xclick">
<input type="hidden" name="encrypted" value="-----BEGIN PKCS7-----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-----END PKCS7-----
">
<input type="image" src="https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif" border="0" name="submit" alt="PayPal - The safer, easier way to pay online!">
<img alt="" border="0" src="https://www.paypalobjects.com/en_US/i/scr/pixel.gif" width="1" height="1">
</form>
<a href="http://servingbaby.com">Through ServingBaby.com</a>
<br>
<a href="http://www.hoshisato.com">HoshiSato.com</a>
<a href="http://stbennett.org/contact/index.html"> Contact Me</a>
<br>
Hits: 
<?php
include ("counter.php");
?>

</body>
</html>
