
'use strict';

module.exports = function(grunt) {

  grunt.registerMultiTask('nitroComponents', 'Add nitro components to this project', function() {
    var components = grunt.config('nitroComponents.build.components')
      , requireCfg = {
           options: {
             baseUrl: './node_modules/m2m-nitro-components/',
             out: 'app/lib/nitro_components/nitro_components.js',
             nitroComponents: components,
             include: ['components/jquery_plugins']
           }
        };
    grunt.config.set('requirejs.nitroComponents', requireCfg);
    console.log('adasda', grunt.config('requirejs.nitroComponents'));
    grunt.task.run('requirejs:nitroComponents');
  });

};
