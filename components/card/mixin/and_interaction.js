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

        function getAreas(cards, draggingCard) {
            var areas = [];
            var hasCardInterval = _hasTimeInterval(cards);
            if (draggingCard.hasClass('m2m-card-condition')) {
                cards.each($.proxy(function(i, el) {
                    var isValidLeftCard = hasCardInterval ? $(el).hasClass('m2m-card-interval') : $(el).hasClass('start-card');
                    if ($(el).hasClass('m2m-card-condition') || isValidLeftCard ){
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

        function _hasTimeInterval(cards){
            var out=false;
            for(var i=cards.length;i--;){
                if(out = $(cards[i]).hasClass('m2m-card-interval') ){
                    break;
                }
            }
            return out;
        }
    }
);
