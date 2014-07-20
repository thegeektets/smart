/* SmartWizard 2.0 plugin
 * jQuery Wizard control Plugin
 * http://www.techlaboratory.net/smartwizard
 * 
 * by Dipu Raj  
 * http://dipuraj.me
 * 
 * License 
 * https://github.com/techlab/SmartWizard/blob/master/MIT-LICENSE.txt 
 * 
 */
 
(function($){
    $.fn.smartWizard = function(action) {
        var options = $.extend({}, $.fn.smartWizard.defaults, action);
        var args = arguments;
        var answers = [];


        return this.each(function(){
                var obj = $(this);
                var curStepIdx = options.selected;
                var steps = $("ul > li > a[href^='#step-']", obj); // Get all anchors in this array
                var contentWidth = 0;
                var loader,msgBox,elmActionBar,elmStepContainer,btNext,btPrevious,btFinish;
                
                elmActionBar = $('.actionBar',obj);
                if(elmActionBar.length == 0){
                  elmActionBar = $('<div></div>').addClass("actionBar");                
                }

                msgBox = $('.msgBox',obj);
                if(msgBox.length == 0){
                  msgBox = $('<div class="msgBox"><div class="content"></div><a href="#" class="close">X</a></div>');
                  elmActionBar.append(msgBox);                
                }
                
                $('.close',msgBox).click(function() {
                    msgBox.fadeOut("normal");
                    return false;
                });
                

                // Method calling logic
                if (!action || action === 'init' || typeof action === 'object') {
                  init();
                }else if (action === 'showMessage') {
                  //showMessage(Array.prototype.slice.call( args, 1 ));
                  var ar =  Array.prototype.slice.call( args, 1 );
                  showMessage(ar[0]);

                  jquerysave();

                  return true;
                }else if (action === 'setError') {
                  var ar =  Array.prototype.slice.call( args, 1 );
                  setError(ar[0].stepnum,ar[0].iserror);
                  return true;
                } else {
                  $.error( 'Method ' +  action + ' does not exist' );
                }
                
                function init(){
                  var allDivs =obj.children('div'); //$("div", obj);                
                  obj.children('ul').addClass("anchor");
                  allDivs.addClass("content");
                  // Create Elements
                  loader = $('<div>Loading</div>').addClass("loader");
                  elmActionBar = $('<div></div>').addClass("actionBar");
                  elmStepContainer = $('<div></div>').addClass("stepContainer");
                  btNext = $('<a>'+options.labelNext+'</a>').attr("href","#").addClass("buttonNext");
                  btPrevious = $('<a>'+options.labelPrevious+'</a>').attr("href","#").addClass("buttonPrevious");
                  btFinish = $('<a>'+options.labelFinish+'</a>').attr("href","#").addClass("buttonFinish");
                  
                  // highlight steps with errors
                  if(options.errorSteps && options.errorSteps.length>0){
                    $.each(options.errorSteps, function(i, n){
                      setError(n,true);
                    });
                  }


                  elmStepContainer.append(allDivs);
                  elmActionBar.append(loader);
                  obj.append(elmStepContainer);
                  obj.append(elmActionBar); 
                  if (options.includeFinishButton) {
                    elmActionBar.append(btFinish);
                  }
                  elmActionBar.append(btNext).append(btPrevious); 
                  contentWidth = elmStepContainer.width();

                  $(btNext).click(function() {
                      if($(this).hasClass('buttonDisabled')){
                        return false;
                      }
                      doForwardProgress();
                     
                      return false;
                  });
                  
                  
                  $(btPrevious).click(function() {
                      if($(this).hasClass('buttonDisabled')){
                        return false;
                      }
                      doBackwardProgress();
                      return false;
                  }); 
                  $(btFinish).click(function() {
                      if(!$(this).hasClass('buttonDisabled')){
                         if($.isFunction(options.onFinish)) {
                            if(!options.onFinish.call(this,$(steps))){
                              return false;
                            }
                         }
                         else{
                           
                            var names = [];
                           var data = [];
                            
                            
                            $("form").each(function() {
                            names.push(this.name);
                           
                            });

                            $("input:checked").each(function(){
                             
                              data.push({question:this.id,answer:this.value});
                              
                              answers.push(this.value);


                            });
                            
                             $.ajax({

                              type :"post",
                             url:'progress.php',
                             data:{
                                data :JSON.stringify(data)
                                 },
                             dataType: "json",
                             async: false,
                             success : 
                             function(data){
                             if(data == 1) {
                               


                               $(btFinish).addClass("buttonDisabled");
                               $(btNext).addClass("buttonDisabled");
                               $(btPrevious).addClass("buttonDisabled");
                               LoadResults();

                              }
                              else{

                                  console.log(data);
                            
                              }
                     

                     
                              },
                     
                               error :
                    
                               function(data){

                                   console.log(data);
                   
                               }






                             });
                                return false;
                            }}
                             
                                                 
                       
                      
                  }); 
                  
                  $(steps).bind("click", function(e){
                      if(steps.index(this) == curStepIdx){
                        return false;                    
                      }
                      var nextStepIdx = steps.index(this);
                      var isDone = steps.eq(nextStepIdx).attr("isDone") - 0;
                      if(isDone == 1){
                        LoadContent(nextStepIdx);                    
                      }
                      return false;
                  }); 
                  
                  // Enable keyboard navigation                 
                  if(options.keyNavigation){
                      $(document).keyup(function(e){
                          if(e.which==39){ // Right Arrow
                            doForwardProgress();
                          }else if(e.which==37){ // Left Arrow
                            doBackwardProgress();
                          }
                      });
                  }
                  //  Prepare the steps
                  prepareSteps();
                  // Show the first slected step
                  LoadContent(curStepIdx);                  
                           
               

                function prepareSteps(){
                  if(!options.enableAllSteps){
                    $(steps, obj).removeClass("selected").removeClass("done").addClass("disabled"); 
                    $(steps, obj).attr("isDone",0);                 
                  }else{
                    $(steps, obj).removeClass("selected").removeClass("disabled").addClass("done"); 
                    $(steps, obj).attr("isDone",1); 
                  }

            	    $(steps, obj).each(function(i){
                        $($(this).attr("href"), obj).hide();
                        $(this).attr("rel",i+1);
                  });
                }
                
                function LoadContent(stepIdx){
                    var selStep = steps.eq(stepIdx);
                    var ajaxurl = options.contentURL;
                    var hasContent =  selStep.data('hasContent');
                    stepNum = stepIdx+1;
                    if(ajaxurl && ajaxurl.length>0){
                       if(options.contentCache && hasContent){
                           showStep(stepIdx);                          
                       }else{
                           $.ajax({
                            url: ajaxurl,
                            type: "POST",
                            data: ({step_number : stepNum}),
                            dataType: "text",
                            beforeSend: function(){ loader.show(); },
                            error: function(){loader.hide();},
                            success: function(res){ 
                              loader.hide();       
                              if(res && res.length>0){  
                                 selStep.data('hasContent',true);            
                                 $($(selStep, obj).attr("href"), obj).html(res);
                                 showStep(stepIdx);
                              }
                            }
                          }); 
                      }
                    }else{
                      showStep(stepIdx);
                    }
                }
                

                function LoadResults(){
                  
                  //hide final window

                  $("#step-8").hide(); 
                  
                  var correct = [7,10,13,19,22,27,31,37,40];
                   
                  var truth = [];


                  for (var i = 0; i < correct.length; i++) {
                      
                      if(correct[i] == answers[i]){

                        truth[i] =1 ;

                      }
                      else{

                        truth[i] =0 ;
                      }



                   }; 
                   
                  var scenario =[] ;
                   scenario[0]= truth[0]+truth[1]+truth[2] ;
                   scenario[1]= truth[3]+truth[4]+truth[5] ;
                   scenario[2]= truth[6]+truth[7]+truth[8] ;
                   
                  var result = ''+scenario[0]+''+scenario[1]+''+scenario[2];
                  
                   var message = "<strong>You got "+scenario[0]+" GENDER , "+scenario[1]+" CLIMATE and  "+scenario[2]+" PARTICIPATORY QUALITATIVE RESEARCH questions correct </strong><br><hr/>";

                  if((result == '321') || (result == '320')) {


                    message = message +(" You’re almost ready! <br><br> GENDER: You’re a gender expert! You understand what gender is, key terms regarding gender, and gendered roles to look for when researching. Do a quick review of the “Basic Concepts: Gender” section of the Introduction that has key concepts and ideas. After your review, complete the Learning Exercise on gender for a little fun and practice! <br><br> CLIMATE CHANGE: You’re competent with your climate change knowledge! You are somewhat familiar with the definition of climate change and related concepts. To ensure that you are completely ready for your research, review the “Basic Concepts: Climate Change” section in the Introduction to review terms and discussions about climate change. Once finished, complete the Learning Exercise on climate change to connect these concepts to gender.<br><br>PARTICIPATORY QUALITATIVE RESEARCH: You’re a participatory qualitative research novice! We have created a section in the Introduction called “Basic Concepts: Participation” just for you! Read through the content carefully to become familiar with the critical components of this research process. Then, take time to complete the Learning Activities that follow to practice more with identifying bias, understanding your role as a researcher and empathizing with your research participants or program beneficiaries. ");


                  }
                  else  if((result == '221') || (result == '220')){

       message = message +(" You’re almost ready! <br><br> GENDER: You’re competent with your knowledge on gender! You are somewhat familiar with the definition of gender and related concepts. To ensure that you are completely ready for your research, review the “Basic Concepts: Gender” section in the Introduction to review terms and discussions about gender and gender-sensitive research. Once finished, complete the Learning Exercise on gender to practice with the concepts.<br><br>CLIMATE CHANGE: You’re a climate change novice! We have created a section in the Introduction called “Basic Concepts: Climate Change” just for you! Read through the content carefully to become familiar with the critical terms and processes related to climate change. Then, take time to complete the Learning Activities that follow to practice more with defining climate change concepts and connecting them to gendered aspects. <br><br>PARTICIPATORY QUALITATIVE RESEARCH: You’re competent with your knowledge on gender! You are somewhat familiar with the concepts of participatory qualitative research. To ensure that you are completely ready for your research, review the “Basic Concepts: Participation” section in the Introduction to fully understand types of participation, components of the process and best practices for conducting your research. Once finished, complete the Learning Exercise on the role of the researcher and empathizing with your research participants and program beneficiaries. ");
  
                  }
                   else  if((result == '133') || (result == '033')) {

message = message +(" You’re almost ready! <br><br> GENDER: You’re a climate change novice! We have created a section in the Introduction called “Basic Concepts: Gender just for you! Read through the content carefully to become familiar with the definitions of gender and related concepts, as well as gendered aspects of climate change research. Then, take time to complete the Learning Activities that follow to explore the gender concepts and uncover your biases about gender. <br><br>CLIMATE CHANGE: You’re a climate change expert! You understand the processes related to climate change and are ready to use them. Do a quick review of the “Basic Concepts: Climate Change” section of the Introduction that has key definitions and key gendered aspects of climate change research. After your review, complete the Learning Exercise on climate change to practice connecting climate change to gender and for some fun!<br><br>PARTICIPATORY QUALITATIVE RESEARCH: You’re a participatory qualitative research expert! You understand some of the key aspects of the research process. Do a quick review of the “Basic Concepts: Participation” section of the Introduction to additionally review the types of participation and the best practices for qualitative research. After your review, complete the Learning Exercises on the Role of the Researcher and the Identity Wheel for a little fun, reflection and practice! ");
                  }
                  else  if(result == '333'){
message = message +(" Perfect! Just one more thing… <br><br> uickly review the terms and concepts in the Basic Concepts sections to ensure that you are familiar with all of the gender, climate change and participatory qualitative research terms and then practice with the Learning Exercises. After your review, you are ready to start your research project! ");


                  }
                    else  if(result == '222'){
message = message +(" You’re almost ready! <br><br>GENDER: You’re competent with your knowledge on gender! You are somewhat familiar with the definition of gender and related concepts. To ensure that you are completely ready for your research, review the “Basic Concepts: Gender” section in the Introduction to review terms and discussions about gender and gender-sensitive research. Once finished, complete the Learning Exercise on gender to practice with the concepts.<br><br>CLIMATE CHANGE: You’re competent with your climate change knowledge! You are somewhat familiar with the definition of climate change and related concepts. To ensure that you are completely ready for your research, review the “Basic Concepts: Climate Change” section in the Introduction to review terms and discussions about climate change. Once finished, complete the Learning Exercise on climate change to connect these concepts to gender. <br><br>PARTICIPATORY QUALITATIVE RESEARCH: You’re competent with your knowledge on gender! You are somewhat familiar with the concepts of participatory qualitative research. To ensure that you are completely ready for your research, review the “Basic Concepts: Participation” section in the Introduction to fully understand types of participation, components of the process and best practices for conducting your research. Once finished, complete the Learning Exercise on the role of the researcher and empathizing with your research participants and program beneficiaries. ");

                  }

                  else  if((result == '111') || (result == '000')) {

message = message +(" After reviewing and practicing, you will be ready to start research! <br><br>Review and practice with the terms, concepts and best practices in the Basic Concepts sections of the Introduction. You will need this understanding of gender, climate change and participatory qualitative research in order to create an effective research plan and collect the data that you need for your project or program. Once you have thoroughly reviewed these sections, complete all of the Learning Activities at the end of the Introduction to practice these concepts and prepare for your research. With a little bit of time and focus, you will be ready to begin your research!");
                  }
                   else  if((result == '331') || (result == '330')) {

message = message +(" You’re almost ready! <br><br>GENDER: You’re a gender expert! You understand what gender is, key terms regarding gender, and gendered roles to look for when researching. Do a quick review of the “Basic Concepts: Gender” section of the Introduction that has key concepts and ideas. After your review, complete the Learning Exercise on gender for a little fun and practice!<br><br>CLIMATE CHANGE: You’re a climate change novice! We have created a section in the Introduction called “Basic Concepts: Climate Change” just for you! Read through the content carefully to become familiar with the critical terms and processes related to climate change. Then, take time to complete the Learning Activities that follow to practice more with defining climate change concepts and connecting them to gendered aspects.<br><br>PARTICIPATORY QUALITATIVE RESEARCH: You’re a participatory qualitative research novice! We have created a section in the Introduction called “Basic Concepts: Participation” just for you! Read through the content carefully to become familiar with the critical components of this research process. Then, take time to complete the Learning Activities that follow to practice more with identifying bias, understanding your role as a researcher and empathizing with your research participants or program beneficiaries.");
                  }
                   else  if((result == '311') || (result == '310') || (result == '301') || (result == '300')) {

message = message +(" You’re almost ready! <br><br>GENDER: You’re a gender expert! You understand what gender is, key terms regarding gender, and gendered roles to look for when researching. Do a quick review of the “Basic Concepts: Gender” section of the Introduction that has key concepts and ideas. After your review, complete the Learning Exercise on gender for a little fun and practice!<br><br>CLIMATE CHANGE: You’re a climate change novice! We have created a section in the Introduction called “Basic Concepts: Climate Change” just for you! Read through the content carefully to become familiar with the critical terms and processes related to climate change. Then, take time to complete the Learning Activities that follow to practice more with defining climate change concepts and connecting them to gendered aspects.<br><br>PARTICIPATORY QUALITATIVE RESEARCH: You’re a participatory qualitative research novice! We have created a section in the Introduction called “Basic Concepts: Participation” just for you! Read through the content carefully to become familiar with the critical components of this research process. Then, take time to complete the Learning Activities that follow to practice more with identifying bias, understanding your role as a researcher and empathizing with your research participants or program beneficiaries.");
                  }
                   else  if(result == '322'){
message = message +(" You’re almost ready!<br><br>GENDER: You’re a gender expert! You understand what gender is, key terms regarding gender, and gendered roles to look for when researching. Do a quick review of the “Basic Concepts: Gender” section of the Introduction that has key concepts and ideas. After your review, complete the Learning Exercise on gender for a little fun and practice!<br><br>CLIMATE CHANGE: You’re competent with your climate change knowledge! You are somewhat familiar with the definition of climate change and related concepts. To ensure that you are completely ready for your research, review the “Basic Concepts: Climate Change” section in the Introduction to review terms and discussions about climate change. Once finished, complete the Learning Exercise on climate change to connect these concepts to gender.<br><br>PARTICIPATORY QUALITATIVE RESEARCH: You’re competent with your knowledge on gender! You are somewhat familiar with the concepts of participatory qualitative research. To ensure that you are completely ready for your research, review the “Basic Concepts: Participation” section in the Introduction to fully understand types of participation, components of the process and best practices for conducting your research. Once finished, complete the Learning Exercise on the role of the researcher and empathizing with your research participants and program beneficiaries. ");

                  }
                   else  if(result == '323'){
 message = message +(" You’re almost ready!<br><br>GENDER: You’re a gender expert! You understand what gender is, key terms regarding gender, and gendered roles to look for when researching. Do a quick review of the “Basic Concepts: Gender” section of the Introduction that has key concepts and ideas. After your review, complete the Learning Exercise on gender for a little fun and practice!<br><br>CLIMATE CHANGE: You’re competent with your climate change knowledge! You are somewhat familiar with the definition of climate change and related concepts. To ensure that you are completely ready for your research, review the “Basic Concepts: Climate Change” section in the Introduction to review terms and discussions about climate change. Once finished, complete the Learning Exercise on climate change to connect these concepts to gender.<br><br>PARTICIPATORY QUALITATIVE RESEARCH: You’re a participatory qualitative research expert! You understand some of the key aspects of the research process. Do a quick review of the “Basic Concepts: Participation” section of the Introduction to additionally review the types of participation and the best practices for qualitative research. After your review, complete the Learning Exercises on the Role of the Researcher and the Identity Wheel for a little fun, reflection and practice!");

                  }
                   else  if((result == '231') || (result == '230')) {

 message = message +(" You’re almost ready!<br><br>GENDER: You’re competent with your knowledge on gender! You are somewhat familiar with the definition of gender and related concepts. To ensure that you are completely ready for your research, review the “Basic Concepts: Gender” section in the Introduction to review terms and discussions about gender and gender-sensitive research. Once finished, complete the Learning Exercise on gender to practice with the concepts.<br><br>CLIMATE CHANGE: You’re a climate change expert! You understand the processes related to climate change and are ready to use them. Do a quick review of the “Basic Concepts: Climate Change” section of the Introduction that has key definitions and key gendered aspects of climate change research. After your review, complete the Learning Exercise on climate change to practice connecting climate change to gender and for some fun!<br><br>PARTICIPATORY QUALITATIVE RESEARCH: You’re a participatory qualitative research novice! We have created a section in the Introduction called “Basic Concepts: Participation” just for you! Read through the content carefully to become familiar with the critical components of this research process. Then, take time to complete the Learning Activities that follow to practice more with identifying bias, understanding your role as a researcher and empathizing with your research participants or program beneficiaries. ");
                  }
                    else  if((result == '210') || (result == '200') || (result == '211') || (result == '201')) {

message = message +(" After reviewing and practicing, you will be ready to start research!<br><br>Review and practice with the terms, concepts and best practices in the Basic Concepts sections of the Introduction. You will need this understanding of gender, climate change and participatory qualitative research in order to create an effective research plan and collect the data that you need for your project or program. Once you have thoroughly reviewed these sections, complete all of the Learning Activities at the end of the Introduction to practice these concepts and prepare for your research. With a little bit of time and focus, you will be ready to begin your research!");
                  }
                  else  if(result == '223'){
message = message +("You’re almost ready!<br><br>GENDER: You’re competent with your knowledge on gender! You are somewhat familiar with the definition of gender and related concepts. To ensure that you are completely ready for your research, review the “Basic Concepts: Gender” section in the Introduction to review terms and discussions about gender and gender-sensitive research. Once finished, complete the Learning Exercise on gender to practice with the concepts.<br><br>CLIMATE CHANGE: You’re competent with your climate change knowledge! You are somewhat familiar with the definition of climate change and related concepts. To ensure that you are completely ready for your research, review the “Basic Concepts: Climate Change” section in the Introduction to review terms and discussions about climate change. Once finished, complete the Learning Exercise on climate change to connect these concepts to gender.<br><br>PARTICIPATORY QUALITATIVE RESEARCH: You’re a participatory qualitative research expert! You understand some of the key aspects of the research process. Do a quick review of the “Basic Concepts: Participation” section of the Introduction to additionally review the types of participation and the best practices for qualitative research. After your review, complete the Learning Exercises on the Role of the Researcher and the Identity Wheel for a little fun, reflection and practice!");
                  }
                   else  if((result == '123') || (result == '023')) {
message = message +("You’re almost ready!<br><br>GENDER: You’re a climate change novice! We have created a section in the Introduction called “Basic Concepts: Gender just for you! Read through the content carefully to become familiar with the definitions of gender and related concepts, as well as gendered aspects of climate change research. Then, take time to complete the Learning Activities that follow to explore the gender concepts and uncover your biases about gender.<br><br>CLIMATE CHANGE: You’re competent with your climate change knowledge! You are somewhat familiar with the definition of climate change and related concepts. To ensure that you are completely ready for your research, review the “Basic Concepts: Climate Change” section in the Introduction to review terms and discussions about climate change. Once finished, complete the Learning Exercise on climate change to connect these concepts to gender.<br><br>PARTICIPATORY QUALITATIVE RESEARCH: You’re a participatory qualitative research expert! You understand some of the key aspects of the research process. Do a quick review of the “Basic Concepts: Participation” section of the Introduction to additionally review the types of participation and the best practices for qualitative research. After your review, complete the Learning Exercises on the Role of the Researcher and the Identity Wheel for a little fun, reflection and practice!");

                  }
                  else  if((result == '113') || (result == '103') || (result == '013') || (result == '003')) {

message = message +(" After reviewing and practicing, you will be ready to start research!<br><br>Review and practice with the terms, concepts and best practices in the Basic Concepts sections of the Introduction. You will need this understanding of gender, climate change and participatory qualitative research in order to create an effective research plan and collect the data that you need for your project or program. Once you have thoroughly reviewed these sections, complete all of the Learning Activities at the end of the Introduction to practice these concepts and prepare for your research. With a little bit of time and focus, you will be ready to begin your research!");
                  }
                  else  if((result == '132') || (result == '032')) {

 message = message +(" You’re almost ready!<br><br>GENDER: You’re a climate change novice! We have created a section in the Introduction called “Basic Concepts: Gender just for you! Read through the content carefully to become familiar with the definitions of gender and related concepts, as well as gendered aspects of climate change research. Then, take time to complete the Learning Activities that follow to explore the gender concepts and uncover your biases about gender.<br><br>CLIMATE CHANGE: You’re a climate change expert! You understand the processes related to climate change and are ready to use them. Do a quick review of the “Basic Concepts: Climate Change” section of the Introduction that has key definitions and key gendered aspects of climate change research. After your review, complete the Learning Exercise on climate change to practice connecting climate change to gender and for some fun!<br><br>PARTICIPATORY QUALITATIVE RESEARCH: You’re competent with your knowledge on gender! You are somewhat familiar with the concepts of participatory qualitative research. To ensure that you are completely ready for your research, review the “Basic Concepts: Participation” section in the Introduction to fully understand types of participation, components of the process and best practices for conducting your research. Once finished, complete the Learning Exercise on the role of the researcher and empathizing with your research participants and program beneficiaries.");
                 }
                  else{
message = message +("After reviewing and practicing, you will be ready to start research!<br><br>Review and practice with the terms, concepts and best practices in the Basic Concepts sections of the Introduction. You will need this understanding of gender, climate change and participatory qualitative research in order to create an effective research plan and collect the data that you need for your project or program. Once you have thoroughly reviewed these sections, complete all of the Learning Activities at the end of the Introduction to practice these concepts and prepare for your research. With a little bit of time and focus, you will be ready to begin your research! ");



                  }


                   console.log(result);


                


                  $html = "<div id='step-10' class='content'><h2 class='StepTitle'>Results</h2><p>"+message+"</p><a href='#' id='buttonStart' class='buttonStart' onclick='reload()'>Take Test Again</a></div>";
                  

                 

                 $(".stepContainer").append($html);

                 


                }               

 


                function showStep(stepIdx){
                    var selStep = steps.eq(stepIdx); 
                    var curStep = steps.eq(curStepIdx);
                    if(stepIdx != curStepIdx){
                      if($.isFunction(options.onLeaveStep)) {
                        if(!options.onLeaveStep.call(this,$(curStep))){
                          return false;
                        }
                      }
                    }     
                    if (options.updateHeight)
                        elmStepContainer.height($($(selStep, obj).attr("href"), obj).outerHeight());               
                    if(options.transitionEffect == 'slide'){
                      $($(curStep, obj).attr("href"), obj).slideUp("fast",function(e){
                            $($(selStep, obj).attr("href"), obj).slideDown("fast");
                            curStepIdx =  stepIdx;                        
                            SetupStep(curStep,selStep);
                          });
                    } else if(options.transitionEffect == 'fade'){                      
                      $($(curStep, obj).attr("href"), obj).fadeOut("fast",function(e){
                            $($(selStep, obj).attr("href"), obj).fadeIn("fast");
                            curStepIdx =  stepIdx;                        
                            SetupStep(curStep,selStep);                           
                          });                    
                    } else if(options.transitionEffect == 'slideleft'){
                        var nextElmLeft = 0;
                        var curElementLeft = 0;
                        if(stepIdx > curStepIdx){
                            nextElmLeft1 = contentWidth + 10;
                            nextElmLeft2 = 0;
                            curElementLeft = 0 - $($(curStep, obj).attr("href"), obj).outerWidth();
                        } else {
                            nextElmLeft1 = 0 - $($(selStep, obj).attr("href"), obj).outerWidth() + 20;
                            nextElmLeft2 = 0;
                            curElementLeft = 10 + $($(curStep, obj).attr("href"), obj).outerWidth();
                        }
                        if(stepIdx == curStepIdx){
                            nextElmLeft1 = $($(selStep, obj).attr("href"), obj).outerWidth() + 20;
                            nextElmLeft2 = 0;
                            curElementLeft = 0 - $($(curStep, obj).attr("href"), obj).outerWidth();                           
                        }else{
                            $($(curStep, obj).attr("href"), obj).animate({left:curElementLeft},"fast",function(e){
                              $($(curStep, obj).attr("href"), obj).hide();
                            });                       
                        }

                        $($(selStep, obj).attr("href"), obj).css("left",nextElmLeft1);
                        $($(selStep, obj).attr("href"), obj).show();
                        $($(selStep, obj).attr("href"), obj).animate({left:nextElmLeft2},"fast",function(e){
                          curStepIdx =  stepIdx;                        
                          SetupStep(curStep,selStep);                      
                        });
                    } else{
                        $($(curStep, obj).attr("href"), obj).hide(); 
                        $($(selStep, obj).attr("href"), obj).show();
                        curStepIdx =  stepIdx;                        
                        SetupStep(curStep,selStep);
                    }
                    return true;
                }
                
                function SetupStep(curStep,selStep){
                   $(curStep, obj).removeClass("selected");
                   $(curStep, obj).addClass("done");
                   
                   $(selStep, obj).removeClass("disabled");
                   $(selStep, obj).removeClass("done");
                   $(selStep, obj).addClass("selected");
                   $(selStep, obj).attr("isDone",1);
                   adjustButton();
                   if($.isFunction(options.onShowStep)) {
                      if(!options.onShowStep.call(this,$(selStep))){
                        return false;
                      }
                   } 
                }                
                
                function doForwardProgress(){
                   var nextStepIdx = curStepIdx + 1;
                   var i = $("#step-"+curStepIdx+" :input:checked"); 
                   
                   if(i.length>0){
                    if(steps.length <= nextStepIdx){
                    if(!options.cycleSteps){
                      return false;
                     }                  
                     nextStepIdx = 0;
                   }
                  LoadContent(nextStepIdx);
                   }
                   else{
                      
                      alert('Answer this question before you can proceed');

                   }

                  
                }
                
                function doBackwardProgress(){
                  var nextStepIdx = curStepIdx-1;
                  if(0 > nextStepIdx){
                    if(!options.cycleSteps){
                      return false;
                    }
                    nextStepIdx = steps.length - 1;
                  }
                  LoadContent(nextStepIdx);
                }  
              



              }
                function adjustButton(){
                  if(!options.cycleSteps){                
                    if(0 >= curStepIdx){
                      $(btPrevious).addClass("buttonDisabled");
                    }else{
                      $(btPrevious).removeClass("buttonDisabled");
                    }
                    if((steps.length-1) <= curStepIdx){
                      $(btNext).addClass("buttonDisabled");
                    }else{
                      $(btNext).removeClass("buttonDisabled");
                    }
                  }
                  // Finish Button 
                  if(!steps.hasClass('disabled') || options.enableFinishButton){
                    $(btFinish).removeClass("buttonDisabled");
                  }else{
                    $(btFinish).addClass("buttonDisabled");
                  }                  
                }
                
                function showMessage(msg){
                  $('.content',msgBox).html(msg);
              		msgBox.show();
                }

               
                
                function setError(stepnum,iserror){
                  if(iserror){                    
                    $(steps.eq(stepnum-1), obj).addClass('error')
                  }else{
                    $(steps.eq(stepnum-1), obj).removeClass("error");
                  }                                   
                }                        
        });  
    };  
 
    // Default Properties and Events
    $.fn.smartWizard.defaults = {
          selected: 0,  // Selected Step, 0 = first step   
          keyNavigation: true, // Enable/Disable key navigation(left and right keys are used if enabled)
          enableAllSteps: false,
          updateHeight: true,
          transitionEffect: 'fade', // Effect on navigation, none/fade/slide/slideleft
          contentURL:null, // content url, Enables Ajax content loading
          contentCache:true, // cache step contents, if false content is fetched always from ajax url
          cycleSteps: false, // cycle step navigation
          includeFinishButton: true, // whether to show a Finish button
          enableFinishButton: false, // make finish button enabled always
          errorSteps:[],    // Array Steps with errors
          labelNext:'Next',
          labelPrevious:'Previous',
          labelFinish:'Finish',   
          labelStart: 'Take Test Again',       
          onLeaveStep: null, // triggers when leaving a step
          onShowStep: null,  // triggers when showing a step
          onFinish: null  // triggers when Finish button is clicked
    };    
    
})(jQuery);
