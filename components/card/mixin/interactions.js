define(
    [],

    function() {

        return Interactions;

        function Interactions() {

            var interactions = [];
            var interactionAreas = [];

            this.registerInteraction = function(options) {
                interactions.push(options);
            };

            this.after('initialize', function() {
                this.$cardToolbox.on('dragstart',
                    '.card', $.proxy(function(e) {
                    this.onDragStart();
                }, this));

                this.$cardToolbox.on('drag', '.card', $.proxy(function(e, ui) {
                    var position = {},
                        componentOffset = this.$node.offset(),
                        helperOffset = $(ui.helper).offset();

                    position.left = helperOffset.left - componentOffset.left;
                    position.top = helperOffset.top - componentOffset.top;
                    this.onDrag(position, $(ui.helper));
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

            this.onDrag = function(position, card) {
                var left = position.left,
                    top = position.top;
                $.each(interactionAreas, $.proxy(function(i, area) {
                    if (left > area.left + 100 &&
                        left < area.left + 300 &&
                        top > area.top &&
                        top < area.top + 200) {

                        area.interaction.activate.call(this, area, card);
                    }
                }, this));
            };

            this.onDragStop = function() {

            };
        }
    }
);
