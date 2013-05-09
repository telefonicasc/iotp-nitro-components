define(
    [
        'components/component_manager',
        'components/mixin/data_binding',
        'components/mixin/watch_resize'
    ],

    function(ComponentManager, DataBinding, WatchResize) {

        return ComponentManager.create('AngleWidget',
            DataBinding, WatchResize, AngleWidget);

        function AngleWidget() {

            this.defaultAttrs({
                marginLeft: 25,
                marginRight: 25,
                marginTop: 10,
                marginBottom: 40,
                arcStyle: {
                    stroke: '#c9dade',
                    'stroke-width': 3,
                    'stroke-dasharray': '-' 
                },
                barStyle: {
                    fill: '#b5c1c7',
                    stroke: 0,
                    width: 15
                },
                floorStyle: {
                    fill: '#5a6568',
                    'stroke-width': 0
                }
            });

            this.after('initialize', function() {
    
                this.value = this.attr.value;

                this.$node.addClass('angle-widget');

                this.paper = Raphael(this.node, this.width, this.height);
                
                this.initShapes();

                this.on('valueChange', function(e, o) {
                    this.value = o.value;
                    this.redraw();
                });

                this.on('resize', function() {
                    this.paper.setSize(this.width, this.height);
                    this.redraw();
                });

                this.trigger('render');                
            });

            this.initShapes = function() {
                this.arc = this.paper.path();
                this.arc.attr(this.attr.arcStyle);
                this.bar = this.paper.rect(this.attr.marginLeft, 10, 4, 0, 4);
                this.bar.attr(this.attr.barStyle);
                this.floor = this.paper.rect(this.attr.marginLeft, 0, 0, 4, 3);
                this.floor.attr(this.attr.floorStyle);
            };

            this.redraw = function() {
                var attr = this.attr,
                    floorWidth = this.width - attr.marginLeft - attr.marginRight,
                    angleHeight = this.height - attr.marginTop - attr.marginBottom,
                    value = this.value,
                    arcx = (Math.cos(value*Math.PI / 180) * angleHeight) + attr.marginLeft,
                    arcy = attr.marginTop + angleHeight - 
                            (Math.sin(value*Math.PI / 180) * angleHeight);

                this.arc.attr({
                    path: ['M', this.width - attr.marginRight-5, 
                                this.height - attr.marginBottom - 5,
                           'A', floorWidth, floorWidth, 0, 0, 0, arcx, arcy]
                });

                this.bar.attr({
                    height: angleHeight + 4
                });
                this.floor.attr({
                    y: angleHeight + attr.marginTop, width: floorWidth
                });
                this.bar.transform(['r', 90-value, attr.marginLeft+7,
                        attr.marginTop+angleHeight+2]);
            };
        }
    }
);
