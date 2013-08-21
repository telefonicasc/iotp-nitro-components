define([
        'components/card/mixin/action_drop_interaction',
        'libs/flight/lib/component'
    ],

    function(ActionDrop, defineComponent) {

        describe('a component with actiondrop interaction mixin', function() {

            beforeEach(function() {
                var self = this;

                this.registerInteraction = function(options) {
                    this.getAreas = options.getAreas;
                    this.activate = options.activate;
                };
                this.tempRemoveCard = function(card) {

                };
                spyOn(this, 'registerInteraction').andCallThrough();
                spyOn(this, 'tempRemoveCard');

                var testComponent = defineComponent(function TestComponent() {
                    this.registerInteraction = self.registerInteraction;
                    this.getConnectedTo = function(card) {
                        return card.data('connectedTo');
                    };
                    this.getConnectedFrom = function(card) {
                        var prevcard;
                        $.each(self.cards, function() {
                            var connected =
                                $(this).data('connectedTo') || $([]);
                            if (connected.is(card)) prevcard = $(this);
                        });
                        return prevcard;
                    };
                    this.removeConnection = function(card, nextcard) {
                        var connected = card.data('connectedTo') || $([]);
                        card.data('connectedTo', connected.not(nextcard));
                    };
                    this.addConnection = function(card, nextcard) {
                        var connected = card.data('connectedTo') || $([]);
                        card.data('connectedTo', connected.add(nextcard));
                    };
                    this.tempRemoveCard = self.tempRemoveCard;
                }, ActionDrop);

                this.$node = $('<div>').appendTo($('body'));
                this.component = new testComponent(this.$node);

                this.card1 = $('<div>')
                    .attr('id', 'card1')
                    .addClass('card-placeholder')
                    .appendTo($('body'));

                this.card2 = $('<div>')
                    .attr('id', 'card2')
                    .data('connectedTo', $(this.card1))
                    .addClass('m2m-card-condition')
                    .appendTo($('body'));

                this.cards = $([this.card1, this.card2]);

                this.draggingCard = $('<div>').addClass('m2m-card-condition');
                this.draggingCard2 = $('<div>').addClass('m2m-card-action');
            });

            afterEach(function() {
                this.$node.remove();
            });

            it('should call registerInteraction', function() {
                expect(this.registerInteraction).toHaveBeenCalled();
            });

            it('should create an area for each placeholder card', function() {
                var areas = this.component.getAreas(this.cards,
                    this.draggingCard2);
                expect(areas.length).toBe(1);
            });

            it('should not return any area if it each an action', function() {
                var areas = this.component.getAreas(this.cards,
                    this.draggingCard);
                expect(areas.length).toBe(0);
            });

            it('connected with the previous', function() {
                var area = { placeholder: this.card1 };
                this.component.activate(area, this.draggingCard2);
                expect(this.card2.data('connectedTo')
                        .is(this.draggingCard2)).toBe(true);
            });

        });

    }
);
