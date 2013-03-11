module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    requirejs: {
      compile: {
        options: {
          baseUrl: '.',
          //mainConfigFile: 'examples/ce/main.js',
          out: 'dist/nitro-components.js',
          include: [
            'components/dashboard/dashboard'
          ]
        }
      }
    },

    jasmine: {
      nodeComponents: {
        src: 'components/**/*.js',
        options: {
          specs: 'test/*Spec.js',
          template: require('grunt-template-jasmine-requirejs')
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-jasmine');

  grunt.registerTask('build', ['requirejs']);
  grunt.registerTask('test', ['jasmine']);
};
