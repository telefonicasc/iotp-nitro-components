/**
@component pagedContainer
@event {in} valueChange Change value in component
@event {in} update Redraw pages
@event {out} pageChanged When page is changed
*/
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
                selectFixedPage: '.fit',
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
            this.next = function(){
                this.changeToPage(+1,true);
            };
            this.prev = function(){
                this.changeToPage(-1,true);
            };

            this.drawNavigation =  function(totalPages){
                var changeToPage = $.proxy(this.changeToPage, this);
                var $nav = this.select('selectNavigation');

                $('<div>').addClass('page-left').
                    click($.proxy(this.prev, this)).
                    appendTo($nav);
                $('<div/>').addClass('pages-index').
                    appendTo($nav);
                $('<div>').addClass('page-right').
                    click($.proxy(this.next, this)).
                    appendTo($nav);

                $nav.on('click', '.page-chooser', function(){
                    var page = $(this).text();
                    changeToPage(page,false);
                });
                this.select('selectNavigation').hide();
            };

            this.addPage = function(index){
                var navContainer = $('.pages-index', this.select('selectNavigation'));
                $('<div>')
                    .addClass('page-chooser')
                    .text(index)
                    .appendTo(navContainer);
            };

            this.assignPages = function () {
                var cfg = this.attr.private;
                var elements = this.select('selectElements').children();
                cfg.pageCount = 0;

                // Calculate available space (fit div height - navigation bar height)
                var nav = this.select('selectNavigation');
                cfg.available = this.select('selectFixedPage').height() - nav.height();
                var remaining = cfg.available;
                // Assign a page to each one
                var alwaysVisible = this.attr.alwaysVisible;

                $('.pages-index', this.select('selectNavigation')).empty();
                var page = 1;
                var cacheHeight=0;
                this.addPage(page);

                $.each(elements, $.proxy(function (k,v) {
                        // Does this component fit?
                        var requiredHeight = $(v).outerHeight();
                        var nextEle = $(elements[k+1]);
                        var nextHeight = 0;
                        if(nextEle){
                            nextHeight = nextEle.height();
                        }

                        if (parseInt(k) in alwaysVisible) {
                            $(v).attr('assigned-page',0);
                            remaining -= requiredHeight;
                        }else{
                            cacheHeight += requiredHeight;
                            $(v).attr('assigned-page',page);
                            if ((cacheHeight+nextHeight) > remaining && nextEle.length) {
                                cacheHeight=0;
                                this.addPage(++page);
                            }
                        }
                    }, this));
                // Update page count
                cfg.pageCount = page;
                // Update currentPage
                if (cfg.currentPage > cfg.pageCount) {
                    cfg.currentPage = cfg.pageCount;
                }
            };

            this.updateVisualization = function () {
                var currentPage = this.attr.private.currentPage;
                var elements = this.select('selectElements').children();
                // First hide, then show
                $.each(elements, function(k,v){
                    var assignedPage = parseInt($(v).attr('assigned-page'));
                    if (assignedPage === currentPage){
                        $(v).show();
                    }else if (assignedPage === 0){
                        $(v).show();
                    }else{
                        $(v).hide();
                    }
                });

                if (this.attr.private.pageCount <= 1) {
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
                var fixElement = this.select('selectFixedPage');
                var childs = $(this.attr.selectElements+' > *:visible', fixElement);
                this.trigger('show-page', {
                    'childs':childs,
                    'height':this.attr.private.available
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
                if (pageNumber > pageCount) pageNumber = currentPage;
                if (typeof pageNumber === 'string') pageNumber = parseInt(pageNumber);

                // Update visual
                if (pageNumber !== currentPage) {
                    this.attr.private.currentPage = pageNumber;
                    this.updateVisualization();
                    this.trigger('pageChanged', [pageNumber]);
                }
            };

            this.update = function(){
                this.assignPages();
                this.updateVisualization();
            };

            this.after('initialize', function() {
                this.$node.addClass('paged-container');
                this.update();
                this.drawNavigation();

                // API =========================================================
                var triggers = this.attr.triggers;
                this.on(triggers.update, this.update);
                // Resize binding
                $(window).bind('resize', $.proxy(this.update, this));

            });
        }
    }
);