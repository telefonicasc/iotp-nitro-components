define(
    [],

    function() {

        return AndInteraction;

        function AndInteraction() {
            this.after('initialize', function() {
                this.registerInteraction({
                    getAreas: getAreas,
                    activate: activate
                });
            });
        }

        function getAreas(cards) {
            var areas = [];
            cards.each($.proxy(function(i, el) {
                var area = $(el).position();
                area.card = $(el);
                areas.push(area);
            }, this));
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
    }
);
