define(
    [
        'components/component_manager',
        'components/mixin/data_binding'
    ],

    function(ComponentManager, DataBinding) {

        return ComponentManager.create('CardFrontBinary', DataBinding, 
            CardFrontBinary);

        function CardFrontBinary() {
    
            this.defaultAttrs({
                trueLabel: 'True',
                trueValue: 'true',
                falseLabel: 'False',
                falseValue: 'false' 
            });

            this.after('initialize', function() {
                this.$node.addClass('m2m-card-binary');

                this.$trueButton = $('<div>').addClass('binary-button')
                        .append($('<span>').html(this.attr.trueLabel))
                        .appendTo(this.$node);   

                this.$falseButton = $('<div>').addClass('binary-button')
                        .append($('<span>').html(this.attr.falseLabel))
                        .appendTo(this.$node);

                this.on('valueChange', function(e, o) {
                    this.setValue(o.value);
                });
        
                this.setValue(this.attr.falseValue);
            });

            this.setValue = function(value) {

                if (value === this.attr.trueValue) {
                    this.$trueButton.addClass('selected');
                    this.$falseButton.removeClass('selected');
                } else {
                    this.$trueButton.removeClass('selected');
                    this.$falseButton.addClass('selected');
                }
            }
        }
    }
);
