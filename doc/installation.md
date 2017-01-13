### Installation

The library is designed to be included into your project using *npm*, and
generate a custom build selecting desired components using *grunt*.
Install iotp-nitro-components npm package from pdihub:

    npm install git+ssh://git@pdihub.hi.inet:iotp-nitro-components

That will download iotp-nitro-components and put it in the node_modules directory.
Install grunt packages:

    npm install grunt grunt-contrib-requirejs grunt-contrib-less grunt-contrib-copy

Next you need to define in your Gruntfile what widgets do you want to include
in your iotp-nitro-components built version. A sample Gruntfile.js including the
MapDashboard widget will be:

    module.exports = function(grunt) {

        grunt.initConfig({

            nitroComponents: {
                build: {
                    out: 'app/lib/nitrocomponents/nitro_components.js',                 //default: your application directory
                    outCss: 'app/lib/nitrocomponents/style/css/nitro_components.css',   //default: style/css/nitro_components.css
                    outImages: 'app/lib/nitrocomponents/style/img',                     //default: style/img
                    components: [
                        'components/dashboard/map',
                        'components/jquery_plugins'
                    ]
                },
                dev: {
                    path: '../iotp-nitro-components/',
                    optimize: 'none',
                    out: '<%= nitroComponents.build.out %>',
                    outCss: '<%= nitroComponents.build.outCss %>',
                    outImages: '<%= nitroComponents.build.outImages %>',
                    components: '<%= nitroComponents.build.components %>'
                }
            }

        });

        grunt.loadNpmTasks('grunt-contrib-less');
        grunt.loadNpmTasks('grunt-contrib-concat');
        grunt.loadNpmTasks('grunt-contrib-requirejs');
        grunt.loadNpmTasks('grunt-contrib-copy');

        grunt.loadTasks('node_modules/m2m-nitro-components/tasks');

    };

Now if you run:

    grunt nitroComponents

It will generate a javascript file in `app/lib/nitrocomponents/nitro_components.js`,
a css file in `app/lib/nitrocomponents/style/css/nitro-components.css`,
and an images folder in `app/lib/nitrocomponents/style/img` in your app.

The only dependency of iotp-nitro-components is jquery, that you should include
in your page before nitro_components.js. Although, some of the widgets will
require additional dependencies. For example the map widget will depend on
leaflet, but the dependency will be resolved in your built version of `nitro_components.js`.