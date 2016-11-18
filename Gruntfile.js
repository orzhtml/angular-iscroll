module.exports = function (grunt) {

    require('load-grunt-tasks')(grunt);
    require('time-grunt')(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        modulePath: "<%=pkg.family%>/<%=pkg.name%>/<%=pkg.version%>/",
        copy: {
            main: {
                expand: true,
                cwd: 'src/example/',
                src: ['*.html', '*.js'],
                dest: 'dist/'
            },
            js: {
                expand: true,
                cwd: 'src/js/',
                src: '*.js',
                dest: 'dist/js/'
            },
            img: {
                expand: true,
                cwd: 'src/images/',
                src: '**',
                dest: 'dist/images/'
            }
        },
        watch: {
            build: {
                files: ["src/**/*.scss", "src/**/*.html"],
                tasks: ["bd"],
                options: {
                    spawn: false
                }
            }
        },
        sass: {
            main: {
                expand: true,
                cwd: 'src/scss/',
                src: ['mobile-ui.scss'],
                dest: 'dist/css/',
                ext: '.css'
            },
            exa: {
                expand: true,
                cwd: 'src/example/',
                src: ['*.scss'],
                dest: 'dist/',
                ext: '.css'
            },
            widgets: {
                expand: true,
                cwd: 'src/scss/widgets/',
                src: ['*.scss'],
                dest: 'dist/css/widgets/',
                ext: '.css'
            }
        },
        postcss: {
            options: {
                processors: [
                    //require('autoprefixer')({browsers: ['last 2 versions', 'Android >= 4.0']}), // add vendor prefixes
                    require('autoprefixer')({browsers: ['last 2 versions','ios 5','android 2.3']}), // add vendor prefixes
                    require('cssnano')({
                        reduceIdents: false,
                        zindex: false
                    }) // minify the result

                ]
            },
            dist: {
                src: 'dist/**/*.css'
            }
        },
        replace: {
            debug: {
                options: {
                    patterns: [
                        {
                            match: /..\/dist\//g,
                            replacement: './'
                        }
                    ]
                },
                files: [
                    {
                        expand: true,
                        overwrite: true,
                        flatten: true,
                        src: ['dist/*.html'],
                        dest: 'dist/'
                    }
                ]
            }
        },
        uglify: {
            options: {
                beautify: {
                    ascii_only: true
                },
                banner: '/*! <%= pkg.name %> <%= pkg.version %> pub <%= grunt.template.today("yyyy-mm-dd HH:MM")%> by <%= pkg.author.name %> */\n'
            },
            build: {
                files: [{
                    expand: true,
                    cwd: 'dist/',
                    src: ['**/*.js', '!**/*-debug.js'],
                    dest: 'dist/'
                }]
            }
        },
        clean: {
            cmd: ['dist/.cmd'],
            dist: ['css', 'js']
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-postcss');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-replace');

    grunt.registerTask('build', function (arg) {
        var tasks = ['clean:dist', 'sass', "postcss", 'copy', 'clean:cmd'];
        if (arg == 'min') {
            tasks.push('uglify')
        }
        grunt.task.run(tasks);
    });

    grunt.registerTask("bd", ["build", 'replace:debug']);
    grunt.registerTask("w", ["watch"]);
};