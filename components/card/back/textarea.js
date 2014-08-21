define(
    [
        'components/component_manager',
        'components/mixin/data_binding',
        'components/mixin/template'
    ],
    function(ComponentManager, DataBinding, Template) {

        function CardBackTextarea() {

            this.defaultAttrs({
                tpl     : '<div class="m2m-card-textarea">' +
                            '<textarea>{{value}}</textarea>' +
                         '</div>',
                nodes   : {
                    'textarea': 'textarea'
                }
            });
            this.after('initialize', function() {
                this.attr.updateOnValueChange = false;
                this.on('valueChange', function(e,o) {
                    var value =
                        this.attr.value = ( o && o.value ) || o;
                    this.$textarea.val(  value || o );
                });
                this.$node.on('keyup change', 'textarea', $.proxy(function(e) {
                    var $ele = $(e.currentTarget);
                    var value = $ele.val();
                    this.trigger('valueChange', { 'value' : value });

                }, this));
            });
        }

        return ComponentManager.create('CardBackTextarea', DataBinding, Template, CardBackTextarea);

    }
);
