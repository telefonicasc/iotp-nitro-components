DV.Traffic = DV.Traffic || {};
DV.Traffic.Views = DV.Traffic.Views || {};

DV.Traffic.Views.WarningList =  Backbone.Marionette.ItemView.extend({
  
  template: DV.Traffic.Templates.warningList,

  ui: {
    warningTitle: '.warning-title',
    list: 'ul.warnings',
    number: '.warning-number',
    map: '.mapbox',
    header: '.list-header'
  },

  initialize: function() {
    this.bindTo(DV.Traffic.Collections.trafficLights, "add remove change reset", this.updateList, this);
  },

  onRender: function() {
    var self = this;
    this.ui.header.on('click', function() {
      self.trigger('hidedetails');
    });
    this.ui.warningTitle.html(__('TrafficDashboard.lightsWarnings'));
  },

  updateList: function() {
    var self = this
      , collection = DV.Traffic.Collections.trafficLights
      , count = 0;

    this.ui.list.empty();

    collection.each(function(model) {
      var errors = model.get('errors')
        , asset = model.get('asset');

      if (model.get('selected')) {
        self.$el.addClass("shadow");
      }
      if (errors && errors.length) {
        count++;
        $('<li>')
          .append($('<span>').addClass('asset-name').html(asset.name))
          .append($('<span>').addClass('asset-errors').html(errors.join("<BR>")))

          .click(function() {
            collection.each(function(m) {
              if (m.get('selected')) {
                m.set('selected', false);
              }
            });
            model.set('selected', true);
            self.trigger('itemselected', model);
            self.$el.addClass("shadow");
          }).appendTo(this.ui.list);
      }
    }, this);
    this.ui.number.html(count);
  }
});
