<?php
$dbconn = pg_connect("host=162.216.18.16 port=5432 dbname=endfid user=postgres password=k1LL2018");
//connect to a database named "postgres" on the host "host" with a username and password

if (!$dbconn) {
    die ("Doesn't work =(");
}
