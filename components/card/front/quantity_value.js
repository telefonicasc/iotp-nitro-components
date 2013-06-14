define(
    [
        'components/component_manager',
        'components/mixin/data_binding',
        'components/mixin/template'
    ],

    function(ComponentManager, DataBinding, Template) {

        return ComponentManager.create('CardFrontQuantityValue', DataBinding,
            Template, CardFrontQuantityValue);

        function CardFrontQuantityValue() {

            this.defaultAttrs({
                tpl: '<div class="m2m-card-quantity-container">' +
                        '<div class="m2m-card-quantity-label">{{label}}</div>' +
                        '<div class="m2m-card-quantity-value">{{value}}</div>' +
                        '<div class="m2m-card-quantity-units">{{units}}</div>' +
                     '</div>'
            });

            this.after('initialize', function() {
                this.$node.addClass('m2m-card-quantity');
                this.trigger('valueChange', { value: 0 });
            });
        }

    }
);
