define(
  [
    'components/component_manager'
  ],

  function(ComponentManager) {

    function ApplicationMenu() {

      this.defaultAttrs({
        expandDuration: 300,
        collapseDuration: 300,
        expandedWidth: 300,
        collapsedWidth: 55,
        tooltipSelector: 'li',
        tooltipContent: function(el) {
            return $(el).find('span').html();
        }
      });

      this.after('initialize', function() {

        this.$node.addClass('application-menu fit');

        var container = this.appContent = $(this.attr.applicationContent),
            tooltipSelector = this.attr.tooltipSelector;

        if (tooltipSelector) {
            this.$tooltip = $('<div>')
                            .addClass('tooltip application-menu-tooltip')
                            .appendTo($('body'));
            this.$tooltip.hide();

            this.$node.on('mouseover', tooltipSelector, $.proxy(function(e) {
                var position = $(e.currentTarget).offset();
                if (!this.expanded) {
                    position.left += this.attr.collapsedWidth;
                    this.$tooltip.html(this.attr.tooltipContent(e.currentTarget));
                    this.$tooltip.css(position);
                    this.$tooltip.show();
                }
            }, this));

            this.$node.on('mouseout', tooltipSelector, $.proxy(function(e) {
                this.$tooltip.hide();
            }, this));
        }

        this.$node.on('click', $.proxy(function(e) {
          if (e.target === this.node) {
              this.trigger(this.expanded ? 'collapse' : 'expand');
          }
        }, this));

        this.on('expand', function(e, options) {
          this.appContent.css('width', 'auto');
          this.appContent.animate({ left: this.attr.expandedWidth },
            this.attr.expandDuration,
            function(){
              if (!container.collapsed) {
                container.trigger('toggle', true);
              }
              container.collapsed = true;
            });
          this.expanded = true;
        });

        this.on('collapse', function(e, options) {
          this.appContent.animate({ left: this.attr.collapsedWidth },
            this.attr.collapseDuration,
            function(){
              container.trigger('collapsed');
              container.css('width', 'auto');
              if (container.collapsed) {
                container.trigger('toggle', false);
              }
              container.collapsed = false;
            });
          this.expanded = false;
        });

        this.on('remove', function() {
            if (this.$tooltip) {
                this.$tooltip.remove();
            }
        });
      });
    }

    return ComponentManager.create('ApplicationMenu', ApplicationMenu);
  }
);
