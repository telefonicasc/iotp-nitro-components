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
                            if (this.editable !== false) {
                                this.onDragStart($(ui.helper));
                            } else {
                                return false;
                            }
                        }, this));

                        toolbox.on('drag', '.card', $.proxy(function(e, ui) {
                            this.onDrag($(ui.helper));
                        }, this));

                        toolbox.on('dragstop', '.card', $.proxy(function(e, ui) {
                            this.onDragStop($(ui.helper));
                        }, this));
                    }, this));

                var startLeft, startTop, detached;

                this.$graphEditor.on('dragstart', '.card', $.proxy(function(e, ui) {
                    if (this.editable !== false) {
                      var position = $(e.target).position();
                      detached = false;
                      startLeft = position.left;
                      startTop = position.top;
                    } else {
                      return false;
                    }
                }, this));

                this.$graphEditor.on('drag', '.card', $.proxy(function(e, ui) {
                    var position = $(e.target).position();
                    if (!detached) {
                        if (Math.abs(position.left-startLeft) > 100 ||
                            Math.abs(position.top-startTop) > 100) {
                            detached = true;
                            $(e.target).data('detached', true);
                            this.detachCard($(e.target));
                            this.relayoutCards();
                            this.onDragStart($(e.target));
                        }
                    } else {
                        this.onDrag($(e.target));
                    }
                }, this));

                this.$graphEditor.on('dragstop', '.card', $.proxy(function(e, ui) {
                    if (detached) {
                        this.onDragStop($(e.target));
                    }
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
                card.data('dragging', true);
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
                        if (activeArea) {
                            this.$graphEditor.trigger('restoreConnections');
                        }
                        this.undoTempRemoved();
                        newActive.interaction.activate.call(this, newActive, card);
                    }
                    card.data('detached', false);
                } else {
                    if (activeArea) {
                        this.$graphEditor.trigger('restoreConnections'); 
                        this.undoTempRemoved();
                    }
                    card.data('detached', true);
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

            this.onDragStop = function(card) {
                card.data('dragging', false);
                this.relayoutCards();

                if (activeArea) {
                    $.each(tempRemovedCards, $.proxy(function(i, card) {
                        this.$graphEditor.trigger('removeGraphNode', { node: card });
                    }, this));
                } else {
                    this.undoTempRemoved();
                }

                if (card.data('detached')) {
                    var delimiter = $(card).data('delimiter');
                    if (delimiter) {
                        delimiter.remove();
                    }
                    this.$graphEditor.trigger('removeGraphNode', { node: card });
                }
            };
        }
    }
);
