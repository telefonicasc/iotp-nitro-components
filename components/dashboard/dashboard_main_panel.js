/*
Componente usado en DashboardMap para pintar la sección de la izquierda

@name dashboardMainPanel

@mixin ContainerMixin

@option {String} title '' Title

*/

define(
  [
    'components/component_manager',
    'components/mixin/container',
    'components/context_menu_indicator',
    'components/container'
  ],

  function(ComponentManager, ContainerMixin, ContextMenuIndicator) {

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
            tag: 'div',
            className: 'title',
            items: [{
              tag: 'h1',
              html: this.attr.title
            }]
          }, {
            component: 'container',
            className: 'dashboard-main-panel-content',
            items: this.attr.items
          }];
        });

        this.on('render', function() {
          var cmIndicator;
          if (this.attr.contextMenu) {
            cmIndicator = $('<div>').appendTo(this.$node.find('div.title'));
            ContextMenuIndicator.attachTo(cmIndicator, this.attr);
          }
        });
      });
    }
  }

);
