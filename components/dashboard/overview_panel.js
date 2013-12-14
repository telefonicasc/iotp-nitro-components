/**
Create `$overviewPanel` section of __dashboard__ component

@name overviewPanel

@mixin ContainerMixin
@mixin DataBinding

@option {String} insertionPoint '.overview-content' jQuerySelector
@option {String} title '' Title
@option {String} count '' Count value
@option {String} countClass 'blue' Class name of count element
*/
define(
    [
        'components/component_manager',
        'components/mixin/container',
        'components/context_menu_indicator',
        'components/mixin/data_binding',
        'libs/hogan/hogan'
    ],

    function(ComponentManager, ContainerMixin,
        ContextMenuIndicator, DataBinding) {

        return ComponentManager.create('overviewPanel',
                DashboardOverview, ContainerMixin, DataBinding );

        function DashboardOverview() {

            this.defaultAttrs({
                insertionPoint: '.overview-content',
                title: '',
                count: '',
                countClass: 'blue',
                tpl: '<div class="overview-header">'+
                        '<span class="overview-count">{{count}}</span>'+
                        '<span class="overview-title">{{{title}}}</span>'+
                        '<span class="overview-contextMenu"></span>'+
                    '</div>'+
                    '<div class="overview-content">'+
                    '</div>',
                nodes: {
                    headerNode: '.overview-header',
                    countNode: '.overview-count',
                    titleNode: '.overview-title',
                    cmIndicator: '.overview-contextMenu',
                    contentNode :'.overview-content'
                }
            });

            this.after('initialize', function() {
                //@TODO move next two lines to new componente: example: "SimpleTpl"
                this.compiledTpl = Hogan.compile(this.attr.tpl);
                this.$node.html(this.compiledTpl.render(this.attr));

                $.each(this.attr.nodes, $.proxy(function(name, selector) {
                    this['$' + name] = $(selector, this.$node);
                }, this));
                if( !(this.attr.title && this.attr.count) ){
                    this.$headerNode.hide()
                }

                this.$countNode.addClass( this.attr.countClass );

                if( this.attr.contextMenu && this.$cmIndicator){
                    ContextMenuIndicator.attachTo(this.$cmIndicator, this.attr);
                }else{
                    this.$cmIndicator.hide();
                }


                this.$node.addClass('dashboard-overview-panel sidebar');

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
