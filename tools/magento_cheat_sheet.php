<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html lang="en" xml:lang='en' xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Hoshi Sato - Tools</title>
    <meta name="description" content="Scripts for Linux Administration" />
    <meta name="keywords" content="Hoshi, Sato, Bash, Script, Linux" />
    <meta name="msvalidate.01" content="43F521FF5D6075596721E017ACC164F7" />
  
<!--- To activate Konami: UP UP DOWN DOWN LEFT RIGHT LEFT RIGHT B A -->
  <script type="text/javascript" src="konami.js"></script>
  <script type="text/javascript">
        var konami = new Konami('http://lindapark.net/');       
  </script>
<!-------------------------------------------------------------------->

</head>
<body>
<p>
<pre>

Magento can sometimes be a beast to work with. Here are some notes:

<b><i>Important Areas</i></b>
==============

app/Mage.php - Has Version Info.
app/code/community/ - Plugins Go Here.
app/code/local - Custom Code Goes Here.
app/etc/modules - Modules Directory (less is best) 
../Cm_RedisSession.xml - Will want to modify this file if using Redis for Sessions
app/etc/local.xml - Set [DB / Session / Cache] Config

./cron.sh - trigger to run crons for magento

media/catalog - Great for NFS, some caching happens here  
var/log
var/report
var/cache
var/full_page_cache (Enterprise Edition)
var/session

<b><i>Important Tables</i></b>
==============

--core_config_data - Main Config Table
# SELECT * from core_config_data WHERE path LIKE "%some_setting%";
i.e. %url%, %redirect%, %secure%

--core_cache_option
# SELECT * from core_cache_option;
(should be 1)

--log_* ( If DB is very large maybe clean the DB Logs )
Admin Panel -> Advanced -> System -> Log Cleaning

<b><i>Tuning</i></b>
==============

Magento can do replication natively. (Not recommended cause its buggy - old school MySQL replication recommended)

[MySQL]
max_allowed_packet = 256M+
innodb_lock_wait_timeout = 200


ApacheBench Mark.
ab -c6 -n60 http://<mydomain>/index.html

OpCache PHP>=5.4
php55u-opcache
https://raw.githubusercontent.com/rlerdorf/opcache-status/master/opcache.php
/etc/php.d/10-opcache.ini

PHP MEM >= 512MB

<b><i>Session and Cache</i></b>
==============

** WANT TO KEEP CACHE AND SESSIONS SEPERATE **

IF wanting Sessions with Redis, will need to enable Redis in the following file:
../app/etc/modules/Cm_RedisSession.xml

Here is an example of a Redis Session and Redis Cache local.xml
<a href="./other/local.xml.RedisSession.RedisCache.example.txt">local.xml.RedisSession.RedisCache.example.txt</a>

---

Here we will use Memcache for Sessions and Redis for Cache. (prefered configuration, great for scaling)

<a href="./other/local.xml.MemcacheSession.RedisCache.example.txt">local.xml.MemcacheSession.RedisCache.example.txt</a>

** Good Idea to keep seesions in one place. No worry for latency.
** Large builds should have caches locally. Think network latency.
*** No need for Varnish. 

---

Load Balancing?

Make things easy by assiginging an Admin URL and give it a DNS Record
i.e. http://admin.mydomain.com - "A" Master Server IP
http://mydomain.com - "A" LB IP.
System -> Configuration -> Advanced -> Admin -> Admin Base URL

** Exclude var/sessions & var/cache from Lsyncd
** NFS ../media/*

<b><i>Useful Redis Information</i></b>
==============

Redis flush caches:
redis-cli -h <ip> -p 6379 
redis> SELECT # (from redis-cli info # Keyspace)
redis> FLUSHDB

redis-cli monitor
redis-cli info


REDIS
/etc/redis.conf

disable -SNAPSHOTTING- (persistance)
maxmemory 1GB
maxmemory-policy allkeys-lru 

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


