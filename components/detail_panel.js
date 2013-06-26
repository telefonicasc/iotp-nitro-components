
define (
    [ 
        'components/component_manager',
        'components/mixin/template',
        'components/mixin/container'
    ],  

    function (ComponentManager, Template, ContainerMixin) {

        return ComponentManager.create('detailPanel', DetailPanel, Template, ContainerMixin);

        function DetailPanel () {

            this.defaultAttrs({
                selectHeader: '.detail-panel-header',
                selectContent: '.detail-panel-content',
                insertionPoint: '.detail-panel-content',
                header: '',
                tpl: '<div class="detail-panel-header">{{header}}{{value.header}}</div>'+
                        '<div class="detail-panel-content"/>',
                items: []
            });

            this.after('initialize', function () {

                this.$node.addClass('detail-panel');
                
                this.select('selectHeader').html(this.attr.header);

                this.on('update-header', $.proxy(function (event, header) {
                    this.select('selectHeader').html(header);
                }, this));
                
                this.on('render', function () {
                    this.select('selectHeader').click(function () {
                        $(this).trigger('detailPanelClick');
                    });
                });
                                
            });
        }
    }
);
