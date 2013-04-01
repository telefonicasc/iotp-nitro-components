
'use strict';

module.exports = function(grunt) {

  grunt.registerMultiTask('nitroComponents', 'Add nitro components to this project', function() {
    var components = grunt.config('nitroComponents.build.components')
      , requireCfg = {
           options: {
             baseUrl: './node_modules/m2m-nitro-components/',
             out: 'app/lib/nitro_components/nitro_components.js',
             include: components
           }
        };
    grunt.config.set('requirejs.nitroComponents', requireCfg);
    grunt.task.run('requirejs:nitroComponents');

    var lesscfg = {
      files: { 'style/css/nitro-components.css':'./node_modules/m2m-nitro-components/style/less/nitro-components.less' }
    };
    grunt.config.set('less.nitroComponents', lesscfg);
    grunt.task.run('less:nitroComponents');
  });

};
