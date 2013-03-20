define(
  [],

  function() {
    
    return DataBinding;

    function DataBinding() {
      
      this.defaultAttrs({
        model: ''
      });

      this.after('initialize', function() {
        
        this.$node.attr('data-bind', '');

        this.on('changeData', function(e, attr, value) {
          if (attr === 'value') {
            this.trigger('valueChange', { value: value });
          }
        });

        this.on('parentChange', function(e, o) {
          var model = this.attr.model
            , value = o.value;

          if (model) {
            if ($.isFunction(model)) {
              value = model(value);
            } else if ($.isPlainObject(model)) {
              value = model;
            } else {
              value = value[model];
            }
          } 
  
          e.stopPropagation();

          this.$node.trigger('valueChange', { value: value, silent: true });
        });
          
        this.on('valueChange', function(e, o) {         
          var value = o.value
            , nestedDatabinds = this.$node.find('[data-bind] [data-bind]');

          this.$node.find('[data-bind]')
            .not(nestedDatabinds).each(function() {
            $(this).trigger('parentChange', { value: value });
          });

          if (o.silent) {
            e.stopPropagation();
          }
        });
      });
    }
  }
);

