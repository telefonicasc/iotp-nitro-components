define(
  [
    'components/component_manager',
    'components/panel/border_collapsable_panel',
    'components/card/card',
    'components/draggable'
  ],

  function(ComponentManager, BorderCollapsablePanel, Card, Draggable) {

    return ComponentManager.extend(BorderCollapsablePanel,
        'CardToolbox', CardToolbox);

    function CardToolbox() {

      this.defaultAttrs({
        cardDefaults: {
          flippable: false
        }
      });

      this.after('initialize', function() {

        this.$node.addClass('card-toolbox');

        $.each(this.attr.cardSections, $.proxy(function(key, section) {
          section.el = $('<div>').appendTo(this.$content);
          $.each(section.cards, $.proxy(function(i, card) {
            var cardEl = $('<div>').addClass('preview').appendTo(section.el);
            Card.attachTo(cardEl, $.extend({}, this.attr.cardDefaults, card));
            Draggable.attachTo(cardEl, { helper: 'clone' });
          }, this));
        }, this));
      });
    }
  }
);
