define(
  [
    'components/component_manager'
  ],

  function(ComponentManager) {
    
    return ComponentManager.create('overviewPanel', DashboardOverview);

    function DashboardOverview() {
      
      this.defaultAttrs({
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

        
      };

      this.after('initialize', function() {
        this.$node.addClass('sidebar');
        this.createOverviewHeader();
      });
    }
  }

);
