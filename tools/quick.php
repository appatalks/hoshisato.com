
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

<b><i>Quick Commands</i></b>
==============
<b>Function:</b> Apache Buddy
<b>Usage:</b> perl <( curl http://cloudfiles.fanatassist.com/apachebuddy.pl ) --port 80

<b>Function:</b> Apache2 Buddy
<b>Usage:</b> perl <( curl http://apache2buddy.pl ) --port 80


<b>Function:</b> Poor Man's Apache Buddy
<b>Usage:</b> ps -o rss -C httpd,apache2,php-fpm | tail -n +2 | awk '{total+=$1}END{print "count : " NR "\ntotal : " total/1024 " MB" "\navg   : " total/1024/NR " MB"  }'

<b>Function:</b> MySQL Tuner
<b>Usage:</b> perl <( curl -L https://raw.githubusercontent.com/major/MySQLTuner-perl/master/mysqltuner.pl)

<b>Function:</b> MySQL Tuner for Cloud DB
<b>Usage:</b>  perl <( curl -L https://raw.githubusercontent.com/major/MySQLTuner-perl/master/mysqltuner.pl) \
--host 000000000000000.rackspaceclouddb.com --user user --pass "PASSWORD" --forcemem 1024

<b>Function:</b> MySQL Primer
<b>Usage:</b> curl http://www.day32.com/MySQL/tuning-primer.sh | bash

<b>Function:</b> MySQL Show User Host Passwords
<b>Usage:</b> select user,host,password from mysql.user;

<b>Function:</b> MySQL Show User Host/DB Relationship
<b>Usage:</b> SELECT user,host,db from mysql.db;

<b>Function:</b> Show MySQL Processlist Updated Every Second
<b>Usage:</b> mysqladmin -u root -p -i 1 processlist

<b>Function:</b> Show MySQL Thread and Connection Count
<b>Usage:</b> mysqladmin extended-status | grep -wi 'threads_connected\|threads_running' | awk '{ print $2,$4}'

==============
<b>Function:</b> Quick Vhost
<b>Usage:</b> bash <(curl justcurl.com  -H "host: example.com " -H "x-docroot: /var/www/vhosts/example.com/public_html ")

<b>Function:</b> Octet Permissions
<b>Usage:</b> stat -c '%A %a %n' .* * 

<b>Function:</b> Reset Folder and File Permissions (Great for Wordpress)
<b>Usage:</b> find . -type d -print0 | xargs -0 chmod 02775
       find . -type f -print0 | xargs -0 chmod 0664

<b>Function:</b> Add Swap
<b>Usage:</b> dd if=/dev/zero of=/swapfile bs=1024 count=2015536 && mkswap /swapfile && swapon /swapfile

<b>Function:</b> Apache Status
<b>Usage:</b> /etc/init.d/httpd fullstatus

<b>Function:</b> Drop Caches
<b>Usage:</b> sync && echo 3 > /proc/sys/vm/drop_caches

<b>Function:</b> Largest Directory/Files 
<b>Usage:</b> du -hsx * | sort -rh | head -10

<b>Function:</b> Largest Open Files
<b>Usage:</b> sudo lsof -s | awk '$5 == "REG"' | sort -n -r -k 7,7 | head -n 50

<b>Function:</b> Linux Version
<b>Usage:</b> uname -a && cat /etc/*release

<b>Function:</b> Log Rotate
<b>Usage:</b> logrotate -vf /etc/logrotate.conf

<b>Function:</b> mv  up ...
<b>Usage:</b> mv * .[^.]* ..

<b>Function:</b> Outside IP
<b>Usage:</b> curl -s checkip.dyndns.org|sed -e 's/.*Current IP Address: //' -e 's/<.*$//' 

<b>Function:</b> pwgen
<b>Usage:</b> pwgen -B -c -n -y 15

<b>Function:</b> Server Status
<b>Usage:</b> curl -IL localhost/server-status?auto

<b>Function:</b> Varnish stat
<b>Usage:</b> varnishstat -1

'
<b><i>Hack Comprimised</i></b>
================
<b>Function:</b> Apache what is being called the most
<b>Usage:</b> awk '{print $7}' *access.log|cut -d? -f1|sort|uniq -c|sort -nk1|tail -n10

<b>Function:</b> Failed Password
<b>Usage:</b> grep "Failed password" /var/log/secure |cut -d ":" -f 4 |grep -v "invalid user" |awk '{print $6 }' |sort -n |uniq -c

<b>Function:</b> Hit Server X times
<b>Usage:</b> tail -n20000 example.com-access.log | cut -d- -f1 | sort | uniq -c | sort -nr | head 

<b>Function:</b> Hits per hour
<b>Usage:</b> grep "1/Nov" *access?log | cut -d[ -f2 | cut -d] -f1 | awk -F: '{print $2":00"}' | sort -n | uniq -c

<b>Function:</b> tcpdump 53
<b>Usage:</b> tcpdump -i any port 53

<b>Function:</b> Top Connected IPs
<b>Usage:</b> netstat -antu | grep :80 | grep -v LISTEN | awk '{print $5}' | sort | uniq -c | sort -rn

<b>Function:</b> Total Web Connections
<b>Usage:</b> netstat -ntu | grep :80 | grep -v LISTEN | awk '{print $5}' | cut -d: -f1 | grep -v 127.0.0.1 | wc -l

<b>Function:</b> Unique IP Connection Count
<b>Usage:</b> netstat -ntu | grep :80 | grep -v LISTEN | awk '{print $5}' | cut -d: -f1 | sort | uniq -c | sort -rn | grep -v 127.0.0.1 | wc -l

<b>Function:</b> Watch Connections
<b>Usage:</b> bash <(curl -s http://hoshisato.com/tools/code/watchconnections.sh)

<b>Function:</b> Watch which files are changing
<b>Usage:</b> watch -n 1 -d ls -l ./*?log

<b>Function:</b> Wordpress Failed Login IPs
<b>Usage:</b> cat access_log | grep wp-login.php | awk '{print $1}' | sort | uniq -c | sort -rn

<b>Function:</b> Skip Bad Transaction on Slave (Not recommended !)
<b>Usage:</b> MySQL> SET GLOBAL SQL_SLAVE_SKIP_COUNTER=1;

<b>Function:</b> Scan for all TCP and UDP Open Ports
<b>Usage:</b> sudo nmap -n -PN -sT -sU -p- 0.0.0.0

<b><i>Others</i></b>
======
<b>Function:</b> ETH UP
<b>Usage:</b> systemctl start dhcpcd@enp3s0.service

<b>Function:</b> Find all .conf
<b>Usage:</b> find /etc -name "*.conf" | xargs ls –l

<b>Function:</b> Open file via CML
<b>Usage:</b> xdg-open

<b>Function:</b> OpenVPN
<b>Usage:</b> openvpn --config /etc/openvpn/*.ovpn --redirect-gateway def1

<b>Function:</b> Page Loads
<b>Usage:</b> time wget -q -r level=1 http://

<b>Function:</b> Phrase to file
<b>Usage:</b> httpd -S > /home/rack/domains.txt 2>&1

<b>Function:</b> shuttle
<b>Usage:</b> sshuttle -r user@example.com -x 10.0.0.0/8 -x 192.168.0.0/16 0/0

<b>Function:</b> AB (Bench Mark tool)
<b>Usage:</b> ab -n 1000 -c 50 https://

<b>Function:</b> stress test
<b>Usage:</b> siege -c 50 http://

<b>Function:</b> TAR Compress
<b>Usage:</b> tar cfzv backup-$(date +%Y-%m-%d).tar.gz /home

<b>Function:</b> TAR Uncompress
<b>Usage:</b> tar xvzf

<b>Function:</b> Sed and Replace
<b>Usage:</b> sed -i 's/before/after/g' /home/file.txt

<b>Unsorted</b>

curl -Is http://hoshisato.com | head -n 1

du -h /var --max-depth 1 2>&1 | grep -v "^du: cannot read" | sort -h && ls -alSr /var | grep -v ^d | grep -v ^l | tail

# Mount SSHFS
sshfs -p xxxx xxxx@x.x.x.x:/ /mnt -o cache=yes -o kernel_cache -o compression=yes
# Unmount 
fusermount -u /mnt

# Strace
pgrep "php-fpm|php5-fpm|apache2|httpd" | awk '{print"-p "$1}' | xargs strace -tts 4096 -vvvf 2>&1 | tee /root/strace.log

# Parse BIND9/Named Query logs (Most requested Query)
cat queries.log | cut -d" " -f4,6 | sed 's/#/ /g' | awk '{print $1,$3}' | sort | uniq -c | sort -nr


<b><i>Prefabs</i></b>
=======
!addip
!call
!csr
!csrr
!cyberduck
!hacked
!mon
!pend
!scale
!sig

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
