$(document).ready(function () {
    //$().UItoTop({ easingType: "easeOutQuart" });
    flag = 0
    window.setInterval(function(){
      if (flag == 0){
        $('.int-span').hide()
        flag = 1
      }else {
        $('.int-span').show()
          flag = 0
      }
      
    }, 700)
  });