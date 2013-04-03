requirejs.config({
  baseUrl: '/m2m-nitro-components',
  paths: {
    'raphael': 'libs/raphael/raphael'
  }
});

define(
  [
    'components/graph_editor',
    'components/card/card',
    'components/card/card_toolbox',
    'raphael'
  ],

  function() {

    requirejs(['components/jquery_plugins'], function() {

      $('#editor').m2mgraphEditor({

      });
      $('.card').m2mcard();
      $('#toolbox').m2mCardToolbox();
      $('#toolbox .panel-content').html('<h1>ASDASD ASD ASD<br>akajljasld</h1>');

    });
  }
);
