define(
    [
        'components/component_manager',
        'components/container',
        'components/mixin/data_binding'
    ],

    function(ComponentManager, Container, DataBinding) {

        return ComponentManager.create('RepeatContainer',
            RepeatContainer, DataBinding);

        function RepeatContainer() {

            this.defaultAttrs({
                item: { component: 'container' }
            });

            this.updateContent = function(dataItems) {
                this.$node.empty();
                $.each(dataItems, $.proxy(function(i, item) {
                    var cmpName = this.attr.item.component || 'component', 
                        cmp = ComponentManager.get(cmpName),
                        itemNode = $('<div>')
                            .addClass('repeat-container-item'); 
                    
                    cmp.attachTo(itemNode, $.extend({
                        model: (function(index) {
                            return function(data) {
                                return data ? data[i] : null;
                            };
                        })(i)
                    }, this.attr.item));
                    this.$node.append(itemNode);
                }, this));
            };
    
            this.after('initialize', function() {
                this.$node.addClass('repeat-container');
                this.on('valueChange', function(e, o) {
                    if (o.value && o.value.length) {
                        this.updateContent(o.value); 
                    } else {
                        this.$node.empty();
                    }
                });
            });
        }
    }
);
