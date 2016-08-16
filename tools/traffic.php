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

==== TRAFFIC ANALYSIS  ====

<b>Function:</b> Apache Status
<b>Usage:</b> /etc/init.d/httpd fullstatus

<b>Function:</b> Server Status
<b>Usage:</b> curl -IL localhost/server-status?auto

<b>Function:</b> Outside IP
<b>Usage:</b> curl -s checkip.dyndns.org|sed -e 's/.*Current IP Address: //' -e 's/<.*$//'

<b>Function:</b> Watch which files are changing'
<b>Usage:</b> watch -n 1 -d ls -l ./*?log

<b>Function:</b> Watch Connections
<b>Usage:</b> bash <(curl -s https://hoshisato.com/tools/code/watchconnections.sh)

<b>Function:</b> Apache Most Called Element
<b>Usage:</b> awk '{print $7}' *access?log | cut -d? -f1|sort|uniq -c|sort -nk1|tail -n10

<b>Function:</b> Top Connected IPs
<b>Usage:</b> netstat -antu | grep :80 | grep -v LISTEN | awk '{print $5}' | sort | uniq -c | sort -rn

<b>Function:</b> Total Web Connections
<b>Usage:</b> netstat -ntu | grep :80 | grep -v LISTEN | awk '{print $5}' | cut -d: -f1 | grep -v 127.0.0.1 | wc -l

<b>Function:</b> Unique IP Connection Count
<b>Usage:</b> netstat -ntu | grep :80 | grep -v LISTEN | awk '{print $5}' | cut -d: -f1 | sort | uniq -c | sort -rn | grep -v 127.0.0.1 | wc -l

<b>Function:</b> Hits per hour
<b>Usage:</b> grep "1/Nov" *access?log | cut -d[ -f2 | cut -d] -f1 | awk -F: '{print $2":00"}' | sort -n | uniq -c

<b>Function:</b> Hits per minute
<b>Usage:</b> grep "23/Jan/2013:06" *access?log | cut -d[ -f2 | cut -d] -f1 | awk -F: '{print $2":"$3}' | sort -nk1 -nk2 | uniq -c | awk '{ if ($1 > 10) print $0}'

<b>Function:</b> Hit Server X times
<b>Usage:</b> cat *access?log | cut -d- -f1 | sort | uniq -c | sort -nr | head 

<b>Function:</b> tcpdump 53
<b>Usage:</b> tcpdump -i any port 53

<b>Function:</b> Wordpress Failed Login IPs
<b>Usage:</b> cat *access?log | grep wp-login.php | awk '{print $1}' | sort | uniq -c | sort -rn

<b>Function:</b> Scan for all TCP and UDP Open Ports
<b>Usage:</b> sudo nmap -n -PN -sT -sU -p- 0.0.0.0

....
Unsorted

cd /tmp; wget https://hoshisato.com/tools/code/parse-tcpdump-udp-port-53.php; tcpdump -vvv -s 0 -l -n port 53 | php -f parse-tcpdump-udp-port-53.php

varnishncsa -a -w /var/log/varnish/access.log -D -P /var/run/varnishncsa.pid

</pre>
</body>
</html>
