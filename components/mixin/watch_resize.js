/*
Update size, width and height, when trigger `'resize'` event of window

@name WatchResize
*/
define(
  [],

  function() {

    return WatchResize;

    function WatchResize() {

      this.after('initialize', function() {

        this.width = this.$node.width();
        this.height = this.$node.height();

        var onRender = $.proxy(function() {
          $(window).on('resize', $.proxy(function() {
            this.updateSize();
          }, this));
          this.updateSize();
        }, this);

        this.on('resize', function(e) {
          e.stopPropagation();
        });

        this.on('render', function() {
          if (!this.rendered) {
            onRender();
          }
        });

        this.on('updateSize', function() {
            this.updateSize();
        });

      });

      this.updateSize = function() {
          this.width = this.$node.width();
          this.height = this.$node.height();
          this.trigger('resize', { width: this.width, height: this.height });
      };
    }

  }
);
