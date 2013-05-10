define(
    [
        'components/component_manager'
    ],
    
    function(ComponentManager) {
     
        return ComponentManager.create('CardDelimiter', CardDelimiter);
        
        function CardDelimiter() {
            
            this.defaultAttrs({
                delimiterList: [
                    'IS',
                    'IS NOT',
                    'BELOW',
                    'ABOVE'
                ] 
            });

            this.after('initialize', function() {

                this.$node.addClass('m2m-card-delimiter');
                
                this.$delimiterValue = $('<div>')
                        .addClass('delimiter-value')
                        .appendTo(this.$node);  

                this.$delimiterValueSpan = $('<span>')
                        .appendTo(this.$delimiterValue);

                this.on('valueChange', function(e, o) {
                    this.$delimiterValueSpan.html(o.value);
                });

                this.setDelimiterValue(this.attr.delimiterList[0]);
            });

            this.setDelimiterValue = function(value) {
                this.delimiterValue = value;
                this.trigger('valueChange', { value: value });
            }
        }        
    }
);
