define(
    [
        'components/component_manager',
        'components/mixin/container',
        'components/context_menu_indicator',
        'components/mixin/data_binding'
    ],

    function(ComponentManager, ContainerMixin,
        ContextMenuIndicator, DataBinding) {

        return ComponentManager.create('overviewPanel',
                DashboardOverview, ContainerMixin, DataBinding);

        function DashboardOverview() {

            this.defaultAttrs({
                insertionPoint: '.overview-content',
                title: '',
                count: '',
                countClass: 'blue'
            });

            this.createOverviewHeader = function() {

                console.log('ATTR', this.attr);

                if (this.attr.title && this.attr.count){
                    this.$headerNode = $('<div>').addClass('overview-header');

                    this.$countNode = $('<span>')
                                .addClass('overview-count')
                                .appendTo(this.$headerNode);

                    this.$titleNode = $('<span>')
                                .addClass('overview-title')
                                .appendTo(this.$headerNode)
                                .html(this.attr.title);

                    this.$headerNode.appendTo(this.$node);

                    if (!$.isFunction(this.attr.count)) {
                        this.$countNode.html(this.attr.count);
                    }
                }

                this.$contentNode = $('<div>')
                        .addClass('overview-content')
                        .appendTo(this.$node);

                if (this.attr.contextMenu) {
                    this.cmIndicator = $('<div>').appendTo(this.$headerNode);
                    ContextMenuIndicator.attachTo(this.cmIndicator, this.attr);
                }
            };

            this.after('initialize', function() {
                this.$node.addClass('dashboard-overview-panel sidebar');
                this.createOverviewHeader();

                this.on('valueChange', this.updateCount);
            });

            this.updateCount = function(e, o) {
                var value = o.value,
                    count = '';

                if ($.isFunction(this.attr.count)) {
                    count = this.attr.count(value);
                    this.$countNode.html(count);
                }
            };
        }
    }

);
