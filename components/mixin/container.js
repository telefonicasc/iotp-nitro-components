define(
  [
    'components/component_manager'
  ],

  function(ComponentManager) {

    return ContainerMixin;

    function ContainerMixin() {

      this.renderItems = function() {
        $.each(this.attr.items, $.proxy(function(i, item) {
          var newNode = $('<' + (item.tag || 'div') + '>');
          
          if (item.className) {
            newNode.addClass(item.className);
          }

          if (item.html) {            
            newNode.html(item.html);
          }

          if (item.style) {
            newNode.css(item.style);
          }

          if ($.isArray(item.component)) {
            $.each(item.component, $.proxy(function(i, c) {
              ComponentManager.get(c).attachTo(newNode, item);
            }, this));
          } else if (item.component) {
            ComponentManager.get(item.component).attachTo(newNode, item);
          } else if (item.items) {
            ComponentManager.get('container').attachTo(newNode, item);            
          }

          if (this.attr.insertionPoint) {
            newNode.appendTo($(this.attr.insertionPoint, this.$node));
          } else {
            newNode.appendTo(this.$node);
          }

          // Prevent render event bubbling to avoid infinit loop
          newNode.on('render', function() {            
            return false;
          });

          if (this.rendered) {
            newNode.trigger('render');
          } else {
            this.on('render', function() {
              newNode.trigger('render');
              return false;
            });
          }
        }, this));
      };

      this.after('initialize', function() {
        this.renderItems();  
        
        this.on('render', function() {
          this.rendered = true;
        });
  
        if (jQuery.contains(document.documentElement, this.node)) {
          this.trigger('render');
        }        
      });
    }
  }
);
