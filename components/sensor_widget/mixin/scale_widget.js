/**
@name ScaleWidget


@option {Number} value 0 value
@option {Number} maxValue 100 maxValue
@option {Object} scaleRectStyle {} [Raphael - Paper.rect()](http://raphaeljs.com/reference.html#Paper.rect) configuration
*/
define(
    [
        'components/component_manager',
        'components/mixin/data_binding',
        'components/mixin/watch_resize',
        'components/mixin/template'
    ],

    function(ComponentManager, DataBinding, WatchResize) {

        return ComponentManager.create('ScaleWidget',
            DataBinding, WatchResize, ScaleWidget);

        function ScaleWidget() {

            this.defaultAttrs({
                value: 0,
                maxValue: 100,
                scaleRectStyle: {}
            });

            this.after('initialize', function() {

                this.value = this.attr.value;

                this.$node.addClass('scale-widget');

                this.paper = Raphael(this.node, this.width, this.height);
                this.scaleRect = this.paper.rect(0, 0, this.width, 0);
                this.scaleRect.attr(this.attr.scaleRectStyle);

                this.on('valueChange', function(e, o) {
                    this.value = o.value;
                    this.updateScale();
                });

                this.on('resize', function() {
                    this.paper.setSize(this.width, this.height);
                    this.scaleRect.attr({
                        width: this.width
                    });
                    this.updateScale();
                });

                this.trigger('render');
            });

            this.updateScale = function() {
                var height = this.value * this.height / this.attr.maxValue;
                this.scaleRect.attr($.extend({
                    height: height,
                    y: this.height - height
                }, this.attr.scaleRectStyle));
            };

        }
    }
);
