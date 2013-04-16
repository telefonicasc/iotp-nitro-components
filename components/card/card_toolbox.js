define(
  [
    'components/component_manager',
    'components/panel/border_collapsable_panel',
    'components/card/card',
    'components/draggable',
    'components/radio_button'
  ],

  function(ComponentManager, BorderCollapsablePanel, Card, Draggable, RadioButton) {

    var cardType = {
      CONDITION:'conditions',
      ACTION:'actions'
    };

    var classForCardByType = {
      CONDITION:'m2m-card-condition',
      ACTION:'m2m-card-action'
    };

    var getClassByType = function(type){
      var className = '';
      if(type === cardType.ACTION){
        className = classForCardByType.ACTION;
      }else if(type === cardType.CONDITION){
        className = classForCardByType.CONDITION;
      }
      return className;
    };

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

        this.$cardSectionSwitch = $('<div>');

        $.each(this.attr.cardSections, $.proxy(function(key, section) {
          var classForCardByType = getClassByType(key);

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
              .addClass( classForCardByType )
              .appendTo(section.el);
            Card.attachTo(cardEl, $.extend({}, this.attr.cardDefaults, card));
            Draggable.attachTo(cardEl, {
              helper: function() {
                var newCardEl = $('<div>');
                Card.attachTo(newCardEl, card);
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
