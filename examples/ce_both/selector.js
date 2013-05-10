$('img').bind('click',function(){
  $('.dash-main-select').hide();
  require([this.id+"/main"], function() {});       
});