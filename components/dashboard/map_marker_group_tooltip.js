/**
 * @component MapMarkerGroupTooltip
 *
 * @mixins Tooltip DataBinding
 */

define(
    [
        'components/component_manager',
        'components/mixin/data_binding',
        'components/tooltip'
    ],

    function(ComponentManager, DataBinding, Tooltip) {

        function MapMarkerGroupTooltip() {
            this.defaultAttrs({
                items: [{
                    className: 'tooltip-arrow-border'
                }, {
                    className: 'tooltip-arrow'
                }, {
                    className: 'group-tooltip-marker-list'
                }]
            });

            this.after('initialize', function() {

                this.$node.addClass('grouplist');

                this.on('valueChange', function(e, o) {
                    var list = this.$node.find('.group-tooltip-marker-list'),
                        markers = (o.value && o.value.markers) || [],
                        itemselected = this.$node.data('itemselected');;

                    list.empty();
                    $.each(markers, $.proxy(function(i, marker) {
                        var cssClass = marker.options.marker.cssClass,
                            title = marker.options.marker.title,
                            item = marker.options.item,
                            el = $('<div>')
                                .data('item', item)
                                .addClass('group-tooltip-marker ' + cssClass)
                                .html(title);
                        if(itemselected && item === itemselected){
                            el.addClass('selected');
                        }
                        el.appendTo(list);
                        el.on('click', $.proxy(function() {
                            this.trigger('itemselected', { item: item });
                        }, this));
                    }, this));
                });

                this.on('itemselected', function(e, o) {
                    var item = o.item,
                        markers = this.$node.find('.group-tooltip-marker');
                    markers.removeClass('selected');
                    this.$node.data('itemselected', item);
                    if (item) {
                        markers.each(function() {
                            if ($(this).data('item') === item) {
                                $(this).addClass('selected');
                            }
                        });
                    }
                    if(o.silent) e.stopPropagation();
                });

                this.on('hide', function(){
                    this.$node.removeData('bindto');
                });
                this.on('show', function(e, $ele){
                    if($ele) this.$node.data('bindto', $ele);
                });


                this.on('fix', function(){
                    var ele = this.$node.data('bindto'),
                        position;
                    if(ele){
                        position = $(ele).offset();
                        this.$node.css({
                            left: position.left - this.$node.width() / 2,
                            top: position.top + $(ele).height()
                        });
                    }
                });
            });
        }

        return ComponentManager.extend('Tooltip', 'MapMarkerGroupTooltip',
            MapMarkerGroupTooltip);

    }
);
