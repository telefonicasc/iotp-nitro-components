/**
Create wrapper for each data and create component with option

###Example
origin HTML
```html
<div id="list" ></div>
```

set component and change value
```javascript
$('#list').m2mRepeatContainer({
    item:{
        tpl: '<a href="#">{{name}}</a>'
    }
}):
$('#list').trigger('valueChange', {value:[
    {name:'one'},
    {name:'two'},
    {name:'three'}
]);
```

restult of change
```html
<div id="list" >
    <div class="repeat-container-item">
        <div><a href="#">une</a></div>
    </div>
    <div class="repeat-container-item">
        <div><a href="#">two</a></div>
    </div>
    <div class="repeat-container-item">
        <div><a href="#">three</a></div>
    </div>
</div>
```


  * @name RepeatContainer
  * @mixin DataBinding
  * @option {Object} item {component:'container'} Attrs for components that are repeated
  * @option {Function} filter fn() Filter value from 'valueChange' event
  *
  */
define(
    [
        'components/component_manager',
        'components/container',
        'components/mixin/data_binding'
    ],

    function(ComponentManager, Container, DataBinding) {

        function RepeatContainer() {

            this.defaultAttrs({
                item: { component: 'container' },
                //, filter: function(element, index){ return true }
                emptyContent: ''
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
                        if (this.attr.filter &&
                                $.isFunction(this.attr.filter)) {
                            o.value = $.grep(o.value, this.attr.filter);
                        }
                        this.updateContent(o.value);
                    } else {
                        this.$node.empty();
                        $('<div>').addClass('repeat-container-empty')
                            .html(this.attr.emptyContent)
                            .appendTo(this.$node);
                    }
                });
            });
        }

        return ComponentManager.create('RepeatContainer',
            RepeatContainer, DataBinding);
    }
);
