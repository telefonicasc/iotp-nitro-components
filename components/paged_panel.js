define(
    [
        'components/component_manager',
        'components/mixin/container'
    ],

    function(ComponentManager, ContainerMixin) {

        return ComponentManager.create('pagedPanel', PagedPanel, ContainerMixin);

        function PagedPanel() {

            this.currentPage = 1;
            this.pageCount = 1;
            this.pagerVisible = false;
            this.defaultAttrs({
                header: '',
                insertionPoint: '.paged-content',
                pagerLocator: '.paged-navigation',
                pageDisplay: '.paged-navigation-display',
                buttonLeftClass: '.paged-button-left',
                buttonRightClass: '.paged-button-right',
                ID: '',
                headerGap: 50,
                items: [],
                triggers: []
            });

            this.updateView = function () {
                var self = this;
                //console.log('Updating view for component: ' + self.attr.ID);
                // Restart pageCount
                self.pageCount = 1;
                // Page scanning now
                var page = 1;                
                // Parent height
                //var ph = self.$node.parent().height();
                var ph = $(window).height() - self.attr.headerGap;
                // Reduce parent height by the navigation bar height
                ph = ph - self.$node.find(self.attr.pagerLocator).height()
                // Initial height
                var initialPH = ph;
                // Parent node is the component items insertion point
                //var parentNode = self.$node.find(self.attr.insertionPoint);
                var parentNode = self.$node.find(self.attr.insertionPoint);
                // Pager is not show initially
                self.showPager(false);
                // Hide/Show components
                for (var i = 0; i < parentNode.children().length; i++) {

                    // Get children with index 'i'
                    el = parentNode.children().filter(
                        function (index) {
                            return index == i;
                        }
                    );

                    if (ph - el.height() >= 0 || i == 0) {

                        ph = ph - el.height();
                        if (self.currentPage == page) {
                            el.css('display',''); /* Make sure element is displayed */
                        }
                        else {
                            // component fits, but I am not looking at this page
                            el.css('display','none');
                        }
                    }
                    else {
                        // There is more than one page, show pager
                        self.showPager(true);
                        // change page
                        page = page + 1;
                        self.pageCount = page;
                        // update ph
                        ph = initialPH - el.height(); // what if a component doesn't fit anyway
                        if (self.currentPage == page) {
                            el.css('display','');
                        }
                        else {
                            el.css('display','none'); /* Don't display this component */
                        }
                    }
                }
                self.updatePager();
            }

            this.showPager = function (show) {
                var self = this;
                if (show) {
                    self.$node.find(self.attr.pagerLocator).css('display','');
                }
                else {
                    self.$node.find(self.attr.pagerLocator).css('display','none');
                }
            }

            this.pageLeft = function () {
                var self = this;
                if (self.currentPage > 1) {
                    self.currentPage = self.currentPage - 1; 
                }
                self.updateView();
            }

            this.pageRight = function () {
                var self = this;
                if (self.currentPage < self.pageCount) {
                    self.currentPage = self.currentPage + 1;
                }
                self.updateView();
            }

            this.updatePager = function () {
                var self = this;
                var element = self.$node.find(self.attr.pageDisplay);
                if (self.pageCount == 1) {
                    element.html('');
                }
                else {
                    element.html(self.currentPage + '/' + self.pageCount);
                }

                // Current page has dissapeared?
                if (self.currentPage > self.pageCount) {
                    self.currentPage = 1;
                    self.updateView();
                }
            }

            // Do not use, seems to load thigs wrong when there is another paged-panel
            this.loadItems = function (items) {
                var self = this;
                $.each(items, $.proxy(function (i, item) {
                    self.attr.items.push(item);
                })); 
                self.renderItems();
            }

            this.after('initialize', function() {
                var self = this;
                this.$node.addClass('paged-panel');
                //this.$node.addClass(self.attr.ID);
                this.$node.attr('id',self.attr.ID);
                this.$nodeMap = $('<div>').addClass('paged-header')
                    .html(self.attr.header).appendTo(this.$node);
                //this.$nodeMap = $('<div>').addClass('paged-content').appendTo(this.$node);
                this.$nodeMap = $('<div>').addClass(self.attr.insertionPoint.substring(1)).appendTo(this.$node);
                this.$nodeMap = $('<div>').addClass('paged-navigation').appendTo(this.$node);

                // Create navigation buttons and current page display
                var nav = this.$node.find('.paged-navigation');
                nav.append('<button type="button" class="paged-button-left"><</button>');
                nav.append('<div class="paged-navigation-display" style="display:inline"></div>');
                nav.append('<button type="button" class="paged-button-right">></button>');

                // Adds button click events
                this.$node.find('.paged-button-left').click(this.pageLeft);
                this.$node.find('.paged-button-right').click(this.pageRight);
                
                // Bind update on window resize
                //$(window).bind('resize', self.updateView);
                
                // Update event handler
                this.on('update-view', function () {
                    self.updateView();
                    return false;
                });

                this.on('load-items', function (event, items) {
                    if (items != null) {
                        self.loadItems(items);
                    }
                    else console.error('Required parameter: items []');
                });

                this.on('remove-component', function (event, comp) {
                    console.error("TODO!: paged_panel:remove-component");
                });
                
                // Load dynamic triggers
                /*
                for (var i = 0; i < self.attr.triggers.length; i++) {
                    console.log('loading dynamic trigger');
                    self.on(self.attr.triggers[i].name, self.attr.triggers[i].task);
                }
                */
            });
        }
    }
);
