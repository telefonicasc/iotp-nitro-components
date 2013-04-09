define(
  [
    'components/component_manager'
  ],

  function(ComponentManager) {

    return ComponentManager.create('CardSide', CardSide);

    function CardSide() {

      this.defaultAttrs({
        header: 'Card'
      });

      this.after('initialize', function() {
        if (this.attr.header) {
          this.$header = $('<div>').addClass('header').appendTo(this.$node);
          if (typeof this.attr.header === 'string') {
            $('<h1>').html(this.attr.header).appendTo(this.$header);
          }
        }
        this.$body = $('<div>').addClass('body').appendTo(this.$node);
      });
    }
  }
);
