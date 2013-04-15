define(
    [
        'components/component_manager',
        'components/graph_editor',
        'components/card/card_toolbox',
        'components/card/card',
        'components/card/mixin/interactions',
        'components/card/mixin/and_interaction',
        'components/mixin/data_binding'
    ],

    function(ComponentManager, GraphEditor, CardToolbox,
            Card, Interactions, AndInteraction, DataBinding) {

        return ComponentManager.create('RuleEditor', RuleEditor,
                Interactions, AndInteraction);

        function RuleEditor() {

            this.defaultAttrs({
                cards: {}
            });

            this.after('initialize', function() {

                this.$graphEditor = $('<div>').addClass('fit')
                        .appendTo(this.$node);

                GraphEditor.attachTo(this.$graphEditor, {});

                this.$graphEditor.on('nodeAdded', $.proxy(function(e, o) {
                    var node = o.node,
                        placeholder = $('<div>');

                    placeholder.addClass('card-placeholder action-card');

                    if (!node.hasClass('card-placeholder')) {
                        this.$graphEditor.trigger('addNode', {
                            node: placeholder
                        });
                        this.$graphEditor.trigger('addConnection', {
                            start: node, end: placeholder
                        });
                    }
                }, this));

                this.$graphEditor.on('connectionAdded', $.proxy(function(e, o) {
                    this.connections = o.connections;
                    this.relayoutCards();
                }, this));

                this.$cardToolbox = $('<div>').appendTo(this.$node);
                CardToolbox.attachTo(this.$cardToolbox, {
                    cardSections: this.attr.cards
                });

                this.$cardToolbox.on('drag', '.card', $.proxy(function(e, ui) {
                    var position = {},
                        componentOffset = this.$node.offset(),
                        helperOffset = $(ui.helper).offset();
                    position.left = helperOffset.left - componentOffset.left;
                    position.top = helperOffset.top - componentOffset.top;
                    $(ui.helper).data(position);
                    this.$graphEditor.trigger('updateConnections');
                }, this));

                this.$graphEditor.droppable({
                    accept: '.card.preview',
                    drop: $.proxy(function(e, ui) {
                        var newCard = $('<div>');
                        Card.attachTo(newCard, {});
                        this.$graphEditor.trigger('addNode', { node: newCard });
                    }, this)
                });

                this.$startCard = $('<div>').addClass('start-card');
                this.$graphEditor.trigger('addNode', { node: this.$startCard });

                this.on('valueChange', function(e, o) {
                    console.log('adasdas', o.value);
                });
            });

            this.relayoutCards = function() {
                console.log('Relayout cards');
                var cards = this.getAllCards(),
                        colWidth = 300,
                        height = this.$graphEditor.height();

                this.calculatePositions();

                cards.each(function(i) {
                    var el = $(this);
                    el.trigger('move', {
                        left: (el.data('col') + (el.data('colwidth') / 2)) *
                            colWidth,
                        top: (el.data('row') + 0.5) * height
                    });
                });
            };

            this.calculatePositions = function(parentCard) {
                var cards;

                if (parentCard) {
                    cards = this.getConnectedTo(parentCard);
                } else {
                    cards = this.getTopCards();
                }

                cards.each($.proxy(function(i, el) {
                    var col;

                    if (parentCard) {
                        col = parentCard.data('col') + 1;
                    } else {
                        col = 0;
                    }

                    $(el).data('row', i);
                    $(el).data('rowheight', 1 / cards.length);
                    $(el).data('col', col);
                    $(el).data('colwidth', 1);

                    this.calculatePositions($(el));
                }, this));
            };

            this.getAllCards = function() {
                return $('.node-container', this.$graphEditor).children();
            };

            this.getTopCards = function() {
                var topCards = this.getAllCards();
                $.each(this.connections, function(i, connection) {
                    topCards = topCards.not(connection.end);
                });
                return topCards;
            };

            this.getConnectedTo = function(card) {
                var connectedTo = $([]);
                $.each(this.connections, function(i, connection) {
                    if (connection.start.is(card)) {
                        connectedTo = connectedTo.add(connection.end);
                    }
                });
                return connectedTo;
            };

            this.getConnectedFrom = function(card) {

            };

            this.addConnection = function(start, end) {
                this.$graphEditor.trigger('addConnection', {
                    start: start, end: end
                });
            };

            this.removeConnection = function(start, end) {
                this.$graphEditor.trigger('removeConnection', {
                    start: start, end: end
                });

            };
        }
    }
);
