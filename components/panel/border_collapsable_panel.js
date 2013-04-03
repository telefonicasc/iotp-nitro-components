define(
  [
    'components/component_manager',
    'components/mixin/template'
  ],

  function(ComponentManager, Template) {

    return ComponentManager.create('BorderCollapsablePanel', Template, SlidingPanel);

    function SlidingPanel() {

      this.defaultAttrs({
        tpl: '<div class="toggle-button"></div>' +
             '<div class="panel-content"></div>',
        nodes: {
          'toggle': '.toggle-button',
          'content': '.panel-content' 
        }
      });

      this.after('initialize', function() {
        this.$node.addClass('border-panel');
  
        this.$toggle.on('click', $.proxy(function() {
          if (this.expanded) {
            this.trigger('collapse');
          } else {
            this.trigger('expand');
          }
        }, this));        

        this.on('expand', function() {
          this.$content.slideDown(400);
          this.expanded = true;
        });

        this.on('collapse', function() {
          this.$content.slideUp(400); 
          this.expanded = false;
        });

      });
    }
  }
);
