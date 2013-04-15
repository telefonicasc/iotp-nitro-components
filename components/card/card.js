define(
  [
    'components/component_manager',
    'components/mixin/template',
    'components/flippable',
    'components/card/card_side',
    'components/mixin/data_binding'
  ],
  function(ComponentManager, Template, Flippable, CardSide, DataBinding) {

    return ComponentManager.create('card', Template, Card, DataBinding);

    function Card() {

      this.defaultAttrs({
        flippable: true,
        tpl: '<div class="front"></div>' +
             '<div class="back"></div>',
        nodes: {
          front: '.front',
          back: '.back'
        },
        front: {
        },
        back: {
        }
      });

      this.after('initialize', function() {

        this.$node.addClass('card');

        if (this.attr.header) {
            this.attr.front.header = this.attr.header;
            this.attr.back.header = this.attr.header;
        }

        CardSide.attachTo(this.$front, this.attr.front);
        CardSide.attachTo(this.$back, this.attr.back);

        if (this.attr.flippable) {
          Flippable.attachTo(this.node);
        }else {
          this.$back.hide();
        }
      });
    }
  }
);
