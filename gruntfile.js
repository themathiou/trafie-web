module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    bower_concat: {
      all: {
        dest: 'public/js/_bower.js',
        dependencies: {
          "angular-animate": "angular",
          "angular-resource": "angular",
          "angular-route": "angular",
          "c3": "d3"
        },
        bowerOptions: {
          relative: false
        }
      }
    },
    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: [
            'public/js/_bower.js',
            'public/js/common/utils.js',
            'public/js/libs/angular/angular-file-upload-shim.js',
            'public/js/libs/thirdparty/ui-bootstrap-custom-0.12.1.js',
            'public/js/app.js',
            'public/js/services/*.js',
            'public/js/directives/*.js',
            'public/js/models/*.js',
            'public/js/libs/angular/angular-file-upload.js',
            'public/js/controllers/*.js',
            'public/js/scripts/*.js'
        ],
        dest: 'public/js/<%= pkg.name %>.js'
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n',
        mangle: {
          except: ['angular']
        }
      },
      dist: {
        files: {
          'public/js/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
        }
      }
    },
    less: {
      all: {
        options: {},
        files: {
          "public/styles/css/style.css": "public/styles/less/style.less"
        }
      }
    },
    concat_css: {
      options: {},
      all: {
        src: ["public/styles/css/bootstrap.css","public/styles/css/c3.css","public/styles/css/angular-datepicker.css","public/styles/css/style.css"],
        dest: "public/styles/css/compiled.css"
      }
    },
    cssmin: {
      target: {
        files: [{
          expand: true,
          cwd: 'public/styles/css',
          src: ['compiled.css'],
          dest: 'public/styles/css',
          ext: '.min.css'
        }]
      }
    }
  });

  grunt.loadNpmTasks('grunt-bower-concat');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-concat-css');
  grunt.loadNpmTasks('grunt-contrib-cssmin');

  grunt.registerTask('default', ['bower_concat','concat', 'uglify', 'less', 'concat_css', 'cssmin']);
};