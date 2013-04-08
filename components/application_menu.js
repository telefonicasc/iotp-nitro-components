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
        collapsedWidth: 55
      });

      this.after('initialize', function() {

        this.$node.addClass('application-menu fit');

        this.appContent = $(this.attr.applicationContent);

        this.$node.on('click', $.proxy(function() {
          this.trigger('expand');
        }, this));

        this.appContent.on('click', $.proxy(function() {
          this.trigger('collapse');
        }, this));

        this.on('expand', function(e, options) {
          this.appContent.animate({
            left: this.attr.expandedWidth
          }, this.attr.expandDuration);
        });

        this.on('collapse', function(e, options) {
          this.appContent.animate({
            left: this.attr.collapsedWidth
          }, this.attr.collapseDuration);
        });
      });
    }
  }
);
