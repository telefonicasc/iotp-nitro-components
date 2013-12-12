/*
_TODO_

@name OverviewSubpanel

@mixin DataBinding
@mixin Template

@option {String} iconClass '' Icon class name
@option {String} text '' Text
@option {String} text1 '' Subtitle
@option {String} caption '' Body of panel

@event render null Render sub pannel
*/
define(
  [
    'components/component_manager',
    'components/mixin/data_binding',
    'components/mixin/template',
    'components/context_menu_indicator'
  ],

  function(ComponentManager, DataBinding, Template, ContextMenuIndicator) {

    return ComponentManager.create('OverviewSubpanel',
        OverviewSubpanel, DataBinding, Template);

    function OverviewSubpanel() {

        this.defaultAttrs({
          tpl: '<div class="icon {{iconClass}}{{value.iconClass}}"></div>' +
            '<div class="overview-subpanel-body">' +
              '<h2>'+
                '<span class="text">{{text}}{{value.text}}</span>'+
                '<span class="text1">{{text1}}{{value.text1}}</span>'+
              '</h2>' +
              '<div class="caption">{{{caption}}}{{{value.caption}}}</div>'+
            '</div>',
          iconClass:'',
          text: '',
          text1: '',
          caption: '',
          nodes: {
              contextMenu: '#spanContextMenu',
          },
          classNode: 'overview-subpanel'
        });

        this.after('initialize', function() {
          this.$node.addClass();

        });

        this.after('initialize', function() {
            this.$node.addClass(this.attr.classNode);

            this.on('render', function() {
                if (this.attr.contextMenu) {
                  this.appendContextMenu(this.$contextMenu);
                }
            });

            this.after('template', function() {
                if (this.attr.contextMenu) {
                    this.appendContextMenu(this.attr.nodes.contextMenu);
                }
            });
        });

        this.appendContextMenu = function(node){
            var cmIndicator = $('<div>').appendTo(node);
            ContextMenuIndicator.attachTo(cmIndicator, this.attr);
      }
    }
  }
);
