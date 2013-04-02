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

    watch: {
      files: 'style/less/*.less',
      tasks: ['styleguide', 'less']
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

    jasmine: {
      components: {
        src: 'components/**/*.js',
        options: {
          vendor: ['libs/es5-shim/es5-shim.js', 'libs/jquery/jquery.js', 'libs/d3/d3.js', 'libs/angular/angular.js'],
          specs: 'test/*_spec.js',
          template: require('grunt-template-jasmine-requirejs')
        }
      },
      coverage: {
        src: 'components/**/*.js',
        options: {
          specs: 'test/*_spec.js',
          vendor: ['libs/es5-shim/es5-shim.js', 'libs/jquery/jquery.js', 'libs/d3/d3.js'],
          template: require('grunt-template-jasmine-istanbul'),
          templateOptions: {
            specs: 'test/*_spec.js',
            template: require('grunt-template-jasmine-requirejs'),
            templateOptions: {
              requireConfig: {
                paths: {
                  components: '.grunt/grunt-contrib-jasmine/components/'  
                }
              }
            },
            coverage: 'reports/coverage/coverage.json',
            report: 'reports/coverate'
          }
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-styleguide');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('build', ['requirejs']);
  grunt.registerTask('test', ['jasmine']);
  grunt.registerTask('specpage', ['jasmine:components:build']);
  grunt.registerTask('specpage2', ['jasmine:coverage:build']);
};
