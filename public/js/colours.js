var colours = ["#fbc93d", "#fb4f4f", "tomato", "plum"];


$(document).ready(function(){
  var randomNo = Math.random();
  if(randomNo <= 0.25){
    $('body').css('background-color', colours[0]);
  } else if(randomNo >0.25 && randomNo <= 0.50){
    $('body').css('background-color', colours[1]);
  } else if(randomNo >0.50 && randomNo <= 0.75){
    $('body').css('background-color', colours[2]);
  } else {
    $('body').css('background-color', colours[3]);
  }
});