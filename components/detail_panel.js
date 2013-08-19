define(
    [
        'components/component_manager',
        'components/mixin/template',
        'components/mixin/container',
        'components/context_menu_indicator'
    ],

    function (ComponentManager, Template, Container, ContextMenuIndicator) {

        return ComponentManager.create('detailPanel', Component, Template, Container);

        function Component() {

            this.defaultAttrs({
                header: '',
                insertionPoint: '.detail-panel-content',                
                tpl: '<div class="detail-panel-header">'+
                        '<div class="header-text">{{header}}</div>'+
                        '<div class="context-menu-anchor"></div>'+
                     '</div>' +
                     '<div class="detail-panel-content"></div>',
                nodes: {
                    header: '.detail-panel-header',
                    content: '.detail-panel-content',
                    anchor: '.context-menu-anchor'
                }
            });

            this.after('initialize', function() {
                this.$node.addClass('detail-panel');

                this.on('render', function() {
                    var cmIndicator;
                    if (this.attr.contextMenu) {
                        ContextMenuIndicator.attachTo(this.$anchor, this.attr);
                    }
                });
            });
        }   
    }
);
