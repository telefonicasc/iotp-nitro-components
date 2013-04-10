define(
    [
        'libs/jsonpath'
    ],

    function(jsonPath) {

        return DataBinding;

        function DataBinding() {

            this.defaultAttrs({
                model: ''
            });

            this.after('initialize', function() {

                this.$node.attr('data-bind', '');

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
                        } else if ($.isPlainObject(model)) {
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

                    this.$node.trigger('valueChange', {
                        value: value, silent: true
                    });
                });

                this.on('valueChange', function(e, o) {
                    var value = o.value,
                        nestedDatabinds = this.$node
                            .find('[data-bind] [data-bind]');

                    this.$node.find('[data-bind]')
                        .not(nestedDatabinds).each(function() {
                        $(this).trigger('parentChange', { value: value });
                    });

                    if (o.silent) {
                        e.stopPropagation();
                    }
                });
            });
        }
    }
);

