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
        'components/card/mixin/time_drop_interaction',
        'components/mixin/data_binding',
        'components/card/rule_editor_toolbar',
        'components/card/delimiter'
    ],

    function(ComponentManager, GraphEditor, CardToolbox,
            Card, CardData, Interactions, AndInteraction, ActionDropInteraction,TimeDropInteraction,
            DataBinding, RuleEditorToolbar, Delimiter) {

        return ComponentManager.create('RuleEditor', RuleEditor,
                Interactions, AndInteraction, ActionDropInteraction, TimeDropInteraction);

        function RuleEditor() {

            this.defaultAttrs({
                cards: {},
                value: {
                    rule:{
                        cards: []
                    },
                    isValid: true
                },
                cardDefaults: {
                    component: 'Card'
                },
                actionsLabel: 'Actions',
                conditionsLabel: 'Conditions',
                delimiterLabels: {
                    'EQUAL_TO': 'IS',
                    'DIFFERENT_TO': 'IS NOT',
                    'MINOR_THAN': 'BELOW',
                    'GREATER_THAN': 'ABOVE',
                    'IS_OFF': 'IS_OFF',
                    'IS_ON': 'IS_ON'
                },
                locales: {
                    Card:{
                        'subject': 'Subject',
                        'to': 'To',
                        'sensor_name': 'Condition'
                    },
                    CardData:{
                        'true': 'True',
                        'false': 'False',
                        'value': 'Value'
                    }
                },
                editable: true,
                ruleValidator : function(ruleData){
                    return true;
                }
            });

            this.after('initialize', function() {
                CardData.addLocales(this.attr.locales.CardData);

                this.connections = [];
                this.value = this.attr.value;
                this.editable = this.attr.editable;

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

                RuleEditorToolbar.attachTo(this.$bottomToolbar, {
                    actionsLabel: this.attr.actionsLabel,
                    conditionsLabel: this.attr.conditionsLabel
                });

                this.$bottomToolbar.on('zoomChange', $.proxy(function(e, o) {
                    var zoomLevel = o.zoomLevel;
                    this.$graphEditor.css({
                        '-webkit-transform': 'scale(' +
                            (parseFloat(zoomLevel) / 100) + ')'
                    });
                }, this));

                this.$bottomToolbar.on('conditionsSelected',
                    $.proxy(function(e, o) {
                        var isVisible = this.$conditionsToolbox.is(':visible');
                        if(isVisible){
                            this.$conditionsToolbox.trigger('collapse');
                        }else{
                            this.$actionsToolbox.trigger('collapse', {
                                complete: $.proxy(function() {
                                    this.$conditionsToolbox.trigger('expand');
                                    $(window).trigger('resize');
                                }, this)
                            });
                        }


                    }, this));

                this.$bottomToolbar.on('actionsSelected',
                    $.proxy(function(e, o) {
                        var isVisible = this.$actionsToolbox.is(':visible');
                        if(isVisible){
                            this.$actionsToolbox.trigger('collapse');
                        }else{
                            this.$conditionsToolbox.trigger('collapse', {
                                complete: $.proxy(function() {
                                    this.$actionsToolbox.trigger('expand');
                                }, this)
                            });
                        }
                    }, this));

                this.$graphEditor = $('<div>').addClass('fit')
                        .appendTo(this.$graphContainer);

                GraphEditor.attachTo(this.$graphEditor, {});

                $('body').on('click', function(){
                    $(this).find('.card.flip').each(function() {
                        $(this).removeClass('flip');
                        $(this).trigger('flipped');
                    });
                });

                this.$graphEditor.on('nodeAdded', $.proxy(function(e, o) {
                    var node = o.node,
                        placeholder,
                        delimiter;

                    if (node.hasClass('m2m-card-condition')) {
                        delimiter = $('<div>').appendTo(
                            this.$graphEditor.find('.node-container'));
                        delimiter.on('valueChange', $.proxy(function(){
                            this.updateValue();
                        }, this));
                        Delimiter.attachTo(delimiter, $.extend({
                            delimiterLabels: this.attr.delimiterLabels
                        }, o));
                        delimiter.data('editable', this.editable);
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
                    var delimiter = $(o.node).data('delimiter');
                    if (delimiter) {
                        delimiter.remove();
                    }
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
                    var cards;
                    if (e.target === this.node) {
                        if (o.cards) {
                            if (o.cards.conditions) {
                                cards = o.cards.conditions.cards || [];
                                cards.unshift( _makeCardNoSensorSignal(cards) );
                                this.attr.cards.conditions = cards;

                                this.loadToolboxCards(this.$conditionsToolbox, cards);
                            }
                            if (o.cards.actions) {
                                cards = o.cards.actions.cards || [];
                                this.attr.cards.actions = cards;
                                this.loadToolboxCards(this.$actionsToolbox, cards);

                            }
                        }
                        if (o.editable !== undefined) {
                            this.editable = o.editable;
                            this.getAllCards().data('editable', o.editable);
                            $('.m2m-card-delimiter', this.$graphEditor)
                                .data('editable', o.editable);
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

                this.on('relayoutCards', function() {
                    this.relayoutCards();
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
                        if (!el.data('dragging')) {
                            el.trigger('move', {
                                left: (el.data('col') +
                                    (el.data('colwidth') / 2)) * colWidth,
                                top: (el.data('row') + 0.5) * height,
                                animated: false
                            });
                        }
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
                var topCards = this.getAllCards(),
                    detached = $([]);
                $.each(this.connections, function(i, connection) {
                    topCards = topCards.not(connection.end);
                });
                $.each(topCards, function(i, card) {
                    if ($(card).data('detached')) {
                        detached = detached.add(card);
                    }
                });
                topCards = topCards.not(detached);
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

            this.getConnectedToId = function(card){
                var connections = this.getConnectedTo(card);
                var ids = [];
                $.each(connections, function(i,connection){
                    var id = $(connection).attr('id');
                    if(id) ids.push(id);
                });
                return ids;
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

            // TODO: This only work for one parent one child
            this.detachCard = function(card) {
                var from = this.getConnectedFrom(card)[0],
                    to = this.getConnectedTo(card)[0];

                card.data('detached', true);
                this.disableRelayout = true;
                if (from) {
                    if (to) {
                        this.addConnection($(from), $(to));
                    }
                    this.removeConnection(from, card);
                }

                if (to) {
                    this.removeConnection(card, to);
                }else{
                    this.addPlaceholderToCard( $(from) );
                }
                this.disableRelayout = false;
                this.relayoutCards();
            };

            this.loadToolboxCards = function(toolbox, cards) {
                var parsedCards = [];
                $.each(cards, $.proxy(function(i, card) {
                    // If card is a threshold card, put phenomenons in configData parameter
                   if(card.sensorCardType && card.sensorCardType === 'threshold'){
                       var phenomenons = _getPhenomenons(cards);
                       card.configData = phenomenons;
                    }

                    var cardConfig = $.extend({}, card);
                    var data = CardData.encode(card);
                    // esta variable es importante porque se usa en card_toolbox.js para asignar
                    // el valor devuelto por servidor
                    data['__cardConfig'] = cardConfig;
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
                var rule = data.rule;

                this.emptyRule();

                this._rawData = $.extend({}, rule);
                // Add cards
                $.each(rule.cards, $.proxy(function(i, card) {
                    var cardConfig = $.extend({}, card);
                    var cardEl = $('<div>').data('cardConfig', cardConfig );
                    // If card is a threshold card, put phenomenons in configData parameter
                    var parameterValue = (cardConfig.conditionList && cardConfig.conditionList[0] && cardConfig.conditionList[0].parameterValue) ? cardConfig.conditionList[0].parameterValue : "";
                    var patt = /^\$/g;
                    if(patt.test(parameterValue)){
                        var phenomenons = _getPhenomenons(this.attr.cards.conditions);
                        card['configData'] = phenomenons;
                    }

                    if( card.model === 'NoSensorSignal' ){
                        card.value = card.sensorData;
                        card.configData =  _getPhenomenonList(this.attr.cards.conditions);
                    }

                    var data = CardData.encode(card);

                    var attrCard = $.extend({}, this.attr.cardDefaults, data);
                    var cardCmp = ComponentManager.get(attrCard.component);
                    var node = {
                        'node': cardEl,
                        'cardConfig': cardConfig
                    };
                    data.locales = this.attr.locales.Card;
                    cardCmp.attachTo(cardEl, data);
                    cardEl.data('editable', this.editable);
                    this.$graphEditor.trigger('addNode', node);
                }, this));

                // Add connections
                $.each(rule.cards, $.proxy(function(i, card) {
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
                $(window).trigger('resize');
            };

            this.getRuleData = function() {
                var cardsData = [],
                    cards = this.$graphEditor.find('.node-container > .card'),
                    data = this._rawData || {'cards':[]};

                $.each(cards, $.proxy(function(i, card) {
                    var cardConfig;
                    var cardValue;
                    var elementId;
                    var delimiter;
                    var conditionList;
                    if (!$(card).hasClass('start-card')) {
                        cardConfig = $(card).data('cardConfig');
                        cardValue = $(card).data('cardValue');
                        elementId = $(card).attr('id');
                        delimiter = $(card).data('delimiter');
                        conditionList = $(card).data('conditionList');
                        if(cardConfig && (cardValue !== undefined) ){
                            cardConfig = CardData.decode(cardConfig, cardValue);
                        }
                        if(cardConfig){
                            cardConfig.connectedTo = this.getConnectedToId(card);
                            cardConfig.id = elementId;
                            if( $.isArray(conditionList) ){
                                cardConfig.conditionList = conditionList;
                            }
                            cardsData.push(cardConfig);
                        }else{
                            throw 'RuleEditor :: "cardConfig" in Card is undefined';
                        }
                    }
                }, this));
                cardsData = _setScopeInSensorCards(cardsData);
                cardsData.sort(_orderCards);

                //@TODO añadir el valor del titulo en caso de implementar esta funcionalidad
                //data.name = "";
                data.cards = cardsData;
                return data;
            };

            this.updateValue = function() {
                var ruleData;
                if (!this.disableChangeEvent) {
                    ruleData = this.getRuleData();
                    this.trigger('valueChange', {
                        value: {
                            'rule': ruleData,
                            'isValid': ( this.isValidCards() && this.attr.ruleValidator(ruleData) )
                        },
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
                this.addPlaceholderToCard(this.$startCard);
                this.relayoutCards();
            };

            this.emptyRule = function() {
                var cards = this.$graphEditor.find('.node-container > *');

                $.each($.extend([], this.connections),
                    $.proxy(function(i, connection) {
                    if (connection) {
                        this.$graphEditor.trigger('removeConnection', connection);
                    }
                }, this));
                this.connections = [];

                cards.each($.proxy(function(i, el) {
                    this.$graphEditor.trigger('removeGraphNode', { node: $(el) });
                }, this));
            };

            this.createCardToolbox = function(cards) {
                var cardToolbox = $('<div>').appendTo(this.$mainArea);
                CardToolbox.attachTo(cardToolbox, {
                    containment: this.$mainArea,
                    cardSections: {
                        cards: cards
                    },
                    pushPanel: this.$graphEditor,
                    locales: this.attr.locales
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

            this.addPlaceholderToCard = function(card){
                var placeHolderelement = _newPlaceholderElement();
                this.$graphEditor.trigger('addNode', {
                    node: placeHolderelement
                });
                this.$graphEditor.trigger('addConnection', {
                    start: card,
                    end: placeHolderelement
                });
            };

            this.isValidCards = function(){
                var cards = this.$graphEditor.find('.card');
                var values = [];
                for(var i = cards.length; i--;){
                    var isValid = $(cards[i]).data('isValid');
                    if(isValid === undefined){
                        isValid = true;
                    }
                    values.push(isValid ? '':'0');
                }
                return (values.join('').length === 0);
            };
        }

        function _newPlaceholderElement(){
            var placeholder = $('<div>').
                addClass('card-placeholder action-card');
            return placeholder;
        }

        function _makeCardNoSensorSignal(sensorCards){
            var data = {
                'id': '0',
                'type': 'SensorCard',
                'model': 'NoSensorSignal',
                'sensorData':{},
                'conditionList':[{
                       'scope':'LAST_MEASURE',
                       'not':false,
                       'operator':'GREATER_THAN',
                       'parameterValue':'${device.asset.UserProps.reportInterval}'
                    }],
                'configData': _getPhenomenonList(sensorCards)
            };
            return data;
        }

        function _getPhenomenonList(cards){
            var measureName;
            var emptyPhenomenon = { label: '', value: '' };
            var measureNames = [emptyPhenomenon];
            var unit;
            for(var n = cards.length;n--;){
                if (cards[n].type === "SensorCard" && cards[n].sensorData && cards[n].model !== 'NoSensorSignal') {
                    unit = (cards[n].sensorData.uom && cards[n].sensorData.uom !== "Unknown") ? ' (' + cards[n].sensorData.uom + ')': '';
                    measureName = cards[n].sensorData.measureName + unit;
                    measureNames.push( { label: measureName, value: cards[n].sensorData } );
                }
            }
            return measureNames;
        }

        // _getPhenomenons returns phenomenons with dataType quantity
        function _getPhenomenons(cards){
            var phenomenons = [];

            $.each(cards, function(i, card){
                if (card.type === 'SensorCard' && card.sensorData && card.sensorData.dataType === 'Quantity') {
                    phenomenons.push(card);
                }
            });

            return {phenomenons: phenomenons};
        }

        function _orderCards(a, b){
            var out = 0;
            if(b.type === 'TimeCard'){
                out = b.configData.timeType === 'timeInterval'?1:-1;
            }
            return out;
        }

        function _setScopeInSensorCards(cards){
            var hasTimeInterval = false;
            for(var i =cards.length; i--;){
                if( cards[i].timeData && cards[i].configData.timeType === 'timeInterval' ){
                    hasTimeInterval=true;
                    break;
                }
            }
            if(hasTimeInterval){
                $.each(cards, function(i, card){
                    card = _setScope(card, 'LAST_MEASURE');
                });
            }

            return cards;
        }
        function _setScope(card, scope){
            if( $.isArray(card.conditionList) ){
                $.each(card.conditionList, function(i, condition){
                    condition.scope = scope;
                });
            }
            return card;
        }
    }
);
