define(
    [],

    function() {

        function TimeDropInteraction() {
            this.after('initialize', function() {
                this.registerInteraction({
                    getAreas: getAreas,
                    activate: activate
                });
            });
        }

        function getAreas(cards, draggingCard) {
            var areas = [];
            if (draggingCard.hasClass('m2m-card-time') && draggingCard.hasClass('m2m-card-interval')) {
                cards.each($.proxy(function(i, el) {
                    if ($(el).hasClass('start-card')) {
                        var area = $(el).position();
                        area.left = area.left + 100;
                        area.width = 200;
                        area.height = 200;
                        area.card = $(el);
                        areas.push(area);
                    }
                }, this));
            }
            return areas;
        }

        function activate(area, card) {
            var nextcard = this.getConnectedTo(area.card);

            this.addConnection(area.card, card);
            if (nextcard) {
                this.removeConnection(area.card, nextcard);
                this.addConnection(card, nextcard);
            }
        }

        return TimeDropInteraction;

    }
);
