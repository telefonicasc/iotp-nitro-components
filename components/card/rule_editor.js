define(
  [
    'components/component_manager',
    'components/graph_editor',
    'components/card/card_toolbox',
    'components/card/card',
    'components/card/mixin/and_interaction'
  ],

  function(ComponentManager, GraphEditor, CardToolbox, Card, AndInteraction) {
    
    return ComponentManager.create('RuleEditor', RuleEditor, AndInteraction);
    
    function RuleEditor() {

      this.defaultAttrs({
        cardSections: {
          conditions: {
            label: 'Conditions',
            cards: [{
            }, {
            }]
          }
        },
      });

      this.after('initialize', function() {
      
        this.$graphEditor = $('<div>').addClass('fit').appendTo(this.$node);
        GraphEditor.attachTo(this.$graphEditor, {});

        this.$graphEditor.on('nodeAdded', $.proxy(function(e, o) {
          var node = o.node
            , placeholder = $('<div>').addClass('card-placeholder action-card');

          if (!node.hasClass('card-placeholder')) {            
            this.$graphEditor.trigger('addNode', { node: placeholder });
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
          cardSections: this.attr.cardSections
        });

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
      });

      this.relayoutCards = function() {
        var cards = this.getAllCards()
          , colWidth = 300
          , height = this.$graphEditor.height();

        this.calculatePositions();

        cards.each(function(i) {
          var el = $(this);
          el.trigger('move', {
            left: (el.data('col') + (el.data('colwidth') / 2)) * colWidth,
            top: (el.data('row')+0.5) * height
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
          $(el).data('rowheight', 1/cards.length);
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
    }
  }
);
