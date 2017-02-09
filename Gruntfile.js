module.exports = function(grunt) {

    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        bower: {
            install: {}
        },
        concat: {
            options: {
                separator: ';',
            },
            dist: {
                src: ['js/app.js', 'js/**/*.js'],
                dest: 'build/app.js',
            },
        },
        babel: {
            options: {
                sourceMap: true,
                presets: ['es2015', 'stage-0']
            },
            dist: {
                files: [
                    {
                        expand: true,
                        src: ['build/app.js'],
                        dest: 'build/es2015',
                        ext: '.js'
                    }
                ]
            }
        },
        connect: {
            server: {
                options: {
                    port: 8000,
                    base: '.',
                    middleware: function(connect, options, defaultMiddleware) {
                        var proxy = require('grunt-connect-proxy/lib/utils').proxyRequest;
                        return [proxy].concat(defaultMiddleware);
                    }
                },
                proxies: [
                    {
                        context: '/ghop-core',
                        host: 'tests.parseq.pro',
                        port: 8080
                    }
                ]
            }
        },
        watch: {
            livereload: {
                options: { livereload: true },
                files: ['*.css', 'build/app.js', '*.html']
            },
            babel: {
                files: ['js/app.js', 'js/**/*.js'],
                tasks: ['concat', 'babel:dist']
            }
        },
    });

    grunt.loadNpmTasks('grunt-bower-task');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-connect-proxy');

    grunt.registerTask('serve', [
        'bower',
        'concat',
        'babel:dist',
        'configureProxies:server',
        'connect:server',
        'watch'
    ]);

    grunt.registerTask('install', [
        'bower',
        'concat',
        'babel:dist'
    ]);
};