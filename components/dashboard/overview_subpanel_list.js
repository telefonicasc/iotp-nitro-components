define(
    [
        'components/component_manager',
        'components/repeat_container'
    ],

    function(ComponentManager, RepeatContainer) {

        return ComponentManager.create('OverviewSubpanelList', 
            OverviewSubpanelList);

        function OverviewSubpanelList() {

            this.defaultAttrs({
                text: '',
                caption: '',
                iconClass: ''
            });

            this.after('initialize', function() {
                var repeatContainer = $('<div>').appendTo(this.$node);

                RepeatContainer.attachTo(repeatContainer, {
                    component: 'RepeatContainer',
                    model: '$[*]',
                    item: {
                        component: 'OverviewSubpanel',
                        iconClass: this.attr.iconClass,
                        text: this.attr.text,
                        caption: this.attr.caption 
                    }
                });
                
                this.$node.on('click', '.repeat-container-item', 
                    $.proxy(function(e, node) {
                        var dataItem = $(e.currentTarget).data('m2mValue');
                        this.trigger('itemselected', { item: dataItem });
                    }, this));
            });
        }
    }
);
