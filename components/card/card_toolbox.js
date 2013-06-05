define(
    [
        'components/component_manager',
        'components/panel/border_collapsable_panel',
        'components/card/card',
        'components/draggable',
        'components/radio_button'
    ],

    function(ComponentManager, BorderCollapsablePanel, Card,
             Draggable, RadioButton) {

        return ComponentManager.extend(BorderCollapsablePanel,
                'CardToolbox', CardToolbox);

        function CardToolbox() {

            this.defaultAttrs({
                cardDefaults: {
                    flippable: false,
                    component: 'Card'
                },
                locales: {}
            });

            this.after('initialize', function() {

                this.$node.addClass('card-toolbox');

                this.setCardSections(this.attr.cardSections);

                this.on('optionsChange', function(e, o) {
                    this.setCardSections(o.cardSections);
                });

                // TODO : A bit ugly
                this.trigger('collapse', { duration: 0 });
                this.trigger('expand', { duration: 0 });
            });
            //=====================
            this.setCardSections = function(cardSections) {

                this.emptyCardSections();

                this.cardSections = $.extend({}, cardSections);
                $.each(this.cardSections, $.proxy(function(key, section) {
                    section.el = $('<div>').addClass('card-toolbox-section')
                                    .appendTo(this.$content);
                    section.button = $('<input>')
                        .attr({ 'type': 'radio', 'name': key })
                        .data('label', section.label);
                    $.each(section.cards, $.proxy(function(i, card) {
                        var cardEl = $('<div>').addClass('preview')
                                        .appendTo(section.el),
                            attrCard = $.extend({},
                                        this.attr.cardDefaults, card),
                            cardCmp = ComponentManager.get(attrCard.component),
                            locales = this.attr.locales;

                        cardCmp.attachTo(cardEl, $.extend({},
                            this.attr.cardDefaults, card));
                        Draggable.attachTo(cardEl, {
                            appendTo: this.attr.containment || 'body',
                            containment: this.attr.containment,
                            helper: function() {
                                var newCardEl = $('<div>');
                                var data = $.extend({}, card, {id:null});
                                if (locales[attrCard.component]) {
                                    data.locales = locales[attrCard.component];
                                }
                                cardCmp.attachTo(newCardEl, data);
                                newCardEl.data('cardConfig', card['__cardConfig']);//===========
                                return newCardEl;
                            }
                        });
                    }, this));
                }, this));
            };

            this.emptyCardSections = function() {
                this.$node.find('.card-toolbox-section').remove();
            };
        }
    }
);
