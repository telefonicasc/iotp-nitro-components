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

                this.$delimiterList = $('<ul>')
                        .appendTo(this.$node);

                $.each(this.attr.delimiterList, $.proxy(function(i, del) {
                    $('<li>').addClass('delimiter-value')
                            .appendTo(this.$delimiterList)
                            .append($('<span>').html(del)); 
                }, this));

                this.$delimiterValue.on('click', $.proxy(function() {
                    this.$delimiterList.find('li').slideToggle(150);
                }, this));

                this.$delimiterList.on('click', 'li', $.proxy(function(e) {
                    this.setDelimiterValue($(e.currentTarget).find('span').html());
                    this.$delimiterList.find('li').slideToggle(200);
                }, this));

                this.on('valueChange', function(e, o) {
                    this.$delimiterValueSpan.html(o.value);
                });

                this.$delimiterList.find('li').slideToggle(0);

                this.setDelimiterValue(this.attr.delimiterList[0]);
            });

            this.setDelimiterValue = function(value) {
                this.$delimiterValueSpan.html(value);
                this.delimiterValue = value;
                this.trigger('valueChange', { value: value });
            }
        }        
    }
);
