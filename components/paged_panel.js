define(
    [
        'components/component_manager',
        'components/mixin/container',
        'components/mixin/watch_resize'
    ],

    function(ComponentManager, ContainerMixin, WatchResize) {

        return ComponentManager.create('pagedPanel', PagedPanel, ContainerMixin, WatchResize);

        var self;

        function PagedPanel() {

            this.defaultAttrs({
                items: []
            });

            /*
            this.updateData = function() {
                this.attr.data($.proxy(function(data) {
                    this.$node.trigger('valueChange', { value: data });
                }, this));
            };
            */

            this.updateSize = function () {
                // Parent height
                var ph = self.$node.parent().height();
                debugger;
                for (var i = 0; i < self.$node.children().length; i++) {
                    el = self.$node.children().filter(
                        function (index) {
                            return index == i;
                        }
                    );

                    if (ph - el.height() >= 0) {
                        ph = ph - el.height();
                        el.css('display','');
                    }
                    else {
                        el.css('display','none');
                    }
                }
                
                //self.width = self.$node.width();
                //self.height= self.$node.height();
                //console.log ('P:' + ph + ' W:' + self.width + ' ,H: ' + self.height);

            }

            this.after('initialize', function() {

                self = this;
                this.width = 0;
                this.height = 0;
                this.cursor = 0;
                this.elem = null;

                this.$node.addClass('paged-content');
                //this.$nodeMap = $('<div>').addClass('paged-navigation').appendTo(this.$node);

                $(window).bind('resize', self.updateSize);
                
            });
        }
    }
);
