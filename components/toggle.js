define(
  [
    'components/component_manager',
    'components/mixin/data_binding'
  ],

  function(ComponentManager, DataBinding) {

    return ComponentManager.create('toggle',
      Toggle, DataBinding);

    function Toggle() {
    
      this.defaultAttrs({

      });

      this.value = false;

      this.after('initialize', function() {

        this.on('click', function() {
          this.trigger('valueChange', { value: !this.value });
        });

        this.on('valueChange', function(e, options) {
          this.value = options.value;
          this.$node.toggleClass('selected', this.value);
        });        
      });
    }
  }

);

