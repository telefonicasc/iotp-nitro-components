define(
  [
    'components/component_manager',
    'libs/hogan/hogan'
  ],

  function(ComponentManager) {

    return TemplateMixin;

    function TemplateMixin() {

      this.defaultAttrs({
        updateOnValueChange: true
      });

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
            }
          });
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

