DV.Traffic = DV.Traffic || {};
DV.Traffic.Views = DV.Traffic.Views || {};

DV.Traffic.Views.ItemHeader = Backbone.Marionette.ItemView.extend({

  template: DV.Traffic.Templates.header,

  className: 'sidebaritem',

  ui: {
    headerLabel: '.header-label'
  }, 

  events: {
   
  },

  initialize: function() {
    this.bindTo(DV.Traffic.Collections.trafficLights, "change:selected", this.updateChart, this);
  },

  onRender: function() {
   
  },

  updateChart: function(model) {
  	var name = model.getName();
  	if (model.get('selected')) {
      this.ui.headerLabel.html(name);
  	}
  	
  }

 });
