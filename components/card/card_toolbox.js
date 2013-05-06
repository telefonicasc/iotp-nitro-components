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
                }
            });

            this.after('initialize', function() {

                this.$node.addClass('card-toolbox');

                this.$cardSectionSwitch = $('<div>');

                $.each(this.attr.cardSections, $.proxy(function(key, section) {
                    section.el = $('<div>').addClass('card-toolbox-section')
                                    .appendTo(this.$content);
                    section.button = $('<input>')
                        .attr({ 'type': 'radio', 'name': key })
                        .data('label', section.label);
                    this.$cardSectionSwitch.append(section.button);
                    $.each(section.cards, $.proxy(function(i, card) {
                        var cardEl = $('<div>').addClass('preview')
                                        .appendTo(section.el),
                            attrCard = $.extend({},
                                        this.attr.cardDefaults, card),
                            cardCmp = ComponentManager.get(attrCard.component);

                        cardCmp.attachTo(cardEl, $.extend({},
                            this.attr.cardDefaults, card));
                        Draggable.attachTo(cardEl, {
                            helper: function() {
                                var newCardEl = $('<div>');
                                Card.attachTo(newCardEl, card);
                                return newCardEl;
                            }
                        });
                    }, this));
                }, this));

                this.$content.prepend(this.$cardSectionSwitch);
                RadioButton.attachTo(this.$cardSectionSwitch, {});

                this.$cardSectionSwitch.on('selected', $.proxy(function(e, o) {
                    var section = this.attr.cardSections[o.name];
                    this.$node.find('.card-toolbox-section')
                        .css('display', 'none');
                    section.el.css('display', 'block');
                }, this));

                if (this.attr.cardSections) {
                    var first = $.map(this.attr.cardSections, function(o, key) {
                            return key;
                        })[0];
                    this.$cardSectionSwitch
                        .trigger('selected', { name: first });
                }
            });
        }
    }
);
