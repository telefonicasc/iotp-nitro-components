define(
    [
        'components/component_manager',
        'components/mixin/template', 
        'components/mixin/container'
    ],

    function(ComponentManager, Template, Container) {

        return ComponentManager.create('pagedContainer', Template, Container, Component);

        function Component() {

            this.defaultAttrs({
                selectElements: '.elements',
                selectNavigation: '.navigation',
                selectPageLeft: '.pageLeft',
                selectPageRight: '.pageRight',
                selectContainer: '.paged-container',
                selectPageChooser: '.page-chooser',
                triggers: {
                    update: 'update'
                },
                private: {
                    currentPage: 1,
                    pageCount: 0,
                    available: 0
                },
                insertionPoint: '.elements',
                tpl: '<div class="fit"><div class="elements"/>'
                    + '<div class="navigation"/></div>',
                alwaysVisible: [],
                items: []
            });
            
            this.assignPages = function () {
                var cfg = this.attr.private;
                var elements = this.select('selectElements').children();
                cfg.pageCount = 0;
                
                // Calculate available space (fit div height - navigation bar height)
                var nav = this.select('selectNavigation');
                cfg.available = this.select('selectElements').parent().height() - nav.height();
                
                var remaining = cfg.available;
                var page = 1;
                
                var getRequiredHeight = function (v) {
                    return $(v).height();
                };
                
                // Assign a page to each one
                var alwaysVisible = this.attr.alwaysVisible;
                
                $.each(elements, function (k,v) {
                    // Does this component fit?
                    var requiredHeight = getRequiredHeight(v);
                    
                    if (parseInt(k) in alwaysVisible) {
                        remaining -= requiredHeight;
                        cfg.available = remaining;
                        $(v).attr('assigned-page',0);
                    }
                    else {
                        if (requiredHeight <= remaining) {
                            remaining -= requiredHeight;
                        }
                        else {
                            remaining = cfg.available - requiredHeight;
                            page += 1;
                        }
                        // Set element page
                        $(v).attr('assigned-page',page);
                    }
                });
                // Update page count
                cfg.pageCount = page;
                // Update currentPage
                if (cfg.currentPage > cfg.pageCount) {
                    cfg.currentPage = cfg.pageCount +1;
                }
            };
            
            this.updateVisualization = function () {
                var currentPage = this.attr.private.currentPage;
                var elements = this.select('selectElements').children();
                // First hide, then show
                $.each(elements, function(k,v){
                    var assignedPage = parseInt($(v).attr('assigned-page'));
                    if (assignedPage === currentPage) $(v).show();
                    else if (assignedPage === 0) $(v).show();
                    else $(v).hide();
                });
                
                if (this.attr.private.pageCount < 1) {
                    this.select('selectNavigation').hide();
                }
                else {
                    this.select('selectNavigation').show();
                    // hide unnecesary page numbers
                    var pages = this.select('selectPageChooser');
                    var pageCount = this.attr.private.pageCount;
                    $.each(pages, function (k,v) {
                        var i = parseInt($(v).html());
                        if (i > pageCount) $(v).hide();
                        if (i === currentPage) $(v).addClass('selected');
                        else $(v).removeClass('selected');
                    });
                }
            };
            
            this.changeToPage = function (pageNumber, isDisplacement) {
                if (typeof isDisplacement === 'undefined') isDisplacement = false;
                if (isDisplacement === null) isDisplacement = false;
                
                var currentPage = this.attr.private.currentPage;
                var pageCount = this.attr.private.pageCount;
                
                if (isDisplacement) {
                    pageNumber = currentPage + pageNumber;
                }
                if (pageNumber < 1) pageNumber = 1;
                if (pageNumber > pageCount) pageNumber = currentPage;
                if (typeof pageNumber === 'string') pageNumber = parseInt(pageNumber);

                // Update visual
                if (pageNumber !== currentPage) {
                    this.attr.private.currentPage = pageNumber;
                    this.updateVisualization();
                }
            };

            this.after('initialize', function() {
                var self = this;
                
                this.$node.addClass('paged-container');
                
                var nav = this.select('selectNavigation');
                
                var left = $('<div>').addClass('page-left').click(function () {
                    self.changeToPage(-1,true);
                });
                
                nav.append(left);
                
                var i = 1;
                $.each(this.attr.items, function (k,v) {
                    var chooser = $('<div>').addClass('page-chooser').html(i).click(function () {
                        self.changeToPage($(this).html(),false);
                    });
                    i += 1;
                    nav.append(chooser);
                });
                
                var right = $('<div>').addClass('page-right').click(function () {
                    self.changeToPage(+1,true);
                });
                
                nav.append(right);
                
                this.select('selectPageLeft').click(function () {
                    self.changeToPage(-1,true);
                });
                this.select('selectPageRight').click(function () {
                    self.changeToPage(+1,true);
                });
               
                // API =========================================================
                var triggers = this.attr.triggers;
                
                this.on(triggers.update, function () {
                    this.assignPages();
                    this.updateVisualization();
                });
                
                // Resize binding
                
                $(window).bind('resize', function() {
                    self.assignPages();
                    self.updateVisualization();
                });

            });
        }
    }
);
