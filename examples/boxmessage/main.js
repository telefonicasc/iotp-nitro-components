requirejs.config({
  baseUrl: '../../',
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

    angular.module('testApp', ['nitroComponents'])
      .run(function() {
        console.log('init_app');
      })
      .controller('main', ['$scope', 'BoxMessage', function($scope, BM){
        $scope.test = function(){
          BM.open({title:'Por favor, confirma', message:'¿Estás seguro de que quieres desconectarte?', confirmModal:true, okCallback:function(){
            BM.close();
            console.log('test normal');
          }});
        };

        $scope.test_2 = function(){
          BM.open({
            title:'Por favor, confirma',
            message:'¿Estás seguro de que quieres desconectarte?',
            okCallback:function(){
              BM.close();
              console.log('test confirm');
            }
          });
        }

        $scope.test_3 = function(){
          BM.open({
            title:'Por favor, confirma',
            message:'¿Estás seguro de que quieres desconectarte?',
            confirmModal:true,
            button:{
              accept:{label:'rename-accept', callback:function(){BM.close();}},
              cancel:{label:'rename-cancel'}
            }
          });
        };

      }]);

    angular.bootstrap(document, ['testApp']);
  }
);
