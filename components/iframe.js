define(
    [
        'components/component_manager',
        'components/mixin/template'
    ],

    function(ComponentManager, Template) {

        return ComponentManager.create('IFrame', IFrame, Template);

        function IFrame(){

        	this.defaultAttrs({
        		tpl: '<iframe width="{{width}}" height="{{height}}" style="display: block; min-height:{{height}};" '+
                     'class="frame" frameborder="0" border="0" marginwidth="0" marginheight="0" '+
                     'scrolling="{{scrolling}}" src="{{src}}">Your browser does not support inline frames.</iframe>',
        		height: '100%',
		        width: '100%',
		        scrolling: 'no',
		        src: '',
                onload: function(){}
        	});	

        	this.after('initialize', function() {
                  
                this.after('template', function(){
                    var self = this;
                    $('iframe').load( function(){
                        self.attr.onload();
                    });

                    $('iframe').error( function(){
                        console.log('error!!');
                    });
                });

        	});
        }
    }
);        