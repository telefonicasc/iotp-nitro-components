define(
  [
    'components/component_manager',
    'components/graph_editor',
    'components/card/card_toolbox',
    'components/card/card'
  ],

  function(ComponentManager, GraphEditor, CardToolbox, Card) {

    return ComponentManager.create('RuleEditor', RuleEditor);

    function RuleEditor() {

      this.defaultAttrs({
        cardSections: {
          conditions: {
            label: 'Conditions',
            cards: [{
            }, {
            }]
          }
        }
      });

      this.after('initialize', function() {

        this.$graphEditor = $('<div>').addClass('fit').appendTo(this.$node);
        GraphEditor.attachTo(this.$graphEditor, {});

        this.$graphEditor.on('nodeAdded', $.proxy(function(e, o) {
          var node = o.node,
              placeholder = $('<div>').addClass('card-placeholder action-card');

          if (!node.hasClass('card-placeholder')) {
            this.$graphEditor.trigger('addNode', { node: placeholder });
            this.$graphEditor.trigger('addConnection', {
              start: node, end: placeholder
            });
          }
        }, this));

        this.$graphEditor.on('connectionAdded', $.proxy(function(e, o) {
          this.relayoutCards(o.connections);
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

      this.relayoutCards = function(connections) {
        var topCards = this.getTopCards(connections);
        console.log('topCards', topCards);
      };

      this.getTopCards = function(connections) {
        var topCards = $('.node-container', this.$graphEditor).children();
        $.each(connections, function(i, connection) {
          topCards = topCards.not(connection.end);
        });
        return topCards;
      };
    }
  }
);
