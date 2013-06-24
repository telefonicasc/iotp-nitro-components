define(
    [
        'components/component_manager',
        'components/mixin/container',
        'components/mixin/watch_resize',
        'components/mixin/data_binding'
    ],

    function(ComponentManager, ContainerMixin, WatchResize, DataBinding) {

        return ComponentManager.create('DashboardDetailsPanel',
            DashboardDetailsPanel, WatchResize, ContainerMixin, DataBinding);

        function DashboardDetailsPanel() {

            this.defaultAttrs({
                marginTop: 36
            });

            this.after('initialize', function() {
                this.$node.addClass('dashboard-details-panel');

                this.on('expand', function(e, o) {
                    var duration = o && o.duration !== undefined ? duration : 300;
                    this.$node.animate({ height: this.height }, duration);
                    this.expanded = true;
                });

                this.on('collapse', function(e, o) {
                    var duration = o && o.duration !== undefined ? duration : 300;
                    this.$node.animate({ height: 0 }, duration);
                    this.expanded = false;
                });

                this.on('resize', function() {
                    this.height = this.$node.parent().height() -
                            this.attr.marginTop;

                    if (this.expanded) {
                        this.$node.css({
                            height: this.height
                        });
                    }
                });
            });
        }
    }
);

