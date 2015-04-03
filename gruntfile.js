module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: [
            'public/js/libs/angular-file-upload-shim.js',
            'public/js/libs/angular.min.js',
            'public/js/libs/angular-route.min.js',
            'public/js/libs/angular-animate.min.js',
            'public/js/libs/angular-resource.min.js',
            'public/js/libs/thirdparty/ui-bootstrap-0.10.0.min.js',
            'public/js/libs/thirdparty/d3.v3.min.js',
            'public/js/libs/thirdparty/c3.min.js',
            'public/js/app.js',
            'public/js/libs/angular-file-upload.js',
            'public/js/services/*.js',
            'public/js/directives/*.js',
            'public/js/models/*.js',
            'public/js/controllers/*.js',
            'public/js/scripts/*.js'
        ],
        dest: 'public/js/<%= pkg.name %>.js'
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      dist: {
        files: {
          'public/js/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');

  grunt.registerTask('default', ['concat', 'uglify']);
};