define(
  [
    'components/component_manager'
  ],

  function(ComponentManager) {

    return ComponentManager.create('contextMenuPanel',
      ContextMenuPanel);

    function ContextMenuPanel() {

      this.defaultAttrs({
        items: []
      });

      this.after('initialize', function() {
        var header;

        if (this.attr.text) {
          header = $('<li>')
            .html(this.attr.text)
            .addClass('context-menu-title')
            .on('click', $.proxy(function() {
              this.trigger('back');
            }, this))
            .appendTo(this.$node);

          if (this.attr.hasBack) {
            header.addClass('back-link');
          }
          $('<li class="separator">').appendTo(this.$node);
        }

        $.each(this.attr.items, $.proxy(function(i, item) {
          var itemEl = $('<li>')
            .html(item.text)
            .appendTo(this.$node);

          if (item.text === '--') {
            itemEl.html('');
            itemEl.addClass('separator');
          } else {
            if (item.items) {
              itemEl.addClass('submenu');
            }

            if (item.component) {
              ComponentManager.get(item.component).attachTo(itemEl);
            }

            if (item.className) {
              itemEl.addClass(item.className);
            }

            if (item.selected){
              itemEl.addClass('selected');
            }

            if (item.disabled){
              itemEl.addClass('disabled');
            }

            itemEl.on('click', $.proxy(function() {
              this.trigger('selected', item);
            }, this));
          }

        }, this));
      });
    }
  }

);
