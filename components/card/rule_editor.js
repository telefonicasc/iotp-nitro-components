define(
    [
        'components/component_manager',
        'components/graph_editor',
        'components/card/card_toolbox',
        'components/card/card',
        'components/card/mixin/interactions',
        'components/card/mixin/and_interaction',
        'components/mixin/data_binding',
        'components/card/rule_editor_toolbar'
    ],

    function(ComponentManager, GraphEditor, CardToolbox,
            Card, Interactions, AndInteraction, DataBinding,
            RuleEditorToolbar) {

        return ComponentManager.create('RuleEditor', RuleEditor,
                Interactions, AndInteraction);

        function RuleEditor() {

            this.defaultAttrs({
                cards: {},
                value: { cards: [] }
            });

            this.after('initialize', function() {

                this.connections = [];
                this.value = this.attr.value;

                this.$mainArea = $('<div>').addClass('rule-editor-main fit')
                        .appendTo(this.$node);

                this.$bottomToolbar = $('<div>')
                        .appendTo(this.$node);

                RuleEditorToolbar.attachTo(this.$bottomToolbar);

                this.$bottomToolbar.on('zoomChange', $.proxy(function(e, o) {
                    var zoomLevel = o.zoomLevel;
                    this.$graphEditor.css({
                        '-webkit-transform': 'scale(' +
                            (parseFloat(zoomLevel) / 100) + ')'
                    });
                }, this));

                this.$graphEditor = $('<div>').addClass('fit')
                        .appendTo(this.$mainArea);

                GraphEditor.attachTo(this.$graphEditor, {});

                this.$graphEditor.on('click', function(){
                    $(this).find('.card.flip').removeClass('flip');
                });

                this.$graphEditor.on('nodeAdded', $.proxy(function(e, o) {
                    var node = o.node,
                        placeholder;

                    if (!node.hasClass('card-placeholder') &&
                        !this.getConnectedTo(node).length) {
                        placeholder = $('<div>');
                        placeholder.addClass('card-placeholder action-card');
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

                this.$cardToolbox = $('<div>').appendTo(this.$mainArea);
                CardToolbox.attachTo(this.$cardToolbox, {
                    cardSections: this.attr.cards,
                    pushPanel: this.$graphEditor
                });

                this.$cardToolbox.on('drag', '.card', $.proxy(function(e, ui) {
                    var position = {},
                        //componentOffset = this.$node.offset(),
                        componentOffset = this.$cardToolbox.position(),
                        helperOffset = $(ui.helper).position();
                    position.left = helperOffset.left + componentOffset.left;
                    position.top = helperOffset.top + componentOffset.top;

                    console.log(position.left, position.top);
                    $(ui.helper).data(position);
                    this.$graphEditor.trigger('updateConnections');
                }, this));

                this.$graphEditor.droppable({
                    accept: '.card.preview',
                    drop: $.proxy(function(e, ui) {
                        ui.draggable.data('draggable').cancelHelperRemoval = true;
                        this.$graphEditor.trigger('addNode', { node: ui.helper });
                        $(window).trigger('resize');
                        this.relayoutCards();
                    }, this)
                });

                this.$graphEditor.on('dragstop', $.proxy(function(e) {
                    this.relayoutCards();
                }, this));

                this.$startCard = $('<div>').addClass('start-card');
                this.$graphEditor.trigger('addNode', { node: this.$startCard });

                this.on('valueChange', function(e, o) {
                    //console.log('adasdas', o.value);
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
