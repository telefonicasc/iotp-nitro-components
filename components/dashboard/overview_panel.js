define(
  [
    'components/component_manager',
    'components/mixin/container'
  ],

  function(ComponentManager, ContainerMixin) {
    
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

        this.$titleNode  = $('<span>')
            .addClass('overview-title')
            .appendTo(this.$headerNode)
            .html(this.attr.title);

        this.$headerNode.appendTo(this.$node);

        this.$contentNode = $('<div>')
            .addClass('overview-content')
            .appendTo(this.$node);
        
      };

      this.after('initialize', function() {
        this.$node.addClass('sidebar');
        this.createOverviewHeader();
      });
    }
  }

);
