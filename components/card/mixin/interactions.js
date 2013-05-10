define(
    [],

    function() {

        return Interactions;

        function Interactions() {

            var interactions = [],
                interactionAreas = [],
                tempRemovedCards = [],
                activeArea = null;

            this.registerInteraction = function(options) {
                interactions.push(options);
            };

            this.after('initialize', function() {
                $.each([this.$conditionsToolbox, this.$actionsToolbox],
                    $.proxy(function(i, toolbox) {
                        toolbox.on('dragstart',
                            '.card', $.proxy(function(e, ui) {
                            this.onDragStart($(ui.helper));
                        }, this));

                        toolbox.on('drag', '.card', $.proxy(function(e, ui) {
                            this.onDrag($(ui.helper));
                        }, this));
                    }, this));
            });

            this.onDragStart = function(card) {
                var cards = this.getAllCards();
                interactionAreas = [];
                tempRemovedCards = [];
                this.$graphEditor.trigger('saveConnections');
                $.each(interactions, $.proxy(function(i, interaction) {
                    var areas = interaction.getAreas.call(this, cards, card);
                    if (areas) {
                        $.each(areas, function(i, area) {
                            area.interaction = interaction;
                        });
                        interactionAreas = interactionAreas.concat(areas);
                    }
                }, this));
            };

            this.onDrag = function(card) {
                var newActive,
                    position = card.data(),
                    left = position.left,
                    top = position.top;
                
                $.each(interactionAreas, $.proxy(function(i, area) {
                    if (left > area.left &&
                        left < area.left + area.width &&
                        top > area.top &&
                        top < area.top + area.height) {

                        newActive = area;
                    }
                }, this));

                this.disableRelayout = true;
                if (newActive) {
                    if (newActive !== activeArea) {
                        this.$graphEditor.trigger('restoreConnections');
                        this.undoTempRemoved();
                        newActive.interaction.activate.call(this, newActive, card);
                    }
                } else {
                    if (activeArea) {
                        this.$graphEditor.trigger('restoreConnections'); 
                        this.undoTempRemoved();
                    }
                }
                this.disableRelayout = false;
                this.relayoutCards();
                activeArea = newActive;
            };

            this.tempRemoveCard = function(card) {
                card.hide();
                tempRemovedCards.push(card);                
            };

            this.undoTempRemoved = function() {
                $.each(tempRemovedCards, function(i, card) {
                    card.show();
                });
                tempRemovedCards = [];
            };

            this.onDragStop = function() {
                if (activeArea) {
                    $.each(tempRemovedCards, $.proxy(function(i, card) {
                        this.$graphEditor.trigger('removeNode', card);
                    }, this));
                } else {
                    this.undoTempRemoved();
                }
            };
        }
    }
);
