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

                    connection.path = this.paper.path(
                        this.getPathArray(o.start, o.end));
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
                        dragNode.data({
                            left: ui.position.left, top: ui.position.top
                        }); 
                        dragNode.trigger('moved');
                    }
                }, this));

                this.$nodes.on('move', '*', $.proxy(function(e, o) {
                    if (e.target.parentNode === e.delegateTarget) {
                        $(e.target).data({ left: o.left, top: o.top });
                        $(e.target).css(o);
                        $(e.target).trigger('moved', o);
                      }
                }, this));

                this.$nodes.on('moved', '*', $.proxy(function(e) {
                    if (e.target.parentNode === e.delegateTarget) {
                        this.updateConnections(); 
                     }
                }, this));

                this.on('removeConnection', function(e, o) {
                    var connection = this.getConnection(o.start, o.end),
                        index;
                    if (connection) {
                        connection.path.remove();
                        index = this.connections.indexOf(connection);
                        this.connections.splice(index, 1);
                    }
                });
                
                this.on('insertAfter', function(e, o) {
                    
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
                this.on('saveConnections', function() {
                    this.savedConnections = $.extend(true, [], this.connections);
                    this.updateConnections();
                });
                
                this.on('restoreConnections', function() {
                    this.connections = $.extend(true, [], this.savedConnections);
                    this.updateConnections();
                });

                this.on('updateConnections', function() {
                    this.updateConnections();
                });
            });

            this.updateConnections = function() {
                $.each(this.connections, $.proxy(function(i, connection) {
                    connection.path.attr('path',
                        this.getPathArray(connection.start, connection.end));
                }, this));
            };
            
            this.getConnection = function(start, end) {
                var conn = null;

                $.each(this.connections, $.proxy(function(i, connection) {
                    if (connection.start.is(start) && connection.end.is(end)) {
                        conn = connection;
                    }
                }, this));

                return conn;
            };

            this.getPathArray = function(start, end) {
                var pathArray = [],
                    startPosition = start.data(),
                    endPosition = end.data(),
                    diffX = endPosition.left - startPosition.left,
                    diffY = endPosition.top - startPosition.top;

                pathArray.push('M', startPosition.left, startPosition.top,
                    'c', 100, 0);

                pathArray.push(diffX - 100, diffY, diffX, diffY);

                return pathArray;
            };
        }
    }
);
