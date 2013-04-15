define(
    [],

    function() {

        return Interactions;

        function Interactions() {

            var interactions = [],
                interactionAreas = [],
                activeArea = null;

            this.registerInteraction = function(options) {
                interactions.push(options);
            };

            this.after('initialize', function() {
                this.$cardToolbox.on('dragstart',
                    '.card', $.proxy(function(e) {
                    this.onDragStart();
                }, this));

                this.$cardToolbox.on('drag', '.card', $.proxy(function(e, ui) {
                    this.onDrag($(ui.helper));
                }, this));
            });

            this.onDragStart = function() {
                var cards = this.getAllCards();
                interactionAreas = [];
                $.each(interactions, $.proxy(function(i, interaction) {
                    var areas = interaction.getAreas.call(this, cards);
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
                    if (left > area.left + 100 &&
                        left < area.left + 300 &&
                        top > area.top &&
                        top < area.top + 200) {

                        newActive = area;
                    }
                }, this));

                if (newActive) {
                    if (newActive !== activeArea) {
                        newActive.interaction.activate.call(this, newActive, card);
                    }
                } else {
                     
                }
                activeArea = newActive;
            };

            this.onDragStop = function() {

            };
        }
    }
);
