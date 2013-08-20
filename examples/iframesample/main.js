requirejs.config({
    baseUrl: '../../'
});
define(
[
    'components/iframe'
],
function() { requirejs(['components/jquery_plugins'], function() {
   
    var $ele = $('#myIframe');
    $ele.m2mIFrame( {
    	src: 'htalhost/kermit',
    	onload: function(){
    		console.log('FRAME LOADED!!');
    	}
    });

});});