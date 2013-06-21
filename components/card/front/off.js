define(
[
    'components/component_manager',
    'components/mixin/data_binding',
    'components/mixin/template'
],
function(ComponentManager, DataBinding, Template) {

    function CardFrontOff() {

        this.defaultAttrs({
            tpl: '<div class="m2m-card-off">' +
                    '<div class="m2m-card-off-img">&nbsp;</div>' +
                    '<div class="m2m-card-off-value">{{value}}</div>' +
                 '</div>'
        });

        this.after('initialize', _initialize);
    }

    function _initialize(){
        this.trigger('valueChange', { value: '' });
    }

    return ComponentManager.create('CardFrontOff', DataBinding,
        Template, CardFrontOff);

});
