
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
<b>Name:</b> <a href="./code/watchconnections.sh">watchconnections.sh</a> Release v.0.0.1 (Oct. 20, 2014)
<b>Function:</b> Watch unique active connections to ports and number of connections individual IPs make.
<b>Usage:</b> bash <(curl -s http://hoshisato.com/tools/code/watchconnections.sh) # Snapshot
       while bash <(curl -s http://hoshisato.com/tools/code/watchconnections.sh); do sleep 10; done # Update Every 10 Seconds

<b>Name:</b> <a href="./code/auth.sh">auth.sh</a> Release v.0.0.1 (Oct. 20, 2014)
<b>Function:</b> Send email for every Authenticated SSH Login. Replace example@example.com with your email.
<b>Usage:</b> curl -s http://hoshisato.com/tools/code/auth.sh > /etc/profile.d/auth.sh && 
       sed -i 's/destination-email/example@example.com/g' /etc/profile.d/auth.sh

<b>Name:</b> <a href="./code/wut.sh">wUt</a>
<b>Function:</b> Throw this in a terminal and see what happens.
<b>Usage:</b> bash <(curl -s http://hoshisato.com/tools/code/wut.sh)

<b>Name:</b> <a href="">TBA</a>
<b>Function:</b> TBA
<b>Usage:</b>


<b><i>Other Tools</i></b>
===========
<b>Name:</b> <a href="code/speedtest_cli.py">speedtest_cli.py</a> Release v.0.2.5 Copyright 2013 Matt Martz
<b>Function:</b> Bandwidth Speed Test
<b>Usage:</b> python <(curl -s http://hoshisato.com/tools/code/speedtest_cli.py)
<!-- https://github.com/sivel/speedtest-cli/blob/master/speedtest_cli.py -->

<b><i><a href="quick.php">Awesome Quick Commands</a> </i></b>
<b><i><a href="magento_cheat_sheet.php">Magento Cheat Sheet</a> </i></b>
<b><i><a href="http://ipv6.hoshisato.com">IPv6 Only Test Site</a> </i></b>

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
