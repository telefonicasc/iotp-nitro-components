define(
  [
    'components/component_manager',
    'components/mixin/container',
    'components/mixin/data_binding',
    'components/container',
    'components/dashboard/overview_panel'
  ],

  function(ComponentManager, ContainerMixin, DataBinding) {
    
    return ComponentManager.create('dashboard', 
      Dashboard, ContainerMixin, DataBinding);

    function Dashboard() {
      
      this.defaultAttrs({

      });

      this.updateData = function() {
        this.attr.data($.proxy(function(data) {
          this.$node.data('value', data);
        }, this));
      };

      this.after('initialize', function() {

        this.before('renderItems', function() {
          this.attr.items = [{
            component: 'container',
            className: 'main-content',
            items: this.attr.mainContent
          }, {
            component: 'overviewPanel',
            title: 'Days of user stats'
          }];
        });

        this.after('renderItems', function() {
          this.updateData();
        });

      });
    }
  }

);
