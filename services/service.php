<?php
  $action = $_REQUEST["action"];
  switch($action){
      case "1":
          getContent();
        break;                     
      default:
        break;
  }



 function getContent(){

require 'connection.php';
$query = 'select * from questions';

$result = mysql_query($query);
  
$start = 0;

while ($row = mysql_fetch_array($result)) {

    $questions[] = ($row);
        

}
   //sleep(1); 
   $step_number = $_REQUEST["step_number"]; 
   $html = '<h2 class="StepTitle">Step '.$ $questions[$i]['qid'].' Content</h2>';
   if($step_number == 1){
  
  $html .='
           <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, 
            sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, 
            quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>';
   }
   echo $html;
 }

?>