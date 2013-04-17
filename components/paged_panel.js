define(
    [
        'components/component_manager',
        'components/mixin/container'
    ],

    function(ComponentManager, ContainerMixin) {

        return ComponentManager.create('pagedPanel', PagedPanel, ContainerMixin);

        var self;
        
        function PagedPanel() {

            this.currenPage = 0;
            this.config = {
                insertionPoint: '.paged-content',
                navigationDiv: '.paged-navigation'
            };

            this.defaultAttrs({
                ordered: true,
                insertionPoint: '.paged-content',
                buttonsDiv: '.paged-navigation',
                pageDisplay: '.paged-navigation-display',
                items: []
            });

            this.updateSize = function () {
                // Parent height
                var ph = self.$node.parent().height();
                // Has some component been hided already?
                var hidedOne = false;
                // Parent node is the component items insertion point
                var parentNode = self.$node.find(self.attr.insertionPoint);
                
                for (var i = 0; i < parentNode.children().length; i++) {
                    el = parentNode.children().filter(
                        function (index) {
                            return index == i;
                        }
                    );

                    if (ph - el.height() >= 0 && !hidedOne) {
                        ph = ph - el.height();
                        el.css('display',''); /* Make sure element is displayed */
                    }
                    else {
                        el.css('display','none'); /* Don't display this component */
                        // If items are required to be displayed in order, this will be true.
                        hidedOne = self.attr.ordered;
                    }
                }
            }

            this.pageLeft = function () {
                console.log('paging left');
            }

            this.pageRight = function () {
                console.log('paging right');
            }

            this.after('initialize', function() {
                var src = '<div classs="paged-navigation"><button type="button"/></div>';
                self = this;
                this.$node.addClass('paged-panel');
                this.$nodeMap = $('<div>').addClass('paged-content').appendTo(this.$node);
                this.$nodeMap = $('<div>').addClass('paged-navigation').appendTo(this.$node);

                // Create navigation buttons and current page display
                var nav = this.$node.find('.paged-navigation');
                nav.append('<button type="button" class="paged-button-left"><</button>');
                nav.append('<div class="paged-navigation-display" style="display:inline">2/3</div>');
                nav.append('<button type="button" class="paged-button-right">></button>');

                // Adds button click events
                this.$node.find('.paged-button-left').click(this.pageLeft);
                this.$node.find('.paged-button-right').click(this.pageRight);

                // Bind update on window resize
                $(window).bind('resize', self.updateSize);
            });
        }
    }
);
