define([  
    'components/mixin/data_binding',
    'components/component_manager'
  ],

  function(DataBinding, ComponentManager) {

    describe('a component with dataBinding', function() {

      ComponentManager.create('test', function TestComponent() {
        this.after('initialize', function() {
          this.$node.addClass('test-component');
        });
      }, DataBinding);

      beforeEach(function() {
        this.$node = $('<div>').appendTo($('body'));
        this.valueChangeEvent = function() {};
        spyOn(this, 'valueChangeEvent');
        this.$node.on('valueChange', this.valueChangeEvent);
        ComponentManager.get('test').attachTo(this.$node);
      });

      afterEach(function() {
        this.$node.remove();
      });

      it('sets the data-bind attribute', function() {
        expect(this.$node.attr('data-bind')).toBe('');
      });

      it('triggers valueChange when setting data-value', function() {
        this.$node.data('value', '12345'); 
        expect(this.valueChangeEvent).toHaveBeenCalled();
      });
    });
  }
);
