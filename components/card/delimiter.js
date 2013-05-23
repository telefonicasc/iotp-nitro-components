define(
    [
        'components/component_manager'
    ],

    function(ComponentManager) {

        return ComponentManager.create('CardDelimiter', CardDelimiter);

        function CardDelimiter() {

            this.defaultAttrs({
                delimiterList: [{
                    label: 'IS',
                    operator: 'EQUAL_TO'
                }, {                    
                    label: 'IS NOT',
                    operator: 'DIFFERENT_TO'
                }, {
                    label: 'BELOW',
                    operator: 'MINOR_THAN'
                }, {
                    label: 'ABOVE',
                    operator: 'GREATER_THAN'
                }]
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
                            .data('value', del)
                            .append($('<span>').html(del.label));
                }, this));

                this.$delimiterValue.on('click', $.proxy(function() {
                    this.$delimiterList.find('li').slideToggle(150);
                }, this));

                this.$delimiterList.on('click', 'li', $.proxy(function(e) {
                    this.setDelimiterValue($(e.currentTarget).data('value'));
                    this.$delimiterList.find('li').slideToggle(200);
                }, this));

                this.on('valueChange', function(e, o) {
                    this.$delimiterValueSpan.html(o.value.label);
                });

                this.$delimiterList.find('li').slideToggle(0);

                this.setDelimiterValue(this.attr.delimiterList[0]);
            });

            this.setDelimiterValue = function(del) {
                this.$delimiterValueSpan.html(del.label);
                this.delimiterValue = del;
                this.$node.data('operator', del.operator);
                this.trigger('valueChange', { value: del });
            };
        }
    }
);
