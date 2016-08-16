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

==== MySQL RELATED ====

<b>Function:</b> MySQL Tuner
<b>Usage:</b> perl <( curl -Lk https://hoshisato.com/tools/code/mysqltuner.pl)

<b>Function:</b> MySQL Tuner for Cloud DB
<b>Usage:</b>  perl <( curl -Lk https://hoshisato.com/tools/code/mysqltuner.pl) \
--host 000000000000000.rackspaceclouddb.com --user user --pass "PASSWORD" --forcemem 1024

<b>Function:</b> MySQL Primer
<b>Usage:</b> curl -k https://hoshisato.com/tools/code/tuning-primer.sh | bash

<b>Function:</b> MySQL Show User Host Passwords
<b>Usage:</b> select user,host,password from mysql.user;

<b>Function:</b> MySQL Show User Host/DB Relationship
<b>Usage:</b> SELECT user,host,db from mysql.db;

<b>Function:</b> Show MySQL Processlist Updated Every Second
<b>Usage:</b> mysqladmin -u root -p -i 1 processlist

<b>Function:</b> Show MySQL Thread and Connection Count
<b>Usage:</b> mysqladmin extended-status | grep -wi 'threads_connected\|threads_running' | awk '{ print $2,$4}'

<b>Function:</b> Skip Bad Transaction on Slave (Not recommended !)
<b>Usage:</b> MySQL> SET GLOBAL SQL_SLAVE_SKIP_COUNTER=1;

<b>Function:</b> MySQL .my.cnf 
<b>Usage:</b> Place into /root/.my.cnf 
[client]
user=root
password="password"

<b>Function:</b> Convert all MyISAM to innodb (Do not do to tables using FULLTEXT)
<b>Usage:</b> 
# for table in $(mysql -N -e "SELECT CONCAT('\`',table_schema,'\`.\`',table_name,'\`') 
FROM information_schema.tables WHERE table_schema NOT IN ('mysql','information_schema','performance_schema') 
AND engine = 'MyISAM' AND table_name NOT IN (SELECT TABLE_name FROM information_schema.statistics 
WHERE index_type LIKE 'FULLTEXT%');"); do echo ${table}; mysql -e "ALTER TABLE ${table} ENGINE = InnoDB"; done

<b>Function:</b> Update Password 
<b>Usage:</b> UPDATE mysql.user SET Password=PASSWORD('MyNewPass') WHERE User='root';

<b>Function:</b> MyISAM or INNODB
<b>Usage:</b> SHOW TABLE STATUS FROM `database`;

<b>Function:</b> Grant All Privileges / Create New User
<b>Usage:</b> GRANT ALL PRIVILEGES ON databasename.* TO "wordpressusername"@"hostname" IDENTIFIED BY "password";

<b>Function:</b> Rename/Update MySQL User
<b>Usage:</b> RENAME USER 'magentouser'@'192.168.1.1' to 'magentouser'@'%';

<b>Function:</b> Purge Binary Logs
<b>Usage:</b> 
SHOW MASTER LOGS 
PURGE BINARY LOGS TO 'mysql-bin.010'; 
PURGE BINARY LOGS BEFORE '2008-04-02 22:46:26';

<b>Function:</b> Check Size of All Databases
<b>Usage:</b> 
SELECT table_schema 'database',
concat( round( sum( data_length + index_length ) / ( 1024 *1024 ) , 2 ) , 'M' ) size
FROM information_schema.TABLES
WHERE ENGINE=('MyISAM' || 'InnoDB' )
GROUP BY table_schema;

<b>Function:</b> Optimize Tables
<b>Usage:</b> 
mysqlcheck -o db_schema_name
mysqlcheck -o --all-databases

<b>Function:</b> Watch MySQL Processlist
<b>Usage:</b> mysqladmin -u root -p -i 1 processlist

---------------

Unsorted
---

-------
mysql> SELECT TABLE_SCHEMA, TABLE_NAME FROM information_schema.statistics WHERE index_type LIKE 'FULLTEXT%';
---------
select table_name,table_schema,data_length/1024/1024 AS size_in_MB,engine from information_schema.tables where table_schema not in ('mysql','information_schema') and engine='MyISAM' order by data_length ASC;

mysql> SELECT COUNT(1) ReplicationThreadCount FROM information_schema.processlist
    -> WHERE user = 'replicant';
+------------------------+
| ReplicationThreadCount |
+------------------------+
|                      0 |
+------------------------+


</pre>
</body>
</html>
