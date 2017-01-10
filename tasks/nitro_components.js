
'use strict';

module.exports = function(grunt) {

    grunt.registerMultiTask('nitroComponents', 'Add nitro components to this project', function() {
        grunt.loadNpmTasks('grunt-contrib-less');
        grunt.loadNpmTasks('grunt-contrib-concat');
        grunt.loadNpmTasks('grunt-contrib-requirejs');

        var build = grunt.config('nitroComponents.' + this.target);
        var components = build.components;
        var optimize = build.optimize;
        var baseUrl = build.path || './node_modules/nitro-components/';
        var out = build.out;
        var requireCfg = {
            options: {
                baseUrl: baseUrl,
                out: out || 'nitro_components.js',
                include: ['node_modules/almond/almond'].concat(components),
                insertRequire: components,
                wrap: true
            }
        };
        var lessPath = baseUrl + 'style/less/nitro-components.less';
        var cssPath = build.outCss || 'style/css/nitro-components.css';
        var lesscfg = {
                files: {}
            };
        lesscfg.files[cssPath] = lessPath;
        var banner = '/*! ********************************************** \r\n ' +
            '<%= nitroComponentsPackage.name %> - v<%= nitroComponentsPackage.version %> - ' +
            'build: <%= grunt.template.today("yyyy/mm/dd h:MM:ss TT")  %> \r\n' +
            '**************************************************  */ \r\n';
        var bannerCfg = {
            options: {
                stripBanners: true,
                banner: banner
            },
            src: [requireCfg.options.out],
            dest: requireCfg.options.out
        };
        var styleBannerCfg = {
            options: {
                stripBanners: true,
                banner: banner
            },
            src: [cssPath],
            dest: cssPath
        };

        if (optimize) requireCfg.options.optimize = optimize;

        //load package
        grunt.config.set('nitroComponentsPackage', grunt.file.readJSON(baseUrl + 'package.json'));

        //build JS
        grunt.config.set('concat.nitroComponents', bannerCfg);
        grunt.config.set('requirejs.nitroComponents', requireCfg);
        grunt.task.run('requirejs:nitroComponents');
        grunt.task.run('concat:nitroComponents');

        //build CSS
        grunt.config.set('concat.nitroComponentsStyle', styleBannerCfg);
        grunt.config.set('less.nitroComponents', lesscfg);
        grunt.task.run('less:nitroComponents');
        grunt.task.run('concat:nitroComponentsStyle');
    });
};
