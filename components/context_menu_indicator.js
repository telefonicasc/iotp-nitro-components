define(
    [
        'components/component_manager',
        'components/context_menu'
    ],
    function(ComponentManager, ContextMenu) {

        return ComponentManager.create('contextMenuIndicator',
            ContextMenuIndicator);

        function ContextMenuIndicator() {

            this.defaultAttrs({

            });

            this.updatePosition = function() {
                var inPos = this.$node.offset();
                this.$cm.css({
                    top: inPos.top,
                    left: inPos.left + this.$node.width()
                });
            };

            this.after('initialize', function() {

                this.$node.addClass('context-menu-indicator');

                this.$cm = $('<div>').appendTo($('body'));
                ContextMenu.attachTo(this.$cm, this.attr.contextMenu);

                $(window).on('resize', $.proxy(function() {
                    if (this.$cm.is(':visible')) {
                        this.updatePosition();
                    }
                }, this));

                this.$node.click($.proxy(function() {
                    var inPos = this.$node.offset(),
                        indicatorWidth = this.$node.width(),
                        cmWidth = this.$cm.width(),
                        screenWidth = $(window).width(),
                        screenHeight = $(window).height();

                    // If it goes out of screen on the right
                    if (inPos.left + indicatorWidth + cmWidth > screenWidth) {
                        this.$cm.addClass('right-anchor');
                    }

                    this.updatePosition();

                    this.$cm.trigger('show');
                }, this));

                $(document).on('click', $.proxy(function(e) {
                    if (!this.$node.is(e.target) &&
                        !$.contains(this.$cm[0], e.target)) {
                        this.$cm.trigger('hide');
                    }
                }, this));
                $(document).on('keyup', $.proxy(function(e) {
                    if (e.keyCode === 27) {
                        this.$cm.trigger('hide');
                    }
                }, this));
            });
        }
    }
);
