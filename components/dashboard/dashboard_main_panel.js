define(
  [
    'components/component_manager',
    'components/mixin/container',
    'components/context_menu',
    'components/container'    
  ],

  function(ComponentManager, ContainerMixin, ContextMenu) {

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
            tag: 'header', 
            items: [{
              tag: 'h1',
              html: this.attr.title  
            }, {
              className: 'context-menu-indicator'
            }]
          }, {
            component: 'container',
            className: 'dashboard-main-panel-content',
            items: this.attr.items
          }];
        });

        this.on('render', function() {
          var cmIndicator = this.$node.find('.context-menu-indicator');
          if (this.attr.contextMenu) {
            this.$cm = $('<div>');
            ContextMenu.attachTo(this.$cm, this.attr.contextMenu);
            this.$cm.appendTo($('body'));
            cmIndicator.click($.proxy(function() {
              var inPos = cmIndicator.offset();
              this.$cm.css({ 
                top: inPos.top,
                left: inPos.left + cmIndicator.width()
              });
              this.$cm.trigger('show');
            }, this));
            $(document).on('click', $.proxy(function(e) {
              if (!cmIndicator.is(e.target) && !$.contains(this.$cm[0], e.target)) { 
                this.$cm.trigger('hide');
              }
            }, this));
            $(document).on('keyup', $.proxy(function(e) {
              if (e.keyCode === 27) {
                this.$cm.trigger('hide');
              }
            }, this));
          }else{
            cmIndicator.hide();
          }
        });

      });
    }
  }

);
