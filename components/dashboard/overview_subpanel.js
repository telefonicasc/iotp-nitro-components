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
               '<div><span class="text">{{text}}{{value.text}}</span><span class="text1">{{text1}}{{value.text1}}</span></div>' +
               '<div class="caption">{{caption}}{{value.caption}}</div>' +
             '</div>',
        iconClass: '',
        text: '',
        text1: '',
        caption: ''
      });

      this.after('initialize', function() {
        this.$node.addClass('overview-subpanel');
      });
    }
  }
);
