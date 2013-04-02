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
    'raphael'
  ],

  function() {

    requirejs(['components/jquery_plugins'], function() {

      $('#editor').m2mgraphEditor({

      });
      $('.card').m2mcard();

    });
  }
);
