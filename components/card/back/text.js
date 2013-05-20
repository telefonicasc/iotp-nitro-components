define(
    [
        'components/component_manager',
        'components/mixin/data_binding'
    ],

    function(ComponentManager, DataBinding, Template) {
        return ComponentManager.create('CardBackText', DataBinding,
            CardBackText);

        function CardBackText() {
            
            this.defaultAttrs({
            });

            this.after('initialize', function() {
                
                this.$node.addClass('m2m-card-text');
                this.$input = $('<input>').appendTo(this.$node);

                this.$input.on('keyup', $.proxy(function(e) {
                    this.trigger('valueChange', { 
                        value: this.$input.val()
                    });
                }, this));

                this.on('valueChange', function(e,o) {
                    this.$input.val(o.value);
                });
            });
        }

    }
);
