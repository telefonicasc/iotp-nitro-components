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
                
                this.on('valueChange', function(e, o) {
                    var list = this.$node.find('.group-tooltip-marker-list'),
                        markers = (o.value && o.value.markers) || [];

                    list.empty();
                    $.each(markers, $.proxy(function(i, marker) {
                        var cssClass = marker.options.marker.cssClass,
                            title = marker.options.marker.title,
                            item = marker.options.item,
                            el = $('<div>')
                                .data('item', item)
                                .addClass('group-tooltip-marker ' + cssClass)
                                .html(title);
                        
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
                    if (item) {
                        markers.each(function() {
                            if ($(this).data('item') === item) {
                                $(this).addClass('selected');
                            }
                        });
                    }
                });
            });
        }

        return ComponentManager.extend('Tooltip', 'MapMarkerGroupTooltip',
            MapMarkerGroupTooltip);

    }
);
