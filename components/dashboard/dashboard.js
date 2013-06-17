define(
    [
        'components/component_manager',
        'components/mixin/container',
        'components/mixin/data_binding',
        'components/container',
        'components/dashboard/overview_panel',
        'components/dashboard/details_panel'
    ],

    function(ComponentManager, ContainerMixin, DataBinding) {

        return ComponentManager.create('dashboard',
            Dashboard, ContainerMixin, DataBinding);

        function Dashboard() {

            this.defaultAttrs({

            });

            this.updateData = function() {
                this.attr.data($.proxy(function(data) {
                    this.$node.trigger('valueChange', { value: data });
                }, this));
            };

            this.after('initialize', function() {

                this.before('renderItems', function() {
                    this.attr.items = [{
                        component: 'container',
                        className: 'main-content',
                        items: this.attr.mainContent
                    }, {
                        component: 'overviewPanel',
                        title: this.attr.overviewPanel.title,
                        contextMenu: this.attr.overviewPanel.contextMenu,
                        items: this.attr.overviewPanel.items
                    }];

                    if (this.attr.detailsPanel) {
                        this.attr.items.push({
                            component: 'DashboardDetailsPanel',
                            items: this.attr.detailsPanel.items
                        });
                    }
                });

                this.after('renderItems', function() {
                    this.$detailsPanel = $('.dashboard-details-panel', 
                        this.$node);
                    this.$detailsPanel.trigger('collapse', { duration: 0 });
                    this.updateData();

                    this.$node.on('click', '.overview-header',
                        $.proxy(function() {
                            this.$detailsPanel.trigger('collapse');
                        }, this));
                });

                this.on('itemselected', function(e, o) {
                    var item = o.item;
                    this.$detailsPanel.trigger('valueChange', { 
                        value: item, silent: true
                    });
                    this.$detailsPanel.trigger('expand');
                });
            });
        }
    }

);
