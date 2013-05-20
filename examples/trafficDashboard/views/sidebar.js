DV.Traffic = DV.Traffic || {};
DV.Traffic.Views = DV.Traffic.Views || {};

DV.Traffic.Views.Sidebar = Backbone.Marionette.Layout.extend({

  template: DV.Traffic.Templates.sidebar,

  className: 'sidebarcontainer',

  regions: {
  	warningList: '.warning-list',
  	header: '.header',
    assetIssues: '.asset-issues',
    details: '.details',
    lightColor: '.light-color',
    batteryLevel: '.battery-level',
    location: '.location'
  },

  ui: {
    assetPanel: '.asset-panel',
    assetName: '.asset-panel-name',
    lastUpdate: '.asset-panel-lastupdate span',
    panelArea: '.panel-area'
  },

  events: {

  },

  initialize: function() {
    this.bindTo(DV.Traffic.Collections.trafficLights, "change:selected", function(model) {
      if (model.get('selected')) {
        if (model.get('status') === "warning") {
          this.ui.assetPanel.addClass('asset-warning');
        }else{
          this.ui.assetPanel.removeClass('asset-warning');          
        }

        if (model.get('status') === "offline") {
          this.ui.assetPanel.addClass('asset-offline');
        }else{
          this.ui.assetPanel.removeClass('asset-offline');
        }

        this.ui.assetName.html(model.get('asset').name);
        this.ui.lastUpdate.html(__('TrafficDashboard.lastUpdate') + this.prettyDate(model.getLastUpdate()));
        this.requestData(model, this.requestDataCallback);
        this.showDetails();
      }
    }, this);

    this.currentPage = 0;
  },

  onRender: function() {
    var self = this;
    this.hideDetails(0); 
	  this.ui.assetName.on('click', function() {
      if (window.M2M && window.M2M.dispatch) {
        window.M2M.dispatch('/asset/details/' + $(this).html());
      }
    });
    $(window).resize(function() { self.updatePanels() });
  },
  
  updatePage: function() {
    $('.page-container', this.$el).stop(true, true);
    $('.page-container', this.$el).animate({
      marginLeft: 0-(this.currentPage*320)
    });
    $('.page-selector', this.$el).removeClass('page-selector-selected');
    $('.page-selector', this.$el)
      .eq(this.currentPage).addClass('page-selector-selected');
  },

  updatePanels: function() {
    var self = this
      , panelArea = this.ui.panelArea
      , pageContainer = $('.page-container', panelArea)
      , pageNavigation = $('.page-navigation', this.$el)
      , height = panelArea.height() - panelArea.position().top - 10
      , numPages
      , y = 0, page = $('<div>').addClass('panel-page');

    panelArea.find('.dashboardpanel').appendTo(panelArea);
    panelArea.find('.panel-page').remove();

    // Check if we need space for the navigation
    panelArea.find('.dashboardpanel').each(function() {
      y += parseInt($(this).data('minHeight'));
    });
    
    if (y > height) {
      height -= pageNavigation.height();
    } 

    y = 0;
    panelArea.find('.dashboardpanel').each(function() {
      y += parseInt($(this).data('minHeight')); 
      if (y > height) {
        page.appendTo(pageContainer);
        page = $('<div>').addClass('panel-page');
        page.data('totalHeight', y);
        y = parseInt($(this).data('minHeight'));
      } 
      page.data('totalHeight', y);
      $(this).appendTo(page);
    });
    page.appendTo(pageContainer);

    pageNavigation.empty(); 
    panelArea.find('.panel-page').each(function(i) {
      var totalHeight = $(this).data('totalHeight')
        , remaining = height - totalHeight;
      // Adjust panels for this page
      $('.dashboardpanel', this).each(function() {
        var minHeight = $(this).data('minHeight')
          , maxHeight = $(this).data('maxHeight')
          , newHeight = minHeight*(1 + remaining/totalHeight);

        if (maxHeight) {
          newHeight = Math.min(Math.max(minHeight, newHeight), maxHeight);
        } else {
          newHeight = minHeight + remaining;
        }

        $('.sidebaritem', this).css({ height: newHeight });
        $('.sidebaritem', this).trigger('panelresize');
        if (maxHeight) {
          $('h1', this).css({ marginBottom: (newHeight-minHeight) });
        }
        remaining -= newHeight - minHeight;
        totalHeight -= minHeight;
      });

      // Add page selector
      $('<div>')
        .addClass('page-selector') 
        .html(i+1)
        .appendTo(pageNavigation)
        .click(function() {
          self.currentPage = i;
          self.updatePage();
          //pageContainer.animate({ marginLeft: 0-(i*300) });
        });
    });


    numPages = pageContainer.find('.panel-page').length;

    $('<div>').addClass('page-selector-prev')
      .prependTo(pageNavigation)
      .click(function() {
        self.currentPage = Math.max(self.currentPage - 1, 0);
        self.updatePage();
      });

    $('<div>').addClass('page-selector-next')
      .appendTo(pageNavigation)
      .click(function() {
        self.currentPage = Math.min(self.currentPage + 1, numPages-1);
        self.updatePage();
      });

    if (numPages > 1) {
      pageNavigation.show();
      if (this.currentPage >= numPages) {
        this.currentPage = numPages - 1;
      }
    } else {
      pageNavigation.hide();
      this.currentPage = 0;
    }

    this.updatePage();
  },

  requestData: function(model, callback) {
  	callback = _.bind(callback, this);
  	model.getSensorHistory('redLight', function(redLight) {
      model.getSensorHistory('yellowLight', function(yellowLight) {
        model.getSensorHistory('greenLight', function(greenLight) {
        	model.getSensorHistory('batteryStatus', function(batteryStatus) {
            model.getSensorHistory('voltage', function(voltage) {
          		callback(model, redLight, yellowLight, greenLight, batteryStatus, voltage);
            });  
        	});
        });
      });
    });
  },

  requestDataCallback: function(model, redLight, yellowLight, greenLight, batteryStatus, voltage) {
  	this.trigger('dataupdated', model, redLight, yellowLight, greenLight, batteryStatus, voltage);
  },
  
  
  showDetails: function(speed) {
    var self = this;
    speed = speed || 300;
    var height = $('.vb-framework .sidebar').height();
    $('.asset-panel', this.$el).animate({
      height: height-36
    }, speed, 'swing', function() {
      self.updatePanels(); 
    });
  },

  hideDetails: function(speed) {
    speed = speed || 300;
    $('.asset-panel', this.$el).animate({
      height: 0
    }, speed);
  },

  prettyDate: function(time){
    var date = new Date((time || "").replace(/-/g,"/").replace(/[TZ]/g," ")),
        diff = (((new Date()).getTime() - date.getTime()) / 1000) + date.getTimezoneOffset() * 60,
        day_diff = Math.floor(diff / 86400);
                          
        if ( isNaN(day_diff) || day_diff < 0 || day_diff >= 31 )
          return;
                                  
      return day_diff == 0 && (
        diff < 60 && __('TrafficDashboard.justNow') ||
        diff < 120 && __('TrafficDashboard.oneMinAgo') ||
        diff < 3600 && Math.floor( diff / 60 ) + __('TrafficDashboard.minsAgo') ||
        diff < 7200 && __('TrafficDashboard.oneHourAgo') ||
        diff < 86400 && Math.floor( diff / 3600 ) + __('TrafficDashboard.hoursAgo')) ||
        day_diff == 1 && __('TrafficDashboard.yesterday') ||
        day_diff < 7 && day_diff + __('TrafficDashboard.daysAgo') ||
        day_diff < 31 && Math.ceil( day_diff / 7 ) + __('TrafficDashboard.weeksAgo');
  }

});
