define(
  [
    'components/component_manager',
    'components/mixin/container',
    'components/context_menu_indicator'
  ],

  function(ComponentManager, ContainerMixin, ContextMenuIndicator) {

    return ComponentManager.create('overviewPanel',
        DashboardOverview, ContainerMixin);

    function DashboardOverview() {

      this.defaultAttrs({
        insertionPoint: '.overview-content',
        title: '',
        count: 10,
        countClass: 'blue'
      });

      this.createOverviewHeader = function() {
        this.$headerNode = $('<div>').addClass('overview-header');

        this.$countNode = $('<span>')
            .addClass('overview-count')
            .appendTo(this.$headerNode)
            .html(this.attr.count);

        this.$titleNode = $('<span>')
            .addClass('overview-title')
            .appendTo(this.$headerNode)
            .html(this.attr.title);

        this.$headerNode.appendTo(this.$node);

        this.$contentNode = $('<div>')
            .addClass('overview-content')
            .appendTo(this.$node);

        if (this.attr.contextMenu) {
          this.cmIndicator = $('<div>').appendTo(this.$headerNode);
          ContextMenuIndicator.attachTo(this.cmIndicator, this.attr);
        }
      };

      this.after('initialize', function() {
        this.$node.addClass('dashboard-overview-panel sidebar');
        this.createOverviewHeader();
      });
    }
  }

);
