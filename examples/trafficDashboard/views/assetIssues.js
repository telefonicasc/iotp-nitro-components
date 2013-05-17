DV.Traffic = DV.Traffic || {};
DV.Traffic.Views = DV.Traffic.Views || {};

DV.Traffic.Views.AssetIssues = Backbone.Marionette.ItemView.extend({

  template: DV.Traffic.Templates.assetIssues,

  className: 'sidebarissues',

  ui: {
    assetLabel: '.asset-label'
  }, 
  fillColor: '#6F8388',
  borderColor: '#6F8388',
  baseColor: '#E9EFF0',

  events: {
   
  },

  initialize: function() {
    this.bindTo(DV.Traffic.Collections.trafficLights, "change:selected", this.updateChart, this);
  },

  updateChart: function(model) {
    var errors = model.get('errors'),message;
    if(errors.length != 0){
      message = errors.join("<BR>")  
    }
    else{
      message = __('TrafficDashboard.noProblems');
    }
    
    this.ui.assetLabel.html(message);     
  }
});
