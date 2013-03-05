define(
  [],

  function() {
    
    return DataBinding;

    function DataBinding() {
      
      this.defaultAttrs({
        bindField: ''
      });

      this.after('initialize', function() {
        
        this.$node.attr('data-bind', this.attr.bindField);

        this.on('changeData', function(e, attr, value) {
          if (attr === 'value') {
            this.trigger('valueChange', { value: value });
            this.$node.find('[data-bind]')
              .not('[data-bind] > [data-bind]').each(function() {
              var field = $(this).data('bind');
              $(this).data('value', field ? value[field] : value);  
            });
          }
        });
      });
    }
  }
);

