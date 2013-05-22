define(
    [
        'components/component_manager',
        'components/graph_editor',
        'components/card/card_toolbox',
        'components/card/card',
        'components/card/card_data',
        'components/card/mixin/interactions',
        'components/card/mixin/and_interaction',
        'components/card/mixin/action_drop_interaction',
        'components/mixin/data_binding',
        'components/card/rule_editor_toolbar',
        'components/card/delimiter'
    ],

    function(ComponentManager, GraphEditor, CardToolbox,
            Card, CardData, Interactions, AndInteraction, ActionDropInteraction,
            DataBinding, RuleEditorToolbar, Delimiter) {

        return ComponentManager.create('RuleEditor', RuleEditor,
                Interactions, AndInteraction, ActionDropInteraction);

        function RuleEditor() {

            this.defaultAttrs({
                cards: {},
                value: { cards: [] },
                cardDefaults: {
                    component: 'Card'
                }
            });

            this.after('initialize', function() {
                this.connections = [];
                this.value = this.attr.value;

                this.$node.addClass('m2m-rule-editor');

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
                        this.$actionsToolbox.trigger('collapse', {
                            complete: $.proxy(function() {
                                this.$conditionsToolbox.trigger('expand');
                            }, this)
                        });
                    }, this));

                this.$bottomToolbar.on('actionsSelected',
                    $.proxy(function(e, o) {
                        this.$conditionsToolbox.trigger('collapse', {
                            complete: $.proxy(function() {
                                this.$actionsToolbox.trigger('expand');
                            }, this)
                        });
                    }, this));

                this.$graphEditor = $('<div>').addClass('fit')
                        .appendTo(this.$graphContainer);

                GraphEditor.attachTo(this.$graphEditor, {});

                this.$graphEditor.on('click', function(){
                    $(this).find('.card.flip').each(function() {
                        $(this).removeClass('flip');
                        $(this).trigger('flipped');
                    });
                });

                this.$graphEditor.on('nodeAdded', $.proxy(function(e, o) {
                    var node = o.node,
                        placeholder,
                        delimiter;

                    if (o.addPlaceholder !== false &&
                        node.hasClass('start-card') &&
                        !this.getConnectedTo(node).length) {
                        placeholder = $('<div>');
                        placeholder.addClass('card-placeholder action-card');
                        this.$graphEditor.trigger('addNode', {
                            node: placeholder
                        });
                        this.$graphEditor.trigger('addConnection', {
                            start: node,
                            end: placeholder
                        });
                    }

                    if (node.hasClass('m2m-card-condition')) {
                        delimiter = $('<div>').appendTo(
                            this.$graphEditor.find('.node-container'));
                        Delimiter.attachTo(delimiter);
                    }

                    node.data('delimiter', delimiter);

                    this.updateValue();
                }, this));

                this.$graphEditor.on('moved', '.card', $.proxy(function(e, o) {
                    var el = $(e.target),
                        delimiter = el.data('delimiter'),
                        position = el.position();
                    
                    if (delimiter) {
                        delimiter.css({
                            left: position.left,
                            top: position.top
                        });
                    }
                }, this));

                this.$graphEditor.on('flipped', '.card', $.proxy(function(e, o){
                    var delimiter = $(e.target).data('delimiter'); 
                    if (delimiter) {
                        if ($(e.target).hasClass('flip')) {
                            delimiter.fadeOut();
                        } else {
                            delimiter.fadeIn();
                        }
                    }
                }, this));

                this.$graphEditor.on('nodeRemoved', $.proxy(function(e, o) {
                    this.updateValue();
                }, this));

                this.$graphEditor.on('valueChange', '.card', $.proxy(function() {
                    this.updateValue();
                }, this));

                this.$graphEditor.on('connectionsChange',
                    $.proxy(function(e, o) {
                        this.connections = o.connections;
                        this.relayoutCards();
                    }, this));
                //===========================
                this.$conditionsToolbox = this.createCardToolbox(
                    this.attr.cards.conditions);
                this.$actionsToolbox = this.createCardToolbox(
                    this.attr.cards.actions);

                this.on('optionsChange', function(e, o) {
                    if (e.target === this.node) {
                        if (o.cards.conditions) {
                            this.loadToolboxCards(this.$conditionsToolbox,
                                o.cards.conditions.cards || []);
                        }
                        if (o.cards.actions) {
                            this.loadToolboxCards(this.$actionsToolbox,
                                o.cards.actions.cards || []);
                        }
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
                        if(o.value){
                            this.loadRuleData(o.value);
                        }
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
                return $('.node-container > .card, ' + 
                        '.node-container > .start-card, ' +
                        '.node-container > .card-placeholder', this.$graphEditor);
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
                    start: start,
                    end: end
                });
            };

            this.removeConnection = function(start, end) {
                this.$graphEditor.trigger('removeConnection', {
                    start: start,
                    end: end
                });

            };

            this.loadToolboxCards = function(toolbox, cards) {
                var parsedCards = [];
                $.each(cards, $.proxy(function(i, card) {
                    var data = CardData.encode(card);
                    parsedCards.push($.extend({},
                        this.attr.cardDefaults, data));
                }, this));

                toolbox.trigger('optionsChange', {
                    cardSections: {
                        section: { cards: parsedCards }
                    }
                });
            };

            this.loadRuleData = function(data) {
                var nodes = [];

                this.emptyRule();

                this._rawData = $.extend({}, data);
                // Add cards
                $.each(data.cards, $.proxy(function(i, card) {
                    var cardEl = $('<div>')
                        .attr('id', card.id)
                        .data('cardConfig', $.extend({}, card) );
                    var data = CardData.encode(card);
                    var attrCard = $.extend({}, this.attr.cardDefaults, data);
                    var cardCmp = ComponentManager.get(attrCard.component);
                    var node = {
                        'node': cardEl
                    };
                    cardCmp.attachTo(cardEl, data);
                    this.$graphEditor.trigger('addNode', node);
                }, this));

                // Add connections
                $.each(data.cards, $.proxy(function(i, card) {
                    $.each(card.connectedTo, $.proxy(function(i, otherID) {
                        var cardEl = this.getCard(card.id),
                            otherEl = this.getCard(otherID);
                        this.addConnection(cardEl, otherEl);
                    }, this));
                }, this));

                var topCards = this.getTopCards();
                this.$startCard = $('<div>').addClass('start-card');
                this.$graphEditor.trigger('addNode', { 
                    node: this.$startCard,
                    draggable: false,
                    addPlaceholder: false
                });
                $.each(topCards, $.proxy(function(i, card) {
                    this.addConnection(this.$startCard, $(card));
                }, this));
            };

            this.getRuleData = function() {
                var cardsData = [],
                    cards = this.$graphEditor.find('.node-container > .card'),
                    data = this._rawData || {'cards':[]};

                $.each(cards, $.proxy(function(i, card) {
                    var cardConfig;
                    var cardValue;
                    if (!$(card).hasClass('start-card')) {
                        cardConfig = $(card).data('cardConfig');
                        cardValue = $(card).data('cardValue');
                        if(cardConfig && cardValue){
                            cardConfig = CardData.decode(cardConfig, cardValue);
                        }
                        if(cardConfig){
                            cardsData.push(cardConfig);
                        }else{
                            throw 'RuleEditor :: "cardConfig" in Card is undefined';
                        }
                    }
                }, this));

                //@TODO añadir el valor del titulo en caso de implementar esta funcionalidad
                //data.name = "";
                data.cards = cardsData;

                return data;
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
                this.$graphEditor.trigger('addNode', { 
                    node: this.$startCard,
                    draggable: false
                });
                this.relayoutCards();
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
                    containment: this.$mainArea,
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
