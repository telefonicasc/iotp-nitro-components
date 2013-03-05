define(
  [],

  function() {
    
    return WatchResize;

    function WatchResize() {

      this.after('initialize', function() {

        this.width = 0;
        this.height = 0;

        var updateSize = $.proxy(function() {
          this.width = this.$node.width();
          this.height = this.$node.height();
          this.trigger('resize', { width: this.width, height: this.height });
        }, this);

        var onRender = $.proxy(function() {
          $(window).on('resize', $.proxy(function() {
            updateSize();
          }, this));
          updateSize();
        }, this);

        this.on('resize', function(e) {
          e.stopPropagation(); 
        });

        this.on('render', function() {
          if (!this.rendered) {
            onRender();
          }
        });
      });
    }

  }
)
