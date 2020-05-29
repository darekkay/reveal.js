const sass = require('node-sass');

module.exports = grunt => {

	require('load-grunt-tasks')(grunt);

	let port = grunt.option('port') || 8000;
	let root = grunt.option('root') || '.';

	if (!Array.isArray(root)) root = [root];

	// Project configuration
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		meta: {
			banner:
				'/*!\n' +
				' * reveal.js <%= pkg.version %> (<%= grunt.template.today("yyyy-mm-dd, HH:MM") %>)\n' +
				' * http://revealjs.com\n' +
				' * MIT licensed\n' +
				' *\n' +
				' * Copyright (C) 2020 Hakim El Hattab, http://hakim.se\n' +
				' */'
		},

		qunit: {
			files: [ 'test/*.html' ]
		},

		uglify: {
			options: {
				banner: '<%= meta.banner %>\n',
				ie8: true
			},
			build: {
				src: 'js/reveal.js',
				dest: 'js/reveal.min.js'
			}
		},

		sass: {
			options: {
				implementation: sass,
				sourceMap: false
			},
			core: {
				src: 'css/reveal.scss',
				dest: 'css/reveal.css'
			},
			themes: {
						expand: true,
						cwd: 'css/theme/source',
						src: ['*.sass', '*.scss'],
						dest: 'css/theme',
						ext: '.css'
					}
		},

		autoprefixer: {
			core: {
				src: 'css/reveal.css'
			}
		},

    clean: {
      folder: ['build/'],
    },

    copy: {
      main: {
        files: [
          {src: ['js/*.min.js'], dest: 'build/', expand: true},
          {src: ['css/reveal.min.css'], dest: 'build/', expand: true},
					{src: ['css/print/pdf.css'], dest: 'build/', expand: true},
          {src: ['css/theme/*.min.css'], dest: 'build/', expand: true},
          {src: ['css/fonts/*'], dest: 'build/', expand: true},
          {
            src: ['plugin/highlight/*', 'plugin/notes/*', 'plugin/markdown/*',  'plugin/schedule/*', 'plugin/theme-toggle/*'],
            dest: 'build/', expand: true
          },
        ],
      },
    },

		cssmin: {
			options: {
				compatibility: 'ie9'
			},
			compress: {
        files: {
          'css/reveal.min.css': ['css/reveal.css'],
          'css/theme/dk-dark.min.css': ['css/theme/dk-dark.css'],
          'css/theme/dk-light.min.css': ['css/theme/dk-light.css'],
          'css/theme/dk-blue.min.css': ['css/theme/dk-blue.css']
        }
      }
		},

		jshint: {
			options: {
				curly: false,
				eqeqeq: true,
				immed: true,
				esnext: true,
				latedef: 'nofunc',
				newcap: true,
				noarg: true,
				sub: true,
				undef: true,
				eqnull: true,
				browser: true,
				expr: true,
				loopfunc: true,
				globals: {
					head: false,
					module: false,
					console: false,
					unescape: false,
					define: false,
					exports: false,
					require: false
				}
			},
			files: [ 'gruntfile.js', 'js/reveal.js' ]
		},

		connect: {
			server: {
				options: {
					port: port,
					base: root,
					livereload: true,
					open: true,
					useAvailablePort: true
				}
				}
			},

		zip: {
			bundle: {
				src: [
				'index.html',
				'css/**',
				'js/**',
				'lib/**',
				'images/**',
				'plugin/**',
				'**.md'
				],
				dest: 'reveal-js-presentation.zip'
			}
		},

		watch: {
			js: {
				files: [ 'gruntfile.js', 'js/reveal.js' ],
				tasks: 'js'
			},
			theme: {
				files: [
					'css/theme/source/*.sass',
					'css/theme/source/*.scss',
					'css/theme/template/*.sass',
					'css/theme/template/*.scss'
				],
				tasks: 'css-themes'
			},
			css: {
				files: [ 'css/reveal.scss' ],
				tasks: 'css-core'
			},
			test: {
				files: [ 'test/*.html' ],
				tasks: 'test'
			},
			html: {
				files: root.map(path => path + '/*.html')
			},
			markdown: {
				files: root.map(path => path + '/*.md')
			},
			options: {
				livereload: true
			}
		}

	});

	// Default task
	grunt.registerTask( 'default', [ 'css', 'js' ] );

	// JS task
	grunt.registerTask( 'js', [ 'jshint', 'uglify' ] );

	// Theme CSS
	grunt.registerTask( 'css-themes', [ 'sass:themes' ] );

	// Core framework CSS
	grunt.registerTask( 'css-core', [ 'sass:core', 'autoprefixer', 'cssmin' ] );

	// All CSS
	grunt.registerTask( 'css', [ 'sass', 'autoprefixer', 'cssmin' ] );

	// Package presentation to archive
	grunt.registerTask( 'package', [ 'default', 'zip' ] );

	// Serve presentation locally
	grunt.registerTask( 'serve', [ 'connect', 'watch' ] );

	// Run tests
	grunt.registerTask( 'test', [ 'jshint', 'qunit' ] );

	// Build production bundle
  grunt.registerTask( 'build', [ 'default', 'clean', 'copy' ] );
};
