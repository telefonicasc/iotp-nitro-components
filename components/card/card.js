define(
  [
    'components/component_manager',
    'components/mixin/template',
    'components/flippable',
    'components/card/card_side'
  ],
  function(ComponentManager, Template, Flippable, CardSide) {

    return ComponentManager.create('card', Template, Card);

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
