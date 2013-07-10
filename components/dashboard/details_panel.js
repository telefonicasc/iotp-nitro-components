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
                marginTop: 36,
                expandHorizontally: false
            });

            this.after('initialize', function() {
                this.$node.addClass('dashboard-details-panel sidebar');

                this.on('expand', function(e, o) {
                    var duration = o && o.duration !== undefined ? duration : 300,
                        animProps;

                    if (this.attr.expandHorizontally) {
                        animProps = { width: 'show' };
                    } else {
                        animProps = { height: this.height };
                    }
                    $('.paged-container .navigation', this.$node).hide();
                    this.$node.animate(animProps, duration, 'swing', $.proxy(function () {
                        this.trigger('expanded');
                        $('.paged-container', this.$node).trigger('update');
                    },this));
                    this.expanded = true;
                });

                this.on('collapse', function(e, o) {
                    var duration = o && o.duration !== undefined ? duration : 300,
                        animProps;

                    if (this.attr.expandHorizontally) {
                        animProps = { width: 'hide' };
                    } else {
                        animProps = { height: 0 };
                    }

                    this.$node.animate(animProps, duration, 'swing', $.proxy(function() {
                        this.trigger('collapsed');
                    }, this));
                    this.expanded = false;
                });

                this.on('resize', function() {
                    if (!this.attr.expandHorizontally) {
                        this.height = this.$node.parent().height() -
                                this.attr.marginTop;

                        if (this.expanded) {
                            this.$node.css({
                                height: this.height
                            });
                        }
                    }
                });

                if (this.attr.expandHorizontally) {
                    this.$node.css({ top: this.attr.marginTop });
                }
            });
        }
    }
);

