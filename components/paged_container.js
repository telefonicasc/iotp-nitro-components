define(
    [
        'components/component_manager',
        'components/mixin/container'
    ],

    function(ComponentManager, ContainerMixin) {

        return ComponentManager.create('pagedContainer', Component, ContainerMixin);

        function Component() {

            this.defaultAttrs({
                selectors: {
                    elements: '.elements',
                    navigation: '.navigation',
                    pageLeft: '.pageLeft',
                    pageRight: '.pageRight'
                },
                triggers: {
                    update: 'update'
                },
                private: {
                    currentPage: 1,
                    pageCount: 0,
                    available: 0
                },
                insertionPoint: '.elements',
                alwaysVisible: [],
                items: []
            });
            
            this.template = '<div class="paged-container-fit">'
                + '<div class="elements"/>'
                + '<div class="navigation"/>'
                + '</div>';

            this.assignPages = function () {
                var cfg = this.attr.private;
                var selectors = this.attr.selectors;
                var elements = this.select(selectors.elements).children();
                cfg.pageCount = 0;
                
                // Calculate available space (parent height - navigation bar height)
                var nav = this.select(selectors.navigation);
                cfg.available = this.$node.height() - nav.height();
                
                var remaining = cfg.available;
                var page = 1;
                
                var getRequiredHeight = function (v) {
                    return $(v).height();
                };
                
                // Assign a page to each one
                $.each(elements, function (k,v){
                    // Does this component fit?
                    var requiredHeight = getRequiredHeight(v);
                    if (requiredHeight <= remaining) {
                        remaining -= requiredHeight;
                    }
                    else {
                        remaining = cfg.available - requiredHeight;
                        page += 1;
                    }
                    // Set element page
                    $(v).attr('assigned-page',page);
                });
                // Update page count
                cfg.pageCount = page - 1;
                // Update currentPage
                if (cfg.currentPage > cfg.pageCount) {
                    cfg.currentPage = cfg.pageCount +1;
                }
                
            };
            
            this.updateVisualization = function () {
                var currentPage = this.attr.private.currentPage;
                var elements = this.select(this.attr.selectors.elements).children();
                $.each(elements, function(k,v){
                    var assignedPage = parseInt($(v).attr('assigned-page'));
                    if (assignedPage === currentPage) $(v).show();
                    else $(v).hide();
                });
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
                if (pageNumber >= pageCount) pageNumber = currentPage;
                // Set new page
                this.attr.private.currentPage = pageNumber;
                // Update visual
                if (pageNumber !== currentPage) {
                    this.updateVisualization();
                }
            };

            this.after('initialize', function() {
                this.$nodeMap = $(this.template).appendTo(this.$node);
                // Add the required amount of page choosers (one per item)
                var navHtml = '<div class="page-left">';
                var i = 0;
                $.each(this.attr.items, function (k,v) {
                    navHtml += '<div class="page-chooser">' + (i+1) + '</div>';
                    i += 1;
                });
                navHtml += '<div class="page-right">';
                
                var selectors = this.attr.selectors;
                this.select(selectors.navigation).html(navHtml);
                this.select(selectors.pageLeft).click(this.changeToPage(-1,true));
                this.select(selectors.pageLeft).click(this.changeToPage(+1,true));
                
                
                // API =========================================================
                var triggers = this.attr.triggers;
                
                this.on(triggers.update, function () {
                    this.assignPages();
                    this.updateVisualization();
                });
                
            });
        }
    }
);
