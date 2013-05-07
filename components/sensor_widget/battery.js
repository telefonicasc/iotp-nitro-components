define(
    [   
        'components/component_manager',
        'components/mixin/data_binding',
        'components/sensor_widget/mixin/scale_widget'
    ],
    
    function(ComponentManager, DataBinding, ScaleWidget) {
   
        return ComponentManager.create('Battery', DataBinding, Battery);

        function Battery() {
            
            this.after('initialize', function() {
                
                this.$scale = $('<div>').appendTo(this.$node);
                this.$scale.css({
                    width: '100%', height: '100%'
                });
                ScaleWidget.attachTo(this.$scale, {});
               
            });
        }
    }
);
