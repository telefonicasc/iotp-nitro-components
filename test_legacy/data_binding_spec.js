define([  
    'components/mixin/data_binding',
    'components/component_manager'
  ],

  function(DataBinding, ComponentManager) {

    describe('a component with dataBinding', function() {

      ComponentManager.create('test', function TestComponent() {
        this.after('initialize', function() {
          this.$node.addClass('test-component');
          this.on('valueChange', function(e, o) {
            this.$node.html(o.value);
          });
        });
      }, DataBinding);

      beforeEach(function() {
        this.$node = $('<div>').appendTo($('body'));
        this.valueChangeEvent = function() {};
        spyOn(this, 'valueChangeEvent');
        this.$node.on('valueChange', this.valueChangeEvent);
      });

      afterEach(function() {
        this.$node.remove();
      });

      it('sets the data-bind attribute', function() {
        ComponentManager.get('test').attachTo(this.$node);
        expect(this.$node.attr('data-bind')).toBe('');
      });

      it('a jsonPath can be used as model', function() {
        ComponentManager.get('test').attachTo(this.$node, {
            model: '$.blabla[1].a'
        });
        this.$node.trigger('parentChange', {
            value: {
                blabla: [{ a: 23 }, { a: 47 }]
            }
        });
        expect(this.$node.html()).toBe('47');
      });

    });
  }
);
