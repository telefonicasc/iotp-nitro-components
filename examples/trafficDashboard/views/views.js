DV.Traffic = DV.Traffic || {};

DV.Traffic.Views = DV.Traffic.Views || {};

DV.Traffic.Views.events = _.extend({}, Backbone.Events);

DV.Traffic.Views.resizeMainView = function() {
    // set view to content size
    // Base sizes on framework
    var framework = $(".vb-framework .traffic");
    var fHeight = framework.height();

    // Sidebar and main height
    $(".map", framework).height(fHeight);
    $(".sidebar", framework).height(fHeight);
    if ($(".asset-panel", framework).height() > 0) {
      $(".asset-panel", framework).height(fHeight-36);
    }
    //$(".warning-list", framework).height(fHeight);
};
