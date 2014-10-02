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
                    'GREATER_THAN',
                    'MATCH'
                ],
                delimiterLabels: {
                    'EQUAL_TO': 'IS',
                    'DIFFERENT_TO': 'IS NOT',
                    'MINOR_THAN': 'BELOW',
                    'GREATER_THAN': 'ABOVE',
                    'MATCH': 'MATCH'
                },
                delimiterCustomLabels: [],
                cardConfig : {'conditionList':[]}
            });

            this.after('initialize', function() {
                var cardElement = this.attr.node;
                var cardConfig = this.attr.cardConfig;
                var delimiterList = cardElement.data('delimiterList');
                var delimiterValue;
                this.attr.delimiterCustomLabels = cardElement.data('delimiterCustomLabels');

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
                        this.expanded = true;
                    }
                }, this));

                this.$delimiterList.on('click', 'li', $.proxy(function(e) {
                    this.setDelimiterValue($(e.currentTarget).data('value'));
                    this.$delimiterList.find('li').slideToggle(200);
                    this.expanded = false;
                }, this));

                $('body').on('click', $.proxy(function(e) {
                    if (this.expanded &&
                        e.target !== this.$delimiterValueSpan[0] &&
                        e.target !== this.$delimiterValue[0]) {
                        this.$delimiterList.find('li').slideToggle(200);
                        this.expanded = false;
                    }
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
                    delimiterValue = delimiterList[0];
                }

                this.setDelimiterValue(delimiterValue);

            });

            this.getDelimiterLabel = function(del) {
                var delimiterKeyLabel = del;
                if (this.attr.delimiterCustomLabels && this.attr.delimiterCustomLabels.length > 0) {
                        $.each(this.attr.delimiterCustomLabels, function(i, o) {
                            if(del == o.valueKey){
                                delimiterKeyLabel = o.labelKey;
                            }
                        });
                    }
                return this.attr.delimiterLabels[delimiterKeyLabel] || delimiterKeyLabel;
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
