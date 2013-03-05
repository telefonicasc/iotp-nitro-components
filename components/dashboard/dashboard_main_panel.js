define(
  [
    'components/component_manager',
    'components/mixin/container',
    'components/container'
  ],

  function(ComponentManager, ContainerMixin) {

    return ComponentManager.create('dashboardMainPanel', 
      DashboardMainPanel, ContainerMixin);

    function DashboardMainPanel() {

      this.defaultAttrs({
        title: '',
        items: []
      });

      this.after('initialize', function() {

        this.$node.addClass('dashboard-main-panel');

        this.before('renderItems', function() {
          this.attr.items = [{
            tag: 'h1', html: this.attr.title  
          }, {
            component: 'container',
            className: 'dashboard-main-panel-content',
            items: this.attr.items
          }];
        });
      });
    }
  }

);
