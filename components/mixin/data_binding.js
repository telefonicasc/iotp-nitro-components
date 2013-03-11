define(
  [],

  function() {
    
    return DataBinding;

    function DataBinding() {
      
      this.defaultAttrs({
        model: ''
      });

      this.after('initialize', function() {
        
        this.$node.attr('data-bind', this.attr.model);

        this.on('changeData', function(e, attr, value) {
          if (attr === 'value') {
            this.trigger('valueChange', { value: value });
          }
        });

        this.on('valueChange', function(e, o) {         
          var value = o.value
            , nestedDatabinds = this.$node.find('[data-bind] [data-bind]');

          this.$node.find('[data-bind]')
            .not(nestedDatabinds).each(function() {
            var field = $(this).data('bind');
            $(this).trigger('valueChange', { value: value, silent: true });
          });

          if (o.silent) {
            e.stopPropagation();
          }
        });
      });
    }
  }
);

