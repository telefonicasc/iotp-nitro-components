module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        watch: {
            css: {
                files: 'style/less/**/*.less',
                tasks: ['less']
            }
        },

        less: {
            development: {
                files: {
                    'style/css/nitro-components.css': 'style/less/nitro-components.less'
                }
            }
        },

        githooks: {
            all: {
                // Will run the lint task at every commit
                'pre-commit': 'lint'
            }
        },

        // Make sure code styles are up to par and there are no obvious mistakes
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish')
            },
            all: [
                'Gruntfile.js',
                '*.js',
                'components/{,**/}*.js',
                'tasks/{,**/}*.js'
            ]
        },

        gjslint: {
            options: {
                reporter: {
                    name: 'console'
                },
                flags: [
                    '--flagfile .gjslintrc' //use flag file'
                ],
                force: false
            },
            all: {
                src: '<%= jshint.all %>'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-gjslint');

    grunt.registerTask('lint', [
        'jshint',
        'gjslint'
    ]);

};
