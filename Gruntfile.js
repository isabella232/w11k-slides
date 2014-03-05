'use strict';

module.exports = function (grunt) {

  var pkg = require('./package.json');

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-html2js');
  grunt.loadNpmTasks('grunt-bump');
  grunt.loadNpmTasks('grunt-conventional-changelog');

  var bowerrc = grunt.file.exists('./.bowerrc') ? grunt.file.readJSON('./.bowerrc') : { 'json': 'bower.json' };

  var bumpFiles = [ 'package.json', '../w11k-slides-bower/package.json' ];
  if (grunt.file.exists(bowerrc.json)) {
    bumpFiles.push(bowerrc.json);
  }

  grunt.initConfig({
    pkg: pkg,
    meta: {
      banner:
        '/**\n' +
          ' * <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
          ' * <%= pkg.homepage %>\n' +
          ' *\n' +
          ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>\n' +
          ' */\n'
    },

    clean: {
      dist: 'dist/*'
    },
    jshint: {
      src: {
        options: {
          jshintrc: '.jshintrc'
        },
        files: [{
          expand: true,
          cwd: 'src',
          src: '**.js'
        }]
      }
    },
    sass: {
      dist: {
        options: {
          style: 'expanded'
        },
        files: {
          'dist/w11k-slides.css': 'src/w11k-slides.scss'
        }
      }
    },
    copy: {
      template: {
        src: 'src/w11k-slides.tpl.html',
        dest: 'dist/w11k-slides.tpl.html'
      },
      sass: {
        files: [{
          expand: true,
          cwd: 'src',
          src: '**/*.scss',
          dest: 'dist'
        }]
      },
      release: {
        files: [
          {
            expand: true,
            cwd: 'dist/',
            src: '*',
            dest: '../w11k-slides-bower/dist/'
          },
          {
            src: 'bower.json',
            dest: '../w11k-slides-bower/'
          }
        ]
      }
    },
    html2js: {
      template: {
        options: {
          base: 'src',
          module: 'w11k.slides.template',
          quoteChar: '\'',
          htmlmin: {
            collapseWhitespace: true
          }
        },
        files: {
          'dist/w11k-slides.tpl.js': 'src/slides/slides.tpl.html'
        }
      }
    },
    uglify: {
      options: {
        banner: '<%= meta.banner %>'
      },
      code: {
        options: {
          mangle: false,
          compress: false,
          beautify: true
        },
        files: [{
          expande: true,
          nosort: true,
          src: 'src/**/*.js',
          dest: 'dist/w11k-slides.js'
        }]
      },
      codeMinified: {
        files: [{
          expande: true,
          nosort: true,
          src: 'src/**/*.js',
          dest: 'dist/w11k-slides.min.js'
        }]
      }
    },
    bump: {
      options: {
        files: bumpFiles,
        commit: true,
        commitMessage: 'chore(project): bump version to %VERSION%',
        commitFiles: ['-a'],
        createTag: false,
        push: false
      }
    }
  });

  grunt.registerTask('default', ['build']);

  grunt.registerTask('build', ['clean', 'jshint:src', 'sass', 'copy:template', 'copy:sass', 'html2js', 'uglify']);
  grunt.registerTask('release', ['build', 'copy:release']);

};
