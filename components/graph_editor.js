define(
  [
    'components/component_manager',
    'components/draggable',
    'raphael'
  ],
  
  function(ComponentManager, Draggable) {

    return ComponentManager.create('graphEditor',
      GraphEditor);

    function GraphEditor() {      

      this.connections = [];

      this.defaultAttrs({

      });

      this.after('initialize', function() {

        this.$node.children().each(function() {
          Draggable.attachTo($(this), {});
          $(this).on('drag', function(e, ui) {
            $(this).trigger('move', 
              { left: ui.position.left, top: ui.position.top }
            );
          });
        });

        this.$connections = $('<div>').appendTo(this.$node);
        this.paper = Raphael(this.$connections[0]);
        
        this.on('addConnection', function(e, o) {
          var connection = {
                start: o.start,
                end: o.end
              };

          connection.path = this.paper.path(this.getPathArray(o.start, o.end));
          this.connections.push(connection);
        });

        this.$node.on('move', '*', $.proxy(function(e) {
          if (e.target.parentNode === e.delegateTarget) {
            this.updateConnections(); 
          }
        }, this));

        this.on('removeConnection', function() {

        });

        this.on('nodeAdded', function() {

        });

        this.on('nodeRemoved', function() {

        });
      });  

      this.updateConnections = function() {
        $.each(this.connections, $.proxy(function(i, connection) {
          connection.path.attr('path', 
            this.getPathArray(connection.start, connection.end));
        }, this));
      };

      this.getPathArray = function(start, end) {
        var pathArray = []
          , startPosition = start.position()
          , endPosition = end.position()
          , diffX = endPosition.left - startPosition.left
          , diffY = endPosition.top - startPosition.top;

          pathArray.push('M', startPosition.left, startPosition.top,
            'c', 100, 0);
          pathArray.push(diffX-100, diffY, diffX, diffY);

        return pathArray;
      };
    }
  }
);
