define(
  [
    'components/component_manager',
    'components/draggable',
    'components/mixin/template'
  ],
  
  function(ComponentManager, Draggable, Template) {

    return ComponentManager.create('graphEditor',
      Template, GraphEditor);

    function GraphEditor() {      

      this.connections = [];

      this.defaultAttrs({
        tpl: '<div class="connection-container fit"></div>' +
             '<div class="node-container fit"></div>',
        nodes: {
          nodes: '.node-container',
          connections: '.connection-container' 
        }
      });

      this.after('initialize', function() {

        this.$node.addClass('graph-editor');

        this.paper = Raphael(this.$connections[0]);
        
        this.on('addConnection', function(e, o) {
          var connection = {
                start: o.start,
                end: o.end
              };

          connection.path = this.paper.path(this.getPathArray(o.start, o.end));
          connection.path.attr({
            stroke: '#efeeeb', 'stroke-width': 40
          });
          this.connections.push(connection);
          this.trigger('connectionAdded', { 
              connection: connection,
              connections: this.connections
          });
        });

        this.$nodes.on('drag', '*', $.proxy(function(e, ui) {
          if (e.target.parentNode === e.delegateTarget) {
            var dragNode = $(e.target);
            dragNode.trigger('moved', 
              { left: ui.position.left, top: ui.position.top }
            );
          }
        }, this));

        this.$nodes.on('move', '*', $.proxy(function(e, o) {
          if (e.target.parentNode === e.delegateTarget) {
            $(e.target).css(o);
            $(e.target).trigger('moved', o);
          }
        }, this));

        this.$nodes.on('moved', '*', $.proxy(function(e) {
          if (e.target.parentNode === e.delegateTarget) {
            this.updateConnections(); 
          }
        }, this));

        this.on('removeConnection', function() {

        });

        this.on('addNode', function(e, o) {
          var node = o.node;
          this.$nodes.append(node);
          if (o.draggable !== false) {
            Draggable.attachTo(node, {});
          }
          this.trigger('nodeAdded', { node: node });
        });

        this.on('removeNode', function(e, o) {

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
