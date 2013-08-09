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

            this.sendItemSelectedToDetail = function(e, o){
                var item = o.item;
                if (item && this.attr.itemData) {
                    this.attr.itemData(item, $.proxy(function(data) {
                        this.$detailsPanel.trigger('valueChange', {
                            value: data, silent: true
                        });
                    }, this));
                } else {
                    this.$detailsPanel.trigger('valueChange', {
                        value: item, silent: true
                    });
                }
                this.$detailsPanel.trigger(item?'expand':'collapse');
            };

            this.after('initialize', function() {

                this.before('renderItems', function() {

                    this.attr.items = [{
                        component: 'container',
                        className: 'main-content',
                        items: this.attr.mainContent
                    }];

                    this.attr.items.push($.extend({
                            component: 'overviewPanel',
                        }, this.attr.overviewPanel));

                    if (this.attr.detailsPanel) {
                        this.attr.items.push($.extend({
                            component: 'DashboardDetailsPanel',
                        }, this.attr.detailsPanel));
                    }
                });

                this.after('renderItems', function() {
                    this.$detailsPanel = $('.dashboard-details-panel',
                        this.$node);
                    this.$detailsPanel.trigger('collapse', { duration: 0 });
                    this.$overviewPanel = $('.dashboard-overview-panel', this.$node);
                    this.$mainContent =  $('.main-content', this.$node);
                    this.updateData();

                    this.$node.on('click', '.overview-header',
                        $.proxy(function() {
                            //$mainContent send trigger to $detailsPanel
                            this.$mainContent.children().trigger('itemselected', {item:null});
                        }, this));

                    this.$overviewPanel.on('itemselected',
                        $.proxy(function(e, data){
                            this.$mainContent.children().trigger('itemselected', data);
                        }, this));

                    this.$overviewPanel.on('itemselected',
                        $.proxy(this.sendItemSelectedToDetail, this));

                    this.$mainContent.on('itemselected',
                        $.proxy(this.sendItemSelectedToDetail, this));

                });

                this.on('updateData', function () {
                    this.updateData();
                });
            });
        }
    }

);
