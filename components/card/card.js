define(
  [
    'components/component_manager',
    'components/mixin/template',
    'components/flippable' 
  ],
  function(ComponentManager, Template, Flippable) {
    
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
          tpl: '<div class="front"></div>'
        },
        back: {
          tpl: '<div class="back"></div>'
        }
      });

      this.after('initialize', function() {

        this.$node.addClass('card');

        if (this.attr.flippable) {
          Flippable.attachTo(this.node);
        }

      });
    }
  }
);
