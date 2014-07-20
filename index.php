<?php 
session_start();
require 'connection.php';
$query = 'select * from questions';

$result = mysql_query($query);
  
$start = 0;

while ($row = mysql_fetch_array($result)) {

    $questions[] = ($row);
        

}


?>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml"><head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Questions</title>

<link href="styles/smart_wizard_vertical.css" rel="stylesheet" type="text/css">

</head><body>

<table align="center" border="0" cellpadding="0" cellspacing="0">
<tr><td> 
<!-- Tabs -->
  		<div id="wizard" class="swMain">
  			<ul>
             <?php  

            for ($i=0; $i < count($questions) ; $i++) { 
            ?>
  				<li><a href="#step-<?php  echo $i ?>">
               <!-- <span class="stepNumber"><?php echo ($i+1)?></span>-->
                <span class="stepDesc">
                   Question <?php echo ($i+1)?><br />
                   <small></small>
                </span>
            </a></li>
  				
  				   <?php 
        }
        ?>
  				
  			</ul>

            
            <?php  

            for ($i=0; $i < count($questions) ; $i++) { 
            ?>
  			<div id="step-<?php  echo $i ?>">	
            <h2 class="StepTitle">Question <?php echo ($i+1)?></h2>
           
            <h4><?php  echo $questions[$i]['question'] ?> </h4>
              <?php  

                $sql = 'select * from options where qid = "'.$questions[$i]['qid'].'"ORDER BY options.option asc';

                $execute = mysql_query($sql);
                while ($row = mysql_fetch_array($execute)) {

                $options[] = ($row);
        

                 }
              ?>

             <p>
                 
                 <form id="options" onsubmit="return saveprogress()" name="<?php  echo $questions[$i]['qid'] ?>">
                 
                 <?php 

                 for ($j=0; $j < count($options) ; $j++) { 
                
                 ?>
         <input type="radio" required="true"name= "option" id="<?php  echo $questions[$i]['qid'] ?>" value="<?php  echo $options[$j]['optionid'] ?>" /> <?php  echo $options[$j]['option'] ?><br />
                
                <?php
                 } 
                ?>
                 

                 </form>

             
            </p>
                      			
        </div>

         <?php 
            unset($options);
            $options = array();

        }
        ?>
  			                
  			  		</div>
        <div class="success"></div>
  		
<!-- End SmartWizard Content -->  		
  		
</td></tr>
</table>   	
	
</body>
<script type="text/javascript" src="js/jquery-1.4.2.min.js"></script>
<script type="text/javascript" src="js/jquery.smartWizard-2.0.js"></script>

<script type="text/javascript">
    $(document).ready(function(){
        // Smart Wizard     
        $('#wizard').smartWizard();
      
     
        });
      function reload(){

                      location.reload();    
                  }
     
</script>

</html>
