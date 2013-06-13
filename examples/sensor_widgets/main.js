requirejs.config({
  baseUrl: '/m2m-nitro-components',
  nitroComponents: [
  ]
});

define(
  [
    'components/sensor_widget/battery'
  ],

  function() {

    requirejs(['components/jquery_plugins'], function() {

      function addTestWidget(widget) {
        $('<div>')
          .addClass('widgetTest')
          .appendTo($('body'))
          .append($('<div>')[widget]());
      }

      addTestWidget('m2mBattery');

    });

  }
);
