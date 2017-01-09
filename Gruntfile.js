module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    requirejs: {
      compile: {
        options: {
          baseUrl: '.',
          //mainConfigFile: 'examples/ce/main.js',
          out: 'dist/nitro-components.js'
//          include: [
//            'components/dashboard/dashboard'
//          ]
        }
      }
    },

    watch: {
      css:{
        files: 'style/less/**/*.less',
        tasks: ['styleguide', 'less']
      }
    },

    styleguide: {

      options: {
        framework: {
          name: 'kss'
        },
        name: 'Style guide',
        template: {
          src: ['doc/styleguide-template']
        }
      },

      dist: {
        files: {
          'doc/styleguide': 'style/less/nitro-components.less'
        }
      }
    },

    less: {
      development: {
        files: {
          'style/css/nitro-components.css':'style/less/nitro-components.less'
        }
      }
    },

    closureLint: {
      app: {
        closureLinterPath: '/usr/bin/',
        src: ['components/**'],
        options: {
          stdout: true
        }
      }
    },
    plato: {
      check: {
        options: {
          jshint : grunt.file.readJSON('.jshintrc')
      	},
        files: {
          'reports/complexity': ['components/**/*.js']
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-styleguide');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-closure-linter');
  grunt.loadNpmTasks('grunt-plato');

  grunt.registerTask('build', ['requirejs']);
};
