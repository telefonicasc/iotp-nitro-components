define([  
    'components/container',
    'components/component_manager'
  ],

  function(Container, ComponentManager) {
    describe('a container', function() {

      ComponentManager.create('test', function TestComponent() {
        this.after('initialize', function() {
          this.$node.addClass('test-component');
        });
      });

      it('has a attachTo method', function() {
        expect(Container.attachTo).toBeDefined();
      });

      it('can be accesed by ComponentManager.get("container")', function() {
        expect(ComponentManager.get('container')).toBe(Container);
      });

      describe('when attached to a component', function() {

        beforeEach(function() {
          this.$node = $('<div>').appendTo($('body'));
          this.renderEvent = function() {};
          spyOn(this, 'renderEvent');
          this.$node.on('render', this.renderEvent);
        });

        afterEach(function() {
          this.$node.remove();
        });

        it('should work without parameters', function() {
          Container.attachTo(this.$node);
        });

        it('should trigger render after render', function() {
          Container.attachTo(this.$node, { items: [] });
          expect(this.renderEvent).toHaveBeenCalled();
        });

        it('when an item has className it should add it', function() {
          Container.attachTo(this.$node, { items: [{ className: 'foo' }] });
          expect(this.$node.children('.foo').length).toBe(1);
        });

        it('when an item has html it should append it', function() {
          Container.attachTo(this.$node, { items: [{ html: 'hello' }] });
          expect(this.$node.children().eq(0).html()).toBe('hello');
        });

        it('when an item has component it should create it', function() {
          Container.attachTo(this.$node, { items: [{ component: 'test' }] });
          expect(this.$node.children('.test-component').length).toBe(1);
        });

        it('should apply item styles defined in style', function() {
          Container.attachTo(this.$node, { items: [{ style: { color: 'red' } }]});
          expect(this.$node.children().eq(0).css('color')).toBe('rgb(255, 0, 0)');
        });

        it('can have nested containers', function() {
          Container.attachTo(this.$node, {
            items: [{              
              items: [{ html: 'children' }]
            }]
          });
          expect(this.$node.children().eq(0).children().eq(0).length).toBe(1);
        });

      });

    });
  }
);
