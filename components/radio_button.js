define(
  [
    'components/component_manager'
  ],
  function(ComponentManager) {

    return ComponentManager.create('RadioButton', RadioButton);

    function RadioButton() {
    
      this.after('initialize', function() {
        var inputs = this.$node.find('input');

        this.$node.addClass('button-set');

        inputs.each($.proxy(function(i, inputEl) {
          var buttonEl = $('<div>')
            .html($(inputEl).data('label'))
            .addClass('button')
            .insertAfter(inputEl);

          if (i === 0) {
            buttonEl.addClass('first'); 
          } 
          
          if (i === inputs.length - 1) {
            buttonEl.addClass('last');
          }

          $(inputEl).hide();

          buttonEl.on('click', $.proxy(function() {
            this.$node.find('.button').removeClass('active');
            this.trigger('selected', { name: $(inputEl).attr('name') });             
            buttonEl.addClass('active');
          }, this));
        }, this));
      });
    }
  }
);
