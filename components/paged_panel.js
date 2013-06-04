define(
    [
        'components/component_manager',
        'components/mixin/container'
    ],

    function(ComponentManager, ContainerMixin) {

        return ComponentManager.create('pagedPanel', PagedPanel, ContainerMixin);

        function PagedPanel() {

            this.defaultAttrs({
                insertionPoint: '.fixed',                
                pagerLocator: '.paged-navigation',
                pageDisplay: '.paged-navigation-display',
                buttonLeftClass: '.paged-button-left',
                buttonRightClass: '.paged-button-right',
                pageLeftLocator: '.page-left',
                pageRightLocator: '.page-right',
                selectNavigation : '.navigation',
                selectPageLeft: '.page-left',
                selectPageRight: '.page-right',
                selectFixed: '.fixed',
                selectPages: '.panel-page',
                extraHeaderGap: 25,
                alwaysVisible: [],
                items: []
            });
            
            this.getPageCount = function () {
                var pagesWithContent = 0;
                var add = function (k,v) {
                    if ($(v).children().length !== 0) pagesWithContent += 1;
                };
                this.select('selectPages').each(add);
                return pagesWithContent;
            };
            
            this.selectPage = function (pageNumber) {
                var currentPage = parseInt(this.select('selectNavigation').attr('page-marker'));
                // next page is there?
                var pageSelect = 'selectPage' + (pageNumber);
                // get the page
                var page = this.select(pageSelect);
                // is it there?
                if (typeof page !== 'undefined') {
                    if (page.children().length !== 0) {
                        // update page marker
                        this.setPageMarker(pageNumber);
                        // hide current page
                        this.hidePage(currentPage);
                        // show page
                        this.showPage(pageNumber);
                    }
                }
                // update page marker
                this.select('selectNavigation').attr('page-marker',pageNumber);
                // update pager
                this.updatePager();
            };
            
            this.movePage = function (displacement) {
                console.log('Moving: ' + displacement);
                var currentPage = parseInt(this.select('selectNavigation').attr('page-marker'));
                var pageCount = this.getPageCount();
                if (currentPage + displacement < 0) return;
                if (currentPage + displacement >= pageCount) return;
                
                // next page is there?
                var pageSelect = 'selectPage' + (currentPage + displacement);
                // get the page
                var page = this.select(pageSelect);
                // is it there?
                if (typeof page !== 'undefined') {
                    if (page.children().length !== 0) {
                        // update page marker
                        this.setPageMarker(currentPage + displacement);
                        // hide current page
                        this.hidePage(currentPage);
                        // show page
                        this.showPage(currentPage + displacement);
                    }
                }
                // update page marker
                this.select('selectNavigation').attr('page-marker',currentPage + displacement);
                // update pager
                this.updatePager();
            };
            
            this.hidePage = function (pageNumber) {
                var pageSelector = 'selectPage' + pageNumber;
                this.select(pageSelector).slideUp();  
            };
            
            this.showPage = function (pageNumber) {
                var pageSelector = 'selectPage' + pageNumber;
                this.select(pageSelector).slideDown();
            };

            this.updatePager = function () {
                // get current page
                var currentPage = parseInt(this.select('selectNavigation').attr('page-marker'));
                // Pages start at 1, but selectors at 0, so add 1 to currentPage
                currentPage += 1;
                // how many pages have content?
                var pagesWithContent = this.getPageCount();
                // Hide the pager if pagesWithContent = 0
                if (pagesWithContent <= 1) {
                    this.select('selectNavigation').hide();
                }
                else {
                    if (currentPage === 0) currentPage = 1;
                    var text = currentPage + '/' + pagesWithContent;
//                    this.select('selectNavigation').children('.navigation-display').html(text);
                    this.select('selectNavigation').show();
                    this.select('selectNavigation').children('.page-chooser').each( function (k,v) {
                        if ($(v).html() == currentPage) $(v).addClass('selected');
                        else $(v).removeClass('selected');
                        if (parseInt(k) >= pagesWithContent) $(v).hide();
                        else $(v).show();
                    });
                }
                // Mark current page
                
            };

            // Careful, seems to load things wrong when there is another paged-panel
            this.loadItems = function (items) {
                var self = this;
                $.each(items, $.proxy(function (i, item) {
                    self.attr.items.push(item);
                })); 
                self.renderItems();
            };
            
            this.setPageMarker = function (number) {
                this.select('selectNavigation').attr('page-marker', number);
            };
            
            this.update = function () {
                var self = this;
                // (move all to fixed)
                $.each(this.select('selectPages').siblings('.panel-page'),
                    function (k,v) {
                        $(v).children().appendTo(self.select('selectFixed'));
                    }
                );
                
                // Max height
                var h = this.$node.height();
                h -= this.attr.extraHeaderGap;
                // Substract pager height if visible
                var pager = this.select('selectNavigation');
                if (pager.is(':visible')) {
                    h -= pager.height();
                }
                // Remaining height in page
                var pageH = 0;
                // Current page selector
                var curPage = 0;
                // What page am I right now
                var pageMarker = parseInt(this.select('selectNavigation').attr('page-marker'));
                
                var alwaysVisible = this.attr.alwaysVisible;
                
                var move = function (k,v) {
                    var compH = $(v).height();
                    self.attr['selectPage'+curPage] = '.page-' + curPage;
                    if (k in alwaysVisible) {
                        h -= compH;
                        pageH = h;
                    }
                    else {
                        // todo: first component must always fit
                        if (pageH - compH >= 0) {
                            pageH -= compH;
                            // move component to page 'curPage'
                            $(v).appendTo(self.select('selectPage'+curPage));
                        }
                        else {
                            // component doesn't fit in this page
                            curPage += 1;
                            self.attr['selectPage'+curPage] = '.page-' + curPage;
                            pageH = h - compH;
                            $(v).appendTo(self.select('selectPage'+curPage));
                        }
                    }
                    if (pageMarker === curPage) self.showPage(curPage);
                    else self.hidePage(curPage);
                };
                
                $.each(this.select('selectFixed').children(), move);
                
                // Current page has no content now!
                if (pageMarker > curPage) {
                    this.hidePage(pageMarker-1);
                    this.showPage(curPage-1);
                    this.select('selectNavigation').attr('page-marker',curPage);
                }
                this.updatePager();
            };

            this.after('initialize', function() {
                
                // Create component DOM template
                var template = '<div class="fit"><div class="fixed"></div>';
                
                // I need at most as many pages as items, minus the ones to be seen already
                var pagesToCreate = this.attr.items.length - this.attr.alwaysVisible.length;

                // There is always at least on page created
                for (var i = 0; i <= pagesToCreate; i++) {
                    template += '<div class="panel-page page-' + i + '"></div>';
                }
                
                template += '<div class="navigation"></div></div>';
                
                this.$node.addClass('paged-panel');
                
                this.$nodeMap = $(template).appendTo(this.$node);
                
                var self = this;
                var left = $('<div>').addClass('page-left');
                var right = $('<div>').addClass('page-right');

                // Create navigation buttons and current page display
                var nav = this.select('selectNavigation');

                nav.append(left);
                for (var i = 0; i <= pagesToCreate; i++) {
                    var pageChooser = $('<div>').addClass('page-chooser').html(i+1);
                    var fn = function () {
                        self.selectPage(parseInt($(this).html())-1);
                    };
                    
                    pageChooser.on('click', fn);
                    nav.append(pageChooser);
                }
                
                nav.append('</div>');
                
                nav.append(right);
                
                // add click triggers
                this.select('selectPageLeft').on('click', function () { self.movePage(-1); });
                this.select('selectPageRight').on('click', function () { self.movePage(+1); });
                
                // Add page marker at navigation
                this.select('selectNavigation').attr('page-marker','0');
               
                this.updatePager();
                
                // Update event handler
                this.on('update-view', function () {
                    this.update();
                    return false;
                });

                this.on('load-items', function (event, items) {
                    if (items !== null) {
                        this.loadItems(items);
                    }
                    else console.error('Required parameter: items []');
                });
            });
        }
    }
);
