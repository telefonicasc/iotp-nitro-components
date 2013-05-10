define(
    [
        'components/component_manager',
        'components/graph_editor',
        'components/card/card_toolbox',
        'components/card/card',
        'components/card/mixin/interactions',
        'components/card/mixin/and_interaction',
        'components/card/mixin/action_drop_interaction',
        'components/mixin/data_binding',
        'components/card/rule_editor_toolbar'
    ],

    function(ComponentManager, GraphEditor, CardToolbox,
            Card, Interactions, AndInteraction, ActionDropInteraction, 
            DataBinding, RuleEditorToolbar) {

        return ComponentManager.create('RuleEditor', RuleEditor,
                Interactions, AndInteraction, ActionDropInteraction);

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

                this.$graphContainer = $('<div>')
                        .addClass('rule-graph-container fit')
                        .appendTo(this.$mainArea);

                this.graphContainerX = 0;
                this.graphContainerY = 0;
                this.$graphContainer.on('mousedown', $.proxy(function(e) {
                    if ($(e.target).hasClass('node-container') ||
                        $(e.target).hasClass('rule-graph-container')) {
                        this.panning = true;
                        this.panningX = e.pageX;
                        this.panningY = e.pageY;
                    }
                }, this));

                this.$graphContainer.on('mouseup', $.proxy(function(e) {
                    this.panning = false;
                }, this));

                this.$graphContainer.on('mousemove', $.proxy(function(e) {
                    if (this.panning) {
                        this.graphContainerX += e.pageX - this.panningX;
                        this.graphContainerY += e.pageY - this.panningY;
                        this.$graphContainer.css({
                            marginLeft: this.graphContainerX,
                            marginTop: this.graphContainerY
                        });
                        this.panningX = e.pageX;
                        this.panningY = e.pageY;
                    }
                }, this));

                this.$topToolbar = $('<div>')
                    .addClass('rule-top-toolbar')
                    .prependTo(this.$node);

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

                this.$bottomToolbar.on('conditionsSelected',
                    $.proxy(function(e, o) {
                        this.$actionsToolbox.trigger('collapse');
                        this.$conditionsToolbox.trigger('expand');
                    }, this));

                this.$bottomToolbar.on('actionsSelected',
                    $.proxy(function(e, o) {
                        this.$conditionsToolbox.trigger('collapse');
                        this.$actionsToolbox.trigger('expand');
                    }, this));

                this.$graphEditor = $('<div>').addClass('fit')
                        .appendTo(this.$graphContainer);

                GraphEditor.attachTo(this.$graphEditor, {});

                this.$graphEditor.on('click', function(){
                    $(this).find('.card.flip').removeClass('flip');
                });

                this.$graphEditor.on('nodeAdded', $.proxy(function(e, o) {
                    var node = o.node,
                        placeholder;

                    if (node.hasClass('start-card') &&
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

                    this.updateValue();
                }, this));

                this.$graphEditor.on('nodeRemoved', $.proxy(function(e, o) {
                    this.updateValue();
                }, this));

                this.$graphEditor.on('connectionsChange',
                    $.proxy(function(e, o) {
                        this.connections = o.connections;
                        this.relayoutCards();
                    }, this));

                this.$conditionsToolbox = this.createCardToolbox(
                    this.attr.cards.conditions);
                this.$actionsToolbox = this.createCardToolbox(
                    this.attr.cards.actions);

                this.on('optionsChange', function(e, o) {
                    if (e.target === this.node) {
                        this.$conditionsToolbox.trigger('optionsChange', {
                            cardSections: {
                                cards: o.cards.conditions || []
                            }
                        });
                        this.$actionsToolbox.trigger('optionsChange', {
                            cardSections: {
                                cards: o.cards.actions
                            }
                        });
                    }
                });

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

                this.on('newRule', function() {
                    this.newRule();
                });

                this.on('valueChange', function(e, o) {
                    if (e.target === this.node &&
                        !o.ruleEngineUpdate) {
                        this.disableChangeEvent = true;
                        this.loadRuleData(o.value);
                        this.disableChangeEvent = false;
                    }
                });

                this.trigger('newRule');
            });

            this.relayoutCards = function() {
                if (!this.disableRelayout) {
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
                }
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
                var connectedFrom = $([]);
                $.each(this.connections, function(i, connection) {
                    if (connection.end.is(card)) {
                        connectedFrom = connectedFrom.add(connection.start);
                    }
                });
                return connectedFrom;
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

            this.loadRuleData = function(data) {
                var nodes = [];

                if (!data) return;

                this.emptyRule();

                // Add cards
                $.each(data.cards, $.proxy(function(i, card) {
                    var cardEl = $('<div>').attr('id', card.id);
                    Card.attachTo(cardEl, $.extend({}, card.configData));
                    this.$graphEditor.trigger('addNode', { node: cardEl });
                }, this));

                // Add connections
                $.each(data.cards, $.proxy(function(i, card) {
                    $.each(card.connectedTo, $.proxy(function(i, otherID) {
                        var cardEl = this.getCard(card.id),
                            otherEl = this.getCard(otherID);
                        this.addConnection(cardEl, otherEl);
                    }, this));
                }, this));
            };

            this.getRuleData = function() {
                var ruleData = [],
                    cards = this.$graphEditor.find('.node-container > *'); 

                $.each(cards, $.proxy(function(i, card) {
                    if (!$(card).hasClass('start-card')) {
                        ruleData.push($(card).data('cardConfig'));
                    }
                }, this));

                return ruleData;
            };

            this.updateValue = function() {
                if (!this.disableChangeEvent) {
                    this.trigger('valueChange', { 
                        value: this.getRuleData(),
                        ruleEngineUpdate: true
                    });
                }
            };

            this.getCard = function(cardId) {
                return this.$graphEditor.find('#' + cardId);
            };

            this.newRule = function() {
                this.emptyRule();        
                this.$startCard = $('<div>').addClass('start-card');
                this.$graphEditor.trigger('addNode', { node: this.$startCard });
            };

            this.emptyRule = function() {
                var cards = this.$graphEditor.find('.node-container > *');

                $.each(this.connections, $.proxy(function(i, connection) {
                    if (connection) {
                       this.$graphEditor.trigger('removeConnection', connection);  
                    }
                }, this));
                this.connections = [];

                cards.each($.proxy(function(i, el) {
                    this.$graphEditor.trigger('removeNode', { node: $(el) }); 
                }, this));
            };

            this.createCardToolbox = function(cards) {
                var cardToolbox = $('<div>').appendTo(this.$mainArea);
                CardToolbox.attachTo(cardToolbox, {
                    cardSections: {
                        cards: cards  
                    },
                    pushPanel: this.$graphEditor
                });

                cardToolbox.on('drag', '.card', $.proxy(function(e, ui) {
                    var position = {},
                        componentOffset = this.$graphEditor.position(),
                        helperOffset = $(ui.helper).position();

                    position.left = helperOffset.left - componentOffset.left -
                            this.graphContainerX;
                    position.top = helperOffset.top - componentOffset.top -
                            this.graphContainerY;

                    $(ui.helper).data(position);
                    this.$graphEditor.trigger('updateConnections');
                }, this));

                cardToolbox.trigger('collapse');            

                return cardToolbox;
            };
        }
    }
);
