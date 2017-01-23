module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        bower: {
            install: {}
        },
        connect: {
            server: {
                options: {
                    port: 8000,
                    keepalive: true,
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
        }
    });

    grunt.loadNpmTasks('grunt-bower-task');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-connect-proxy');

    grunt.registerTask('serve', [
        'bower',
        'configureProxies:server',
        'connect:server'
    ]);
};