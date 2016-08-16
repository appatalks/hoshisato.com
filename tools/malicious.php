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

==== HACKED / COMPROMISED  ====

<b>Function:</b>  Provide listing of files based on time.
<b>Usage:</b>  ls -lart "/path/of/directory/"

<b>Function:</b>  Process Tree List
<b>Usage:</b>  ps -wauxef

<b>Function:</b>  Identify Spam Mail Script
<b>Usage:</b>  postcat -q "id" | grep X-PHP

<b>Function:</b> Count Awaiting Spam for Delivery
<b>Usage:</b> find /var/spool/postfix/deferred -type f | wc -l

<b>Function:</b> Failed Password
<b>Usage:</b> grep "Failed password" /var/log/secure |cut -d ":" -f 4 |grep -v "invalid user" |awk '{print $6 }' |sort -n |uniq -c

<b>Function:</b> Wordpress Failed Login IPs
<b>Usage:</b> cat access_log | grep wp-login.php | awk '{print $1}' | sort | uniq -c | sort -rn

<b>Function:</b> Hit Server X times
<b>Usage:</b> tail -n20000 example.com-access.log | cut -d- -f1 | sort | uniq -c | sort -nr | head 

<b>Function:</b> tcpdump 53
<b>Usage:</b> tcpdump -i any port 53

<b>Function:</b> ClamAV Virus Scan
<b>Usage:</b> freshclam; clamscan -r -i / >> /home/rack/clamscan.out



</pre>
</body>
</html>

