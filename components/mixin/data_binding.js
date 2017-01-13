/*
This mixin is used to bind data to components. You can pass a data object
to a parent component, and use this mixin to automatically update its children.

You can set the *model* property in each children if you want to select some
part of the data object passed to the parent.

This is best explained with an example. Imagine we have a panel component.

```javascript
define (
    [
        'components/component_manager',
        'components/mixin/data_binding'
    ],
    function (ComponentManager, DataBinding) {
        function Panel() {
        }
        return ComponentManager.create('Panel', Panel, DataBinding);
    }
);
```

And we have a subpanel component:

```javascript
define (
    [
        'components/component_manager',
        'components/mixin/data_binding'
    ],
    function (ComponentManager, DataBinding) {
        function SubPanel() {
            this.on('valueChange', function(e, o) {
                // The value is passed inside o
                this.$node.html(o.value);
            });
        }
        return ComponentManager.create('SubPanel', SubPanel, DataBinding);
    }
)
```

We have this html:

```html
<div id="panel">
    <div id="subpanel1"></div>
    <div id="subpanel2"></div>
</div>
```
We initialize components for each of these panels:

```javascript
$('#panel').m2mPanel();
$('#subpanel1').m2mSubPanel({ model: 'field1' });
$('#subpanel2').m2mSubPanel({ model: 'field2' });
```

We are setting *model* field1 for subpanel1 and *model* field2 for subpanel2.
So if we set the data for the parent panel like this:

```javascript
$('#panel').trigger('valueChange', {
    value: { field1: 'Manolo', field2: 'Pepe' }
});
```

It will change the value for subpanel1 to Manolo, and the value for subpanel2
will be Pepe, and will change the html to:

```html
<div id="panel">
    <div id="subpanel1">Manolo</div>
    <div id="subpanel2">Pepe</div>
</div>
```

DataBinding

option {Boolean} resetModel false
option {String} model empty As in the example above. It will pick the property with that name from the parent value.
option {Function} model empty The function will be executed to get the value for the component.
    The parent value will be passed as parameter.
option {jsonPath} model empty String to select the data from the parent value.
option {Object} model empty This will be the value of the component,
    no matter what the value of the parent component is.
*/
define(
    [
        'node_modules/jsonpath/jsonpath'
    ],

    function(jsonPath) {

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
                            value = jsonPath.query(value, model);

                        // If model is just a string take the property of the
                        // object with that name
                        } else {
                            value = value[model];
                        }
                    }

                    e.stopPropagation();
                    if (value !== undefined) {
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

        return DataBinding;
    }
);

