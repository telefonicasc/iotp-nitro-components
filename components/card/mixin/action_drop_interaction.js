define(
    [],

    function() {

        return ActionDropInteraction;

        function ActionDropInteraction() {
            this.after('initialize', function() {
                this.registerInteraction({
                    getAreas: getAreas,
                    activate: activate
                });
            });
        }

        function getAreas(cards, draggingCard) {
            var areas = [];

            if (draggingCard.hasClass('m2m-card-action')) {
                cards.each($.proxy(function(i, el) {
                    if ($(el).hasClass('card-placeholder') ||
                        $(el).hasClass('action-card')) {
                        var area = $(el).position();
                        area.width = 200;
                        area.height = 200;
                        area.placeholder = $(el);
                        areas.push(area);
                    }
                }, this));
            }
            return areas;
        }

        
        function activate(area, card) {
            var previousCard = this.getConnectedFrom(area.placeholder);
            var nextcard = this.getConnectedTo(area.placeholder);

            if (area.placeholder.hasClass('card-placeholder')) {
                this.removeConnection(previousCard, area.placeholder);
                this.tempRemoveCard(area.placeholder);
                this.addConnection(previousCard, card);

            } else {
                if (nextcard.length > 0) {
                    var previous = this.getConnectedFrom(nextcard);

                    this.removeConnection(area.placeholder, nextcard);
                    this.addConnection(card, nextcard);
                    this.addConnection(previous, card);
                } else {
                    this.removeConnection(area.placeholder, card);
                    this.addConnection(area.placeholder, card);
                }
            }
        }

    }
);
