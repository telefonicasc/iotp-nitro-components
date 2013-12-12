/*
 * @component CardFrontIcon
 *
 * @attr {iconClass} class of the icon showed in the card.
 *
 */
define(
    [
        'components/component_manager',
        'components/mixin/data_binding',
        'components/mixin/template'
    ],

    function(ComponentManager, DataBinding, Template) {
        function CardFrontIcon() {
            this.defaultAttrs({
                iconClass: "",
                tpl: '<div class="m2m-card-icon">' +
                        '<div class="icon {{iconClass}}"></div>' +
                     '</div>'
            });
        }
        
        return ComponentManager.create('CardFrontIcon', DataBinding,
            Template, CardFrontIcon);

    }
);
