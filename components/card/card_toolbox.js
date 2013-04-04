define(
  [
    'components/component_manager',
    'components/panel/border_collapsable_panel',
    'components/card/card'
  ],

  function(ComponentManager, BorderCollapsablePanel, Card) {

    return ComponentManager.extend(BorderCollapsablePanel, 
        'CardToolbox', CardToolbox);

    function CardToolbox() {
      
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

        var conditionCards = this.attr.cardSections.conditions.cards;

        $.each(conditionCards, $.proxy(function(i, card) {
          
          var cardEl = $('<div>').appendTo(this.$content);
          debugger;
          Card.attachTo(cardEl);
          
        }, this));

      });
    }
  }
);
