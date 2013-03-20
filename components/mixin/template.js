define(
  [
    'components/component_manager'
  ],

  function(ComponentManager) {

    return TemplateMixin;

    function TemplateMixin() {

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
            this.$node.html(this.compiledTpl.render(data));
          });
        }
      });
    }
  }
);
  
