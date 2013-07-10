define(
    [
        'components/component_manager',
        'components/mixin/data_binding',
        'components/mixin/template'
    ],

    function(ComponentManager, DataBinding, Template) {
        function CardFrontAlarm() {
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
        
        return ComponentManager.create('CardFrontAlarm', DataBinding,
            Template, CardFrontAlarm);

    }
);
