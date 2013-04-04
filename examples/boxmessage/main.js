requirejs.config({
  baseUrl: '/m2m-nitro-components',
  nitroComponents: [
  ]
});

define(
  [
    'components/application_boxmessage',
    'components/angular_directives',
    'components/jquery_plugins'
  ],

  function() {
    $('#open-messagebox').on('click', function(){
      BoxMessage.open({
        message: $('input[name=title]').val() ,
        title: $('input[name=message]').val()
      });
    });
  }
);
