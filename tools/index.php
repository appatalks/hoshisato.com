<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
<head>
  
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8"> 
  <title>Hoshi Sato - Tools</title>
  <meta name="description" content="Scripts for Linux Administration">
  <meta name="keywords" content="Hoshi, Sato, Bash, Script, Linux">
  <meta name="msvalidate.01" content="43F521FF5D6075596721E017ACC164F7">
<!--- To activate Konami: UP UP DOWN DOWN LEFT RIGHT LEFT RIGHT B A -->
  <script type="text/javascript" src="konami.js"></script>
  <script type="text/javascript">
        var konami = new Konami('http://lindapark.net/');       
  </script>  
<!-------------------------------------------------------------------->
  
  <style type="text/css">
.title
      {
      width:769px; 
      height: 45px;
     margin:15px auto;
      }
.left_side 
      {
     float: left;
     margin: 40px 0 40px 0;
     padding: 0 0 25px 15px;
     width: 120px;
     border: 0px solid #CCCCCC;
     background-color: #FFFFFF;
     color: #000000; 
      }
.right_side 
     {
     float:center;
     width: 1200px;
     color: #000000;
     background-color: #FFFFFF;
     margin: 20px 0px 20px 0px;
     padding: 0px 0px 25px 240px;
     border:0px solid #CCCCCC;
     }	  	  
  </style>
<!-- -->  
  <script langauge="javascript">
            var counter = 0;
            window.setInterval("refreshDiv()", 1000);
            function refreshDiv(){
		var today = new Date();
//		var utc = new d.getUTCDate();
                document.getElementById("local_time").innerHTML = "Local Time: " + today;
//		document.getElementById("utc_time").innerHTML = "UTC Time: " + utc;
            }
  </script>
<!-- -->
</head><body>
<div id="local_time" class="title">Local Time:
<!-- <div id="utc_time" class="title">UTC Time: -->
</div>
</div>

<div class="left_side"><br>
<br>
<table style="text-align: left; width: 180px; height: 460px;" border="1" cellpadding="2" cellspacing="2">
  <tbody>
    <tr align="center">
      <td style="vertical-align: middle;">
	<a href="apache.php" target="targetframe">Apache Related</a><br>
      </td>
    </tr>
    <tr align="center">
      <td style="vertical-align: middle;">
	<a href="mysql.php" target="targetframe">MySQL Related</a><br>
      </td>
    </tr>
    <tr align="center">
      <td style="vertical-align: middle;">
	<a href="traffic.php" target="targetframe">Traffic Analysis</a><br>
      </td>
    </tr>
    <tr align="center">
      <td style="vertical-align: middle;">
	<a href="malicious.php" target="targetframe">Hacked / Compromised </a><br>
      </td>
    </tr>
    <tr align="center">
      <td style="vertical-align: middle;">
	<a href="systemd.php" target="targetframe">Systemd / Tools</a><br>
      </td>
    </tr>
    <tr align="center">
      <td style="vertical-align: middle;">
	<a href="code/" target="targetframe">Random Code</a><br>
      </td>
    </tr>
    <tr align="center">
      <td style="vertical-align: middle;">
	<a href="misc.php" target="targetframe">Misc Quick Commands</a><br>
      </td>
    </tr>
  </tbody>
</table>
<!-- Donation Start-->
<br>
<!-- <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top"> 
<input type="hidden" name="encrypted" value="-----BEGIN PKCS7-----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-----END PKCS7-----">
-->
<a href="http://servingbaby.com">ServingBaby.com</a>
<br>
<a href="http://hoshisato.com">HoshiSato.com</a>
<a href="http://stbennett.org/contact/index.html"> Contact Me</a>
<br>
Hits: <?php include ("counter.php");
?>
<br>
<p>
<iframe style="width:120px;height:200px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="//ws-na.amazon-adsystem.com/widgets/q?ServiceVersion=20070822&OneJS=1&Operation=GetAdHtml&MarketPlace=US&source=ac&ref=tf_til&ad_type=product_link&tracking_id=hoshisato-20&marketplace=amazon&region=US&placement=B00DZYEXPQ&asins=B00DZYEXPQ&linkId=GWNVHXWRT4SD3RYY&show_border=false&link_opens_in_new_window=true">
</iframe>
<!-- Donation End --><br>
</div>

<div class="right_side">
<p align="left"><b>Hoshi Sato's Quick Commands</b> <a style="font-size:10px; color: black; font-family: Verdana, Arial;" href="index_legacy.php">Legacy Tools</a></p>
<iframe name="targetframe" id="targetFrame" allowtransparency="true" src="" align="top" frameborder="1" height="800" scrolling="yes" width="100%"> 

<script async src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
<!-- Hoshi Sato -->
<ins class="adsbygoogle"
     style="display:block"
     data-ad-client="ca-pub-9621758336549080"
     data-ad-slot="2611061254"
     data-ad-format="auto"></ins>
<script>
(adsbygoogle = window.adsbygoogle || []).push({});
</script>

</iframe>
<br>
<br>
</div>

<br>

<br>

</body>
</html>
