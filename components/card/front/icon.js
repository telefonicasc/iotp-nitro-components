/*
 * @component CardFrontIcon
 *
 * @attr {iconClass} labelTxt. Text showed in the card.
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
                        '<div class="icon"></div>' +
                     '</div>'
            });
            this.after('initialize', function(){
                this.$node.find('.icon').addClass(this.attr.iconClass);
            });
        }
        
        return ComponentManager.create('CardFrontIcon', DataBinding,
            Template, CardFrontIcon);

    }
);
