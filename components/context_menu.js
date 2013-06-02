define(
  [
    'components/component_manager',
    'components/context_menu_panel'
  ],

  function(ComponentManager, ContextMenuPanel) {

    return ComponentManager.create('contextMenu',
      ContextMenu);

    /**
     * Contextual menu.
     *
     * Options:
     *
     *   - `items` List of items to show in this context menu
     *   - `onSelect` Function that gets called when an item is selected
     *
     * Events:
     *
     *   - `show` Shows the context menu.
     *   - `hide` Hide the context menu.
     *   - `back` Triggered when the user clicks on a go back link
     *   - `selected` Triggered when the user selects one of the options
     *
     */
    function ContextMenu() {

      var panelPath = [];

      this.defaultAttrs({
        items: []
      });

      this.after('initialize', function() {
        this.panelWrapper = $('<div>').addClass('context-menu-wrapper');
        this.panelContainer = $('<div>').addClass('context-menu-container');

        this.$node.addClass('context-menu');
        this.$node.append($('<div class="tooltip-arrow">'));
        this.panelWrapper.append(this.panelContainer);
        this.$node.append(this.panelWrapper);


        this.on('show', function(e) {
          panelPath = [];
          this.panelContainer.find('ul').remove();
          this.$node.show();
          this.pushPanel(this.attr);
          this.panelWrapper.css({ height: 'auto' });
          e.stopPropagation();
        });

        this.on('hide', function(e) {
          this.$node.hide();
          e.stopPropagation();
        });

        this.on('back', function(e) {
          this.popPanel();
          e.stopPropagation();
        });

        this.on('selected', function(e, item) {
          if (item.items) {
            this.pushPanel(item);
          } else if (this.attr.onSelect) {
            this.attr.onSelect(item);
            this.$node.hide();
          }
        });

        this.pushPanel(this.attr);
      });

      this.pushPanel = function(panel) {
        var panelEl = $('<ul>');
        ContextMenuPanel.attachTo(panelEl,
          $.extend({ hasBack: panelPath.length > 0 }, panel));

        if (panelPath.length) {
          this.transitionPanel(panelEl, this.panelContainer.find('ul'));
        } else {
          this.panelContainer.append(panelEl);
        }

        panelPath.push(panel);
      };

      this.popPanel = function() {
        var panelEl = $('<ul>');
        panelPath.pop();
        ContextMenuPanel.attachTo(panelEl, panelPath[panelPath.length - 1]);
        this.transitionPanel(panelEl, this.panelContainer.find('ul'), true);
      };

      this.transitionPanel = function(newPanel, oldPanel, left) {
        this.panelWrapper.css({ height: this.panelWrapper.height() });
        if (left) {
          newPanel.insertBefore(oldPanel);
          this.panelContainer.css({ marginLeft: 0 - newPanel.width() });
        } else {
          newPanel.insertAfter(oldPanel);
        }
        this.panelContainer.css({
          width: 10000
        });
        newHeight = this.$node.height();
        this.panelContainer.animate({
          marginLeft: (left ? 0 : 0 - this.panelWrapper.width())
        }, {
          complete: $.proxy(function() {
            oldPanel.remove();
            this.panelContainer.css({
              width: 'auto',
              marginLeft: 0
            });
            this.panelWrapper.animate({
              height: this.panelContainer.height()
            }, 250);
          }, this)
        });
      };
    }
  }
);
