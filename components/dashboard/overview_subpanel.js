define(
  [
    'components/component_manager',
    'components/mixin/data_binding',
    'components/mixin/template'
  ],

  function(ComponentManager, DataBinding, Template) {

    return ComponentManager.create('OverviewSubpanel', 
        OverviewSubpanel, DataBinding, Template);

    function OverviewSubpanel() {
      
      this.defaultAttrs({
        tpl: '<div class="icon {{iconClass}}{{value.iconClass}}"></div>' +
             '<div class="overview-subpanel-body">' +
               '<div class="text">{{text}}{{value.text}}</div>' +
               '<div class="caption">{{caption}}{{value.caption}}</div>' +
             '</div>',
        iconClass: '',
        text: '',
        caption: ''         
      });

      this.after('initialize', function() {
        this.$node.addClass('overview-subpanel');
      });
    }
  }
);
