define(
    [
        'components/component_manager',
        'components/mixin/data_binding'
    ],

    function(ComponentManager, DataBinding, Template) {
        var dataType = {
            'TEXT':'Text',
            'QUANTITY':'Quantity'
        };

        return ComponentManager.create('CardBackText', DataBinding,
            CardBackText);

        function CardBackText() {

            this.defaultAttrs({
                'dataType': dataType.TEXT
            });

            this.after('initialize', function() {

                this.$node.addClass('m2m-card-text');

                if (this.attr.label) {
                    $('<label>')
                        .html(this.attr.label)
                        .appendTo(this.$node);
                }

                this.$input = this.makeInput(this.attr.dataType).appendTo(this.$node);


                this.$input.on('keyup', $.proxy(function(e) {
                    this.trigger('valueChange', {
                        value: this.$input.val()
                    });
                }, this));

                this.on('valueChange', function(e,o) {
                    this.$input.val(o.value);
                });
            });

            this.makeInput = function(type){
                var ele = $('<input type="text">');
                if(type === dataType.QUANTITY){
                    ele.attr('type', 'number');
                }
                return ele;
            };
        }

    }
);
