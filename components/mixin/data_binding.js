define(
    [
        'libs/jsonpath'
    ],

    function(jsonPath) {

        return DataBinding;

        function DataBinding() {

            this.defaultAttrs({
                resetModel: false,
                model: ''
            });

            this.after('initialize', function() {

                this.$node.attr('data-bind', '');
                if (this.attr.resetModel) {
                    this.$node.attr('data-bind-reset', '');
                }

                // TODO: Jquery deprecated
                this.on('changeData', function(e, attr, value) {
                    if (attr === 'value') {
                        this.trigger('valueChange', { value: value });
                    }
                });

                this.on('parentChange', function(e, o) {

                    var model = this.attr.model,
                        value = o.value;

                    if (model) {
                        // If model is a function get the value calling
                        // that function. Value of parent component is passed
                        if ($.isFunction(model)) {
                            value = model(value);

                        // If model is an object we take it as the value
                        } else if ($.isPlainObject(model) || $.isArray(model)) {
                            value = model;

                        // If model is a JSON path string
                        } else if (model.indexOf('$') === 0) {
                            value = jsonPath(value, model);

                        // If model is just a string take the property of the
                        // object with that name
                        } else {
                            value = value[model];
                        }
                    }

                    e.stopPropagation();
                    if( value !== undefined ){
                        this.$node.trigger('valueChange', {
                            value: value,
                            silent: true
                        });
                    }
                });

                this.on('valueChange', function(e, o) {
                    var value = o.value,
                        nestedDatabinds = this.$node
                            .find('[data-bind] [data-bind]');

                    if (e.target === this.node) {
                        this.$node.data('m2mValue', value);
                    }

                    this.$node.find('[data-bind]')
                        .not(nestedDatabinds)
                        .not('[data-bind-reset]').each(function() {
                        $(this).trigger('parentChange', { value: value });
                    });

                    if (o.silent || this.attr.resetModel) {
                        e.stopPropagation();
                    }
                });
            });
        }
    }
);

