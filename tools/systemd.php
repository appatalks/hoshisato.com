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

==== SYSTEMD / TOOLS  ====

<b>Function:</b> ETH UP
<b>Usage:</b> systemctl start dhcpcd@enp3s0.service

<b>Function:</b> Open file via CML
<b>Usage:</b> xdg-open

<b>Function:</b> OpenVPN
<b>Usage:</b> openvpn --config /etc/openvpn/*.ovpn --redirect-gateway def1

<b>Function:</b> shuttle
<b>Usage:</b> sshuttle -r user@example.com -x 10.0.0.0/8 -x 192.168.0.0/16 0/0

<b>Function:</b> AB (Bench Mark tool)
<b>Usage:</b> ab -n 1000 -c 50 https://<domain>/index.php

<b>Function:</b> stress test
<b>Usage:</b> siege -c 50 http://

<b>Function:</b> Varnish stat
<b>Usage:</b> varnishstat -1

<b>Function:</b> Mount SSHFS
<b>Usage:</b> sshfs -p xxxx xxxx@x.x.x.x:/ /mnt -o cache=yes -o kernel_cache -o compression=yes
<b>Usage Unmount:</b> fusermount -u /mnt

<b>Function:</b> Strace Debugging
<b>Usage:</b> pgrep "php-fpm|php5-fpm|apache2|httpd" | awk '{print"-p "$1}' | xargs strace -tts 4096 -vvvf 2>&1 | tee /root/strace.log


</pre>
</body>
</html>
