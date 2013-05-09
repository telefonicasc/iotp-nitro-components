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

                this.setCardSections(this.attr.cardSections);

                this.$content.prepend(this.$cardSectionSwitch);
                RadioButton.attachTo(this.$cardSectionSwitch, {});

                this.$cardSectionSwitch.on('selected', $.proxy(function(e, o) {
                    var section = this.cardSections[o.name];
                    this.$node.find('.card-toolbox-section')
                        .css('display', 'none');
                    section.el.css('display', 'block');
                }, this));

                this.on('optionsChange', function(e, o) {
                    this.setCardSections(o.cardSections);
                });

                this.selectFirstSection();

                // TODO : A bit ugly
                this.trigger('collapse', { duration: 0 });
                this.trigger('expand', { duration: 0 });
            });

            this.setCardSections = function(cardSections) {

                this.emptyCardSections();

                this.cardSections = $.extend({}, cardSections);
                $.each(this.cardSections, $.proxy(function(key, section) {
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
            };

            this.selectFirstSection = function() {
                if (this.cardSections) {
                    var first = $.map(this.cardSections, function(o, key) {
                            return key;
                        })[0];
                    this.$cardSectionSwitch
                        .trigger('selected', { name: first });
                }
            };

            this.emptyCardSections = function() {
                this.$node.find('.card-toolbox-section').remove();
                this.$cardSectionSwitch.empty();
            };
        }
    }
);
