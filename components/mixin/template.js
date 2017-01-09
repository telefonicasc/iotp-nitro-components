/*
This is a mixin for generating the html content of the component from a
template. It uses **[Hogan.js](http://twitter.github.io/hogan.js/)** library (it is basically a lightweight
implementation of [moustache](http://mustache.github.io/) ).

It will use the template given in the *tpl* option, and you can use the rest
of options as variables in your template.

So if you define a component with this mixin like this:

```javascript
define(
    [
        'components/component_manager',
        'components/mixin/template'
    ],
    function(ComponentManager, Template) {
        function MyComponent() {
            this.defaultAttrs({
                tpl: '<div><span>{{field1}}</span>' +
                     '<span>{{field2}}</span></div>',
                nodes: {
                    span1: 'span:eq(0)',
                    span2: 'span:eq(1)'
                }
            });
        }
        return ComponentManager.create('MyComponent', MyComponent, Template);
    }
);
```

And you use it like this:

```javascript
$('#blabla').m2mMyComponent({
    field1: 'Manolo',
    field2: 'Pepe'
});
```

Will produce this html:

```html
<div id="blabla">
    <div>
         <span>Manolo</span>
         <span>Pepe</span>
    </div>
</div>
```

If you need redraw template with new values, trigger `'valueChange'` event and set object with `'value'` parameter:
```javascript
$('#blabla').trigger('valueChange', {
  value: {
    field1: 'Maria',
    //you can use filter function
    field2: function(data){
      return data.field1 + ' Magdalena'
    }
  }
});
```

@name Template
@option {Boolean} updateOnValueChange true Re-draw template when trigger `'valueChange'` envent
@option {Object} nodes undefined Object selector of elements, key is name of selector and value is jQuerySelector and you can atribute with '$' prefix: `this.$myNode`

@event valueChange {value:{}} If `updateOnValueChange` is true, use param.value for redraw template
*/
define(
  [
    'components/component_manager',
    'node_modules/hogan.js/dist/hogan-3.0.2'
  ],

  function(ComponentManager) {

    return TemplateMixin;

    function TemplateMixin() {

      this.defaultAttrs({
        updateOnValueChange: true
      });

      this.template = function(){};

      this.after('initialize', function() {
        if (this.attr.tpl) {
          this.compiledTpl = Hogan.compile(this.attr.tpl);
          this.$node.html(this.compiledTpl.render(this.attr));

          if (this.attr.components) {
            $.each(this.attr.components, $.proxy(function(selector, component) {
              ComponentManager.get(component).attachTo(selector);
            }, this));
          }

          this.on('valueChange', function(e, o) {
            var data = $.extend({ value: o.value }, this.attr);
            $.each(data, function(key, value) {
              if ($.isFunction(value)) {
                data[key] = value(o.value);
              }
            });
            if (this.attr.updateOnValueChange) {
              this.$node.html(this.compiledTpl.render(data));
              this.template();
            }
          });

          this.template();
        }

        if (this.attr.nodes) {
          $.each(this.attr.nodes, $.proxy(function(name, selector) {
            this['$' + name] = $(selector, this.$node);
          }, this));
        }
      });
    }
  }
);

