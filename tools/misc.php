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

==== MISC QUICK COMMANDS ====

<b>Function:</b> Linux Version
<b>Usage:</b> uname -a && cat /etc/*release

<b>Function:</b> Largest Directory/Files 
<b>Usage:</b> du -hsx * | sort -rh | head -10

<b>Function:</b> Quick Vhost
<b>Usage:</b> bash <(curl justcurl.com  -H "host: example.com " -H "x-docroot: /var/www/vhosts/example.com/public_html ")

<b>Function:</b> Octet Permissions
<b>Usage:</b> stat -c '%A %a %n' .* * 

<b>Function:</b> Add Swap & Persistance
<b>Usage:</b> dd if=/dev/zero of=/swapfile bs=1024 count=2015536 && mkswap /swapfile && swapon /swapfile
<b>Usage:</b> echo "/swapfile swap swap   defaults   0 0" >> /etc/fstab

<b>Function:</b> Make Sure You Are Actually Using Swap
<b>Usage</b> cat /proc/sys/vm/swappiness
sysctl vm.swappiness=30
add to /etc/sysctl.conf vm.swappiness=30

<b>Function:</b> Reset Folder and File Permissions (Great for Wordpress)
<b>Usage:</b> find . -type d -print0 | xargs -0 chmod 02775
       find . -type f -print0 | xargs -0 chmod 0664

<b>Function:</b> Drop Caches
<b>Usage:</b> sync && echo 3 > /proc/sys/vm/drop_caches

<b>Function:</b> Largest Open Files
<b>Usage:</b> sudo lsof -s | awk '$5 == "REG"' | sort -n -r -k 7,7 | head -n 50

<b>Function:</b> Log Rotate
<b>Usage:</b> logrotate -vf /etc/logrotate.conf

<b>Function:</b> Move All Contents Up Partent Directory
<b>Usage:</b> mv * .[^.]* ..

<b>Function:</b> pwgen
<b>Usage:</b> pwgen -B -c -n -y 15

<b>Function:</b> Scan for all TCP and UDP Open Ports
<b>Usage:</b> sudo nmap -n -PN -sT -sU -p- 0.0.0.0

<b>Function:</b> Find all .conf
<b>Usage:</b> find /etc -name "*.conf" | xargs ls –l

<b>Function:</b> Phrase to file
<b>Usage:</b> httpd -S > /home/rack/domains.txt 2>&1

<b>Function:</b> TAR Compress
<b>Usage:</b> tar cfzv backup-$(date +%Y-%m-%d).tar.gz /home

<b>Function:</b> TAR Uncompress
<b>Usage:</b> tar xvzf

<b>Function:</b> Sed and Replace
<b>Usage:</b> sed -i 's/before/after/g' /home/file.txt

<b>Function:</b> Quickly find Large Files and Directories
<b>Usage:</b> du -h /var --max-depth 1 2>&1 | grep -v "^du: cannot read" | sort -h && ls -alSr /var | grep -v ^d | grep -v ^l | tail

<b>Function:</b> Search for a String
<b>Usage:</b> grep -R "DENY" /etc/


============= UNSORTED ===============

wget -m -r -nH --cut-dirs=5 ftp://user:pass@server//absolute/path/to/directory

worker_rlimit_nofile 65535;

ssh-keygen -t rsa -b 4096 -C "$(whoami)@$(hostname)-$(date -I)"

php /path/to/wp-cli.phar search-replace 'http://example.com' 'https://example.com' --skip-columns=guid --dry-run

rpm -q --changelog openssh | grep CVE

cat /var/log/httpd/*access?log | awk '$10 ~ /50[0-9]/ {print $0}' | less

rsync -avz -e "ssh -p55555" root@192.x.x.x:/mnt/archive.tar.gz /mnt/backup

grep "1/Jan" *access?log | cut -d[ -f2 | cut -d] -f1 | awk -F: '{print $2,$3":00"}' | sort -n | uniq -c

find . -inum 1446302 -exec cat {} \;

strace -p <PID>

ps h --ppid $(cat /var/run/apache2.pid) | awk '{print"-p " $1}' | xargs sudo strace

---------
much bytes each IP consumed in the last week.
]# for i in $(cat access_log |awk '{print $1}' | sort -nr |uniq -c |sort -nr |head -20 | awk '{print $2}'); do echo $i used: && grep $i access_log | awk '{s+=$10} END {print s}'; done
---------
for i in $(ls access_log*gz); do echo $i && zcat $i | awk '{s+=$10} END {print s}'; done

---------

find $1 -type f -exec stat --format '%Y :%y %n' "{}" \; | sort -nr | cut -d: -f2- | less

dd if=arch.iso of=/dev/sdb && sync

curl -H "Host:hoshisato.com" localhost/test.txt

curl -Iv https://www.google.com --resolve www.google.com:443:74.125.21.102
openssl s_client -connect 74.125.21.102:443 -servername www.google.com

chrome://net-internals/#events

dig A plutokorea.com @ns1.hoshisato.com

nmap --script ssl-enum-ciphers -p 443 192.168.1.1

php -r  "mail('ceo@example.com', 'php test mail', 'test worked');"

-------
reset file ownership/permissions on a hosed file system (RPM)
for p in $(rpm -qa); do rpm --setperms $p; done
for p in $(rpm -qa); do rpm --setugids $p; done
-------
find . -inum 1186035 -exec rm -i {} \;
http://www.ipdeny.com/ipblocks/data/countries/

curl --verbose --header 'Host: www.hoshisato.com' 'http://192.168.1.1'

pgrep "php-fpm|php5-fpm|apache2|httpd" | awk '{print"-p "$1}' | xargs strace -tts 4096 -vvvf 2>&1 | tee /root/strace.log

ps awfuxx | grep mysql|awk '{sum+=$4} END {print sum}'

</pre>
</body>
</html>
