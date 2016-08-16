<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.d
td">
<html lang="en" xml:lang='en' xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Hoshi Sato - Tools</title>
    <meta name="description" content="Scripts for Linux Administration" />
    <meta name="keywords" content="Hoshi, Sato, Bash, Script, Linux" />
    <meta name="msvalidate.01" content="43F521FF5D6075596721E017ACC164F7" />
</head>
<body>

<p>

<pre>

==== APACHE PERFORMANCE ====
<b>Function:</b> Percentage of RAM a process takes (ie httpd) 
<b>Usage:</b> ps awfuxx | grep httpd|awk '{sum+=$4} END {print sum}'

<b>Function:</b> Apache Buddy
<b>Usage:</b> perl <( curl -k https://hoshisato.com/tools/code/apachebuddy.pl ) --port 80

<b>Function:</b> Apache2 Buddy
<b>Usage:</b> perl <( curl -k https://hoshisato.com/tools/code/apache2buddy.pl ) --port 80

<b>Function:</b> Poor Man's Apache Buddy
<b>Usage:</b> ps -o rss -C httpd,apache2,php-fpm | tail -n +2 | awk '{total+=$1}END{print "count : " NR "\ntotal : " total/1024 " MB" "\navg   : " total/1024/NR " MB"  }'

<b>Function:</b> NGINX Apache Buddy
<b>Usage:</b> curl -sk https://hoshisato.com/tools/code/nginxbuddy.py | python - -S 

<b>Function:</b> Apache Status
<b>Usage:</b> /etc/init.d/httpd fullstatus

<b>Function:</b> Page Loads
<b>Usage:</b> time wget -q -r level=1 http://

<b>Function:</b> Quick Vhost
<b>Usage:</b> bash <(curl justcurl.com -H "host: example.com " -H "x-docroot: /var/www/vhosts/example.com/public_html ")
<b>Usage:</b> *** SUPER BETA *** bash <(curl https://hoshisato.com -H "host: example.com " -H "x-docroot: /var/www/vhosts/example.com/public_html ")

==== QUICK REDIRECTS / REWRITES ====

<b>Function:</b> Rewrite URL's with "?" at the end
http://www.exmaple.com/Pages/series_display.php?de=443
Rewrites to =>
http://www.example.com/
<b>Usage:</b> 
RewriteEngine On
RewriteBase /
RewriteCond %{QUERY_STRING} ^de=443
RewriteRule ^(.*)$ http://www.example.com/? [L,R=301]

<b>Function:</b> Redirect .org to .com
<b>Usage:</b>
RewriteCond %{HTTP_HOST} !^example\.org$
RewriteRule ^ http://example.org%{REQUEST_URI} [L,R=301]

<b>Function:</b> Redirect to HTTPS
<b>Usage:</b>
RewriteCond %{HTTPS} !=on
RewriteRule ^/?(.*) https://%{SERVER_NAME}/$1 [R,L]

<b>Function:</b> Redirect to www
<b>Usage:</b>
RewriteCond %{HTTP_HOST}  ^example.com [nocase]
RewriteRule ^(.*)         http://www.example.com/$1 [last,redirect=301]

RewriteCond %{HTTP_HOST}  ^(www\.)example.com [nocase]
RewriteRule ^(.*)         http://www.example.com/$1 [last,redirect=301]

<b>Function:</b> Redirect to non-www
<b>Usage:</b>
RewriteCond %{HTTP_HOST} ^www.example.com$ [NC]
RewriteRule ^(.*)$ http://example.com/$1 [R=301,L]

<b>Function:</b> URL Redirect to differect Location - but not exposed
<b>Usage:</b> (Remove the _)
Alias /api /var/www/vhosts/api.example.com/site/public/index.php
<_Directory /var/www/vhosts/api.example.com/site/public>
     AllowOverride all
     Order allow,deny
     Allow from all
<_/Directory> 

<b>Function:</b> Force HTTPS for Admin
<b>Usage:</b> (Remove the _)
<_Directory /var/www/vhosts/example.com/admin>              
     RewriteEngine on
     RewriteCond %{HTTPS} off
     RewriteRule (.*) https://%{SERVER_NAME}%{REQUEST_URI} [L,R]
<_/Directory>

<b>Function:</b> Rewrite a to localhost (Localhost as in Client connecting - fun against brute forcers)
<b>Usage:</b> RewriteRule ^xmlrpc\.php$ "http\:\/\/0\.0\.0\.0\/" [R=301,L]

<b>Function:</b> To append a trailing slash
<b>Usage:</b>
RewriteBase /
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_URI} !example.php
RewriteCond %{REQUEST_URI} !(.*)/$
RewriteRule ^(.*)$ http://domain.com/$1/ [L,R=301]

<b>Function:</b> Varnish in Play?
<b>Usage:</b>
SetEnvIfNoCase X-Forwarded-For 192.168.xxx.xxx GOOD_IP=on
Order deny,allow
Deny from all
Allow from env=GOOD_IP



</pre>
</body>
</html>
