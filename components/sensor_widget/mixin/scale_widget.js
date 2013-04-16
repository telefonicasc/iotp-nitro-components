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
                maxValue: 100
            });

            this.after('initialize', function() {

                this.value = this.attr.value;

                this.$node.addClass('scale-widget');

                this.paper = Raphael(this.node, this.width, this.height);
                this.scaleRect = this.paper.rect(0, 0, this.width, 0);

                this.on('valueChange', function(e, o) {
                    this.value = o.value;
                    this.updateScale();
                });

                this.on('resize', function() {
                    this.updateScale();
                });

                this.updateScale();
            });

            this.updateScale = function() {
                var height = this.value * this.height / this.attr.maxValue;
                this.scaleRect.attr({
                    height: height,
                    y: this.height - height
                });
            };
            
        }
    }
);
