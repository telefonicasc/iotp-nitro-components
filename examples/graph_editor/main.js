requirejs.config({
  baseUrl: '/m2m-nitro-components',
  paths: {
    'raphael': 'libs/raphael/raphael'
  }
});

define(
  [
    'components/jquery_plugins'
  ],

  function() {

    $('#editor').m2mgraphEditor({

    });
    $('.card').m2mcard();
  }
);
