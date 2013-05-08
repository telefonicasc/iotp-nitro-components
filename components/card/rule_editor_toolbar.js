define(
    [
        'components/component_manager',
        'components/slider'
    ],

    function(ComponentManager, Slider) {

        return ComponentManager.create('RuleEditorToolbar', 
            RuleEditorToolbar);

        function RuleEditorToolbar() {

            this.defaultAttrs({
                
            });

            this.after('initialize', function() {
            
                this.$node.addClass('rule-bottom-toolbar');
                this.$node.addClass('border-panel vertical-panel');
               
                this.$zoomSlider = $('<div>').appendTo(this.$node);
                Slider.attachTo(this.$zoomSlider);  

                this.$zoomSlider.on('valueChange', $.proxy(function(e, o) {
                    this.trigger('zoomChange', { zoomLevel: o.value });
                }, this));
            });
        }

    }
);
