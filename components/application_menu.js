define(
  [
    'components/component_manager'
  ],

  function(ComponentManager) {

    ComponentManager.create('ApplicationMenu', ApplicationMenu);

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
              this.trigger('expand');
          }
        }, this));

        this.appContent.on('click', $.proxy(function() {
          this.trigger('collapse');
        }, this));

        this.on('expand', function(e, options) {
          var w = this.appContent.width();
          this.appContent.css('width', w);
          this.appContent.animate({
            left: this.attr.expandedWidth
          }, this.attr.expandDuration);
          this.expanded = true;
        });

        this.on('collapse', function(e, options) {
          this.appContent.animate({ left: this.attr.collapsedWidth },
            this.attr.collapseDuration,
            function(){
              container.trigger('collapsed');
              container.css('width', 'auto');
            });

          this.expanded = false;
        });
      });
    }
  }
);
