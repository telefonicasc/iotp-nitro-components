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
            if (draggingCard.hasClass('m2m-card-time')) {
                if (draggingCard.hasClass('m2m-card-interval')) {
                    cards.each($.proxy(function(i, el) {
                        if ($(el).hasClass('start-card')) {
                            areas.push(_makeArea($(el)));
                        }
                    }, this));
                }else if (draggingCard.hasClass('m2m-card-elapsed')) {
                    cards.each($.proxy(function(i, el) {
                        var $conection = this.getConnectedTo($(el));

                        if ($conection.hasClass('m2m-card-action') || $conection.hasClass('card-placeholder')) {
                            areas.push(_makeArea($(el)));
                        }
                    }, this));
                }
            }
            return areas;
        }

        function activate(area, card) {
            var methodname = $(card).hasClass('m2m-card-elapsed') ? 'getConnectedTo' : 'getConnectedTo';
            var nextcard = this[methodname](area.card);

            this.addConnection(area.card, card);
            if (nextcard) {
                this.removeConnection(area.card, nextcard);
                this.addConnection(card, nextcard);
            }
        }
        function _makeArea($ele) {
            var area = $ele.position();
            area.left = area.left + 100;
            area.width = 200;
            area.height = 200;
            area.card = $ele;
            return area;
        }

        return TimeDropInteraction;

    }
);
