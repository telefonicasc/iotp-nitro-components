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
        }

    });

    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');
};
