module.exports = function(grunt) {
    grunt.initConfig({
        concat : {
            dist: {
                src: [
                    'src/cosumer-electronics.js',
                    'src/controller/*',
                    'src/install.js'],
                dest: './kermit.min.js'
            }
        },
        watch: {
          files: 'src/**/*',
          tasks: ['build']
        }
    });
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');

    grunt.registerTask('default', ['nitroComponents']);
    grunt.registerTask('build', ['concat']);
};