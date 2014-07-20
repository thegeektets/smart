<?php
$data = json_decode($_POST['data'],true );




$resp = $data;


require 'connection.php';



$add = "INSERT INTO `wizard`.`users` (`userid`) VALUES (NULL);";
mysql_query($add);

$getuser = "select userid from users  order by userid desc limit 0,1";

$users = mysql_query($getuser);

$user = mysql_fetch_row($users);



$_SESSION['user']= $user[0];

for ($i=0; $i < count($resp) ; $i++) { 


       $feedback = "insert into responds (userid,qid,answer)
        values (".mysql_escape_string($_SESSION['user']) .",".mysql_escape_string($resp[$i]['question']).",".mysql_escape_string($resp[$i]['answer']).")";
       mysql_query($feedback);
     
	
}


echo "1"; 







?>