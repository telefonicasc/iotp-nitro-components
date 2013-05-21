define(
    [
        'components/component_manager',
        'components/mixin/container'
    ],

    function(ComponentManager, ContainerMixin) {

        return ComponentManager.create('pagedPanel', PagedPanel, ContainerMixin);

        function PagedPanel() {

//            this.currentPage = 1;
//            this.pageCount = 1;
//            this.pagerVisible = false;
            this.defaultAttrs({
                header: '',
                insertionPoint: '.paged-content',
                pagerLocator: '.paged-navigation',
                pageDisplay: '.paged-navigation-display',
                buttonLeftClass: '.paged-button-left',
                buttonRightClass: '.paged-button-right',
                pageLeftLocator: '.page-left',
                pageRightLocator: '.page-right',
                ID: '',
                headerGap: 50,
                items: []
            });

            this.updateView = function () {
                // Restart pageCount
                var pageCount = 1;
                // Page scanning now
                var page = 1;
                // current page
                var currentPage = parseInt($(this.$node[0]).attr('page'));
                // Parent height
                //var ph = self.$node.parent().height();
                var ph = $(window).height() - this.attr.headerGap;
                // Reduce parent height by the navigation bar height
                ph = ph - this.$node.find(this.attr.pagerLocator).height();
                // Initial height
                var initialPH = ph;
                // Parent node is the component items insertion point
                //var parentNode = self.$node.find(self.attr.insertionPoint);
                var parentNode = this.$node.find(this.attr.insertionPoint);
                // Pager is not show initially
                this.showPager(false);
                // Hide/Show components
                for (var i = 0; i < parentNode.children().length; i++) {

                    // Get children with index 'i'
                    el = parentNode.children().filter(
                        function (index) {
                            return index === i;
                        }
                    );

                    if (ph - el.height() >= 0 || i === 0) {

                        ph = ph - el.height();
                        if (currentPage === page || this.attr.allwaysVisible.indexOf(i) !== -1) {
                            el.css('display',''); /* Make sure element is displayed */
                        }
                        else {
                            // component fits, but I am not looking at this page
                            el.css('display','none');
                        }
                    }
                    else {
                        // There is more than one page, show pager
                        this.showPager(true);
                        // change page
                        page = page + 1;
                        pageCount = page;
                        // update ph
                        ph = initialPH - el.height(); // what if a component doesn't fit anyway
                        if (currentPage === page) {
                            el.css('display','');
                        }
                        else {
                            el.css('display','none'); /* Don't display this component */
                        }
                    }
                }
                // Update values
                $(this.$node[0]).attr('page',currentPage);
                $(this.$node[0]).attr('pageCount',pageCount);
                // Update pager
                this.updatePager();
            };

            this.showPager = function (show) {
                if (show) {
                    this.$node.find(this.attr.pagerLocator).css('display','');
                }
                else {
                    this.$node.find(this.attr.pagerLocator).css('display','none');
                }
            };

            this.pageLeft = function () {
                
                var currentPage = parseInt($(this.$node[0]).attr('page'));
//                var pageCount = parseInt($(this.$node[0]).attr('pageCount'));
                if (currentPage > 1) {
                    currentPage = currentPage - 1; 
                }
                $(this.$node[0]).attr('page',currentPage);
                this.updateView();                
            };

            this.pageRight = function () {
                
                var currentPage = parseInt($(this.$node[0]).attr('page'));
                var pageCount = parseInt($(this.$node[0]).attr('pageCount'));
                if (currentPage < pageCount) {
                    currentPage = currentPage + 1;
                }
                $(this.$node[0]).attr('page',currentPage);
                this.updateView();
            };

            this.updatePager = function () {
                var element = this.$node.find(this.attr.pageDisplay);
                var currentPage = parseInt($(this.$node[0]).attr('page'));
                var pageCount = parseInt($(this.$node[0]).attr('pageCount'));
                if (pageCount === 1) {
                    element.html('');
                }
                else {
                    element.html(currentPage + '/' + pageCount);
                }

                // Current page has dissapeared?
                if (currentPage > pageCount) {
                    currentPage = 1;
                    $(this.$node[0]).attr('page',currentPage);
                    this.updateView();
                }
            };

            // Do not use, seems to load thigs wrong when there is another paged-panel
            this.loadItems = function (items) {
                var self = this;
                $.each(items, $.proxy(function (i, item) {
                    self.attr.items.push(item);
                })); 
                self.renderItems();
            };

            this.after('initialize', function() {
                this.$node.addClass('paged-panel');
                this.$node.attr('id',this.attr.ID);
                this.$node.attr('page','1');
                this.$node.attr('pageCount','1');
                
                if (this.attr.header !== '') {
                    this.$nodeMap = $('<div>').addClass('paged-header').html(this.attr.header).appendTo(this.$node);
                }

                this.$nodeMap = $('<div>').addClass(this.attr.insertionPoint.substring(1)).appendTo(this.$node);
                
                var left = $('<div>').addClass('page-left');
                var right = $('<div>').addClass('page-right');
                
                this.$nodeMap = $('<div>').addClass('paged-navigation').appendTo(this.$node);

                // Create navigation buttons and current page display
                var nav = this.$node.find('.paged-navigation');

                nav.append(left);
                nav.append('<div class="paged-navigation-display" style="display:inline"></div>');
                nav.append(right);
                
                // add click triggers
                var self = this;
                this.select('pageLeftLocator').on('click', function () { self.pageLeft(); });
                this.select('pageRightLocator').on('click', function () { self.pageRight(); });
                
                // Update event handler
                this.on('update-view', function () {
                    this.updateView();
                    return false;
                });

                this.on('load-items', function (event, items) {
                    if (items !== null) {
                        this.loadItems(items);
                    }
                    else console.error('Required parameter: items []');
                });

                this.on('remove-component', function (event, comp) {
                    console.error("TODO!: paged_panel:remove-component");
                });                

            });
        }
    }
);
