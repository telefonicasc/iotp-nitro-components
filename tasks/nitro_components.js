
'use strict';

module.exports = function(grunt) {

  grunt.registerMultiTask('nitroComponents', 'Add nitro components to this project', function() {
    var components = grunt.config('nitroComponents.build.components');
    var optimize = grunt.config('nitroComponents.build.optimize');
    var out = grunt.config('nitroComponents.build.out');
    var requireCfg = {
           options: {
             baseUrl: './node_modules/m2m-nitro-components/',
             out: 'app/lib/nitro_components/nitro_components.js',
             include: ['libs/almond'].concat(components),
             insertRequire: components,
             wrap: true
           }
    };
    if(out) requireCfg.options.out = out;
    if(optimize) requireCfg.options.optimize = optimize;
    grunt.config.set('requirejs.nitroComponents', requireCfg);
    grunt.task.run('requirejs:nitroComponents');

    var lesscfg = {
      files: { 'style/css/nitro-components.css':'./node_modules/m2m-nitro-components/style/less/nitro-components.less' }
    };
    grunt.config.set('less.nitroComponents', lesscfg);
    grunt.task.run('less:nitroComponents');
  });

};
