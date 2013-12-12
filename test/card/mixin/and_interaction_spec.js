define([
        'components/card/mixin/and_interaction',
        'libs/flight/lib/component'
    ],

    function(AndInteraction, defineComponent) {

        describe('a component with and interaction mixin', function() {

            beforeEach(function() {
                var self = this;

                this.registerInteraction = function(options) {
                    this.getAreas = options.getAreas;
                    this.activate = options.activate;
                };
                spyOn(this, 'registerInteraction').andCallThrough();

                var testComponent = defineComponent(function TestComponent() {
                    this.registerInteraction = self.registerInteraction;
                    this.getConnectedTo = function(card) {
                        return card.data('connectedTo');
                    };
                    this.removeConnection = function(card, nextcard) {
                        var connected = card.data('connectedTo') || $([]);
                        card.data('connectedTo', connected.not(nextcard));
                    };
                    this.addConnection = function(card, nextcard) {
                        var connected = card.data('connectedTo') || $([]);
                        card.data('connectedTo', connected.add(nextcard));
                    };
                }, AndInteraction);

                this.$node = $('<div>').appendTo($('body'));
                //testComponent.attachTo(this.$node);
                this.component = new testComponent(this.$node);

                this.card1 = $('<div>')
                    .addClass('m2m-card-condition')
                    .appendTo($('body'));

                this.card2 = $('<div>')
                    .data('connectedTo', $(this.card1))
                    .addClass('m2m-card-condition')
                    .appendTo($('body'));

                this.card3 = $('<div>')
                    .data('connectedTo', $(this.card2))
                    .addClass('m2m-card-action')
                    .appendTo($('body'));

                this.cards = $([this.card1, this.card2, this.card3]);

                this.draggingCard = $('<div>').addClass('m2m-card-condition');
                this.draggingCard2 = $('<div>').addClass('m2m-card-action');
            });

            afterEach(function() {
                this.$node.remove();
            });

            it('should call registerInteraction', function() {
                expect(this.registerInteraction).toHaveBeenCalled();
            });

            it('should create an area for each condition card', function() {
                var areas = this.component.getAreas(this.cards,
                    this.draggingCard);
                expect(areas.length).toBe(2);
            });

            it('should not return any area if it each an action', function() {
                var areas = this.component.getAreas(this.cards,
                    this.draggingCard2);
                expect(areas.length).toBe(0);
            });

            it('should create connections propertly', function() {
                var area = { card: this.card2 };
                this.component.activate(area, this.draggingCard);
                expect(this.card2.data('connectedTo')
                        .is(this.draggingCard)).toBe(true);
                expect(this.draggingCard.data('connectedTo')
                        .is(this.card1)).toBe(true);
            });

            it('the last card is connected with the previous', function() {
                var area = { card: this.card1 };
                this.component.activate(area, this.draggingCard);
                expect(this.card1.data('connectedTo')
                        .is(this.draggingCard)).toBe(true);
            });

        });

    }
);
