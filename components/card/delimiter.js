define(
    [
        'components/component_manager'
    ],

    function(ComponentManager) {

        return ComponentManager.create('CardDelimiter', CardDelimiter);

        function CardDelimiter() {

            this.defaultAttrs({
                delimiterList: [
                    'EQUAL_TO',
                    'DIFFERENT_TO',
                    'MINOR_THAN',
                    'GREATHER_THAN'
                ],
                delimiterLabels: {
                    'EQUAL_TO': 'IS',
                    'DIFFERENT_TO': 'IS NOT',
                    'MINOR_THAN': 'BELOW',
                    'GREATHER_THAN': 'ABOVE'
                },
                cardConfig : {'conditionList':[]}
            });

            this.after('initialize', function() {
                var cardElement = this.attr.node;
                var cardConfig = this.attr.cardConfig;
                var delimiterList = cardElement.data('delimiterList');
                var delimiterValue;

                if(!$.isArray(delimiterList)){
                    delimiterList = this.attr.delimiterList;
                }

                this.$node.addClass('m2m-card-delimiter');

                this.$delimiterValue = $('<div>')
                        .addClass('delimiter-value')
                        .appendTo(this.$node);

                this.$delimiterValueSpan = $('<span>')
                        .appendTo(this.$delimiterValue);

                this.$delimiterList = $('<ul>')
                        .appendTo(this.$node);

                $.each(delimiterList, $.proxy(function(i, del) {
                    $('<li>').addClass('delimiter-value')
                            .appendTo(this.$delimiterList)
                            .data('value', del)
                            .append($('<span>')
                              .html(this.getDelimiterLabel(del)));
                }, this));

                this.$delimiterValue.on('click', $.proxy(function() {
                    var isEditable = this.$node.data('editable') !== false;
                    if (isEditable) {
                      this.$delimiterList.find('li').slideToggle(150);
                    }
                }, this));

                this.$delimiterList.on('click', 'li', $.proxy(function(e) {
                    this.setDelimiterValue($(e.currentTarget).data('value'));
                    this.$delimiterList.find('li').slideToggle(200);
                }, this));

                this.on('valueChange', function(e, o) {
                    this.$delimiterValueSpan
                      .html(this.getDelimiterLabel(o.value));
                    cardElement.trigger('conditionOperatorChange', o.value);
                });

                this.$delimiterList.find('li').slideToggle(0);
                if(cardConfig.conditionList.length){
                    delimiterValue = cardConfig.conditionList[0].operator;
                }else{
                    delimiterValue = this.attr.delimiterList[0];
                }

                this.setDelimiterValue(delimiterValue);

            });

            this.getDelimiterLabel = function(del) {
                return this.attr.delimiterLabels[del] || del;
            };

            this.setDelimiterValue = function(del) {
                this.$delimiterValueSpan.html(this.getDelimiterLabel(del));
                this.delimiterValue = del;
                this.$node.data('operator', del);
                this.trigger('valueChange', { value: del });
            };
        }
    }
);
