define(
  [
    'components/component_manager',
    'components/panel/border_collapsable_panel',
    'components/card/card',
    'components/draggable',
    'components/radio_button'
  ],

  function(ComponentManager, BorderCollapsablePanel, Card, Draggable, RadioButton) {

    return ComponentManager.extend(BorderCollapsablePanel,
        'CardToolbox', CardToolbox);

    function CardToolbox() {

      this.defaultAttrs({
        cardDefaults: {
          flippable: false,
          component:'Card'
        }
      });

      this.after('initialize', function() {

        this.$node.addClass('card-toolbox');

        this.$cardSectionSwitch = $('<div>');

        $.each(this.attr.cardSections, $.proxy(function(key, section) {
          section.el = $('<div>')
            .addClass('card-toolbox-section')
            .appendTo(this.$content);

          section.button = $('<input>')
            .attr({ 'type': 'radio', 'name': key })
            .data('label', section.label);
          this.$cardSectionSwitch.append(section.button);
          $.each(section.cards, $.proxy(function(i, card) {
            var cardEl = $('<div>')
              .addClass('preview')
              .appendTo(section.el);
            var attrCard = $.extend({}, this.attr.cardDefaults, card);
            var cmp  = ComponentManager.get(attrCard.component);
            cmp.attachTo(cardEl, attrCard);
            Draggable.attachTo(cardEl, {
              helper: function() {
                var newCardEl = $('<div>');
                cmp.attachTo(newCardEl, card);
                return newCardEl;
              }
            });
          }, this));
        }, this));

        this.$content.prepend(this.$cardSectionSwitch);
        RadioButton.attachTo(this.$cardSectionSwitch, {});

        this.$cardSectionSwitch.on('selected', $.proxy(function(e, o) {
          var section = this.attr.cardSections[o.name];
          this.$node.find('.card-toolbox-section').css('visibility', 'hidden');
          section.el.css('visibility', 'visible');
        }, this));
      });
    }
  }
);
