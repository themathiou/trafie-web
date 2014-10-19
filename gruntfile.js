module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: ';'
      },
      dist: {
        //src: ['public/scripts/**/*.js'],
        src: [
            'public/scripts/libs/angular-file-upload-html5-shim.js',
            'public/scripts/libs/angular.min.js',
            'public/scripts/libs/angular-route.min.js',
            'public/scripts/libs/angular-animate.min.js',
            'public/scripts/libs/ui-bootstrap-0.10.0.min.js',
            'public/scripts/app.js',
            'public/scripts/controllers/*.js',
            'public/scripts/directives/*.js',
            'public/scripts/services/*.js',
            'public/scripts/scripts/*.js'
        ],
        dest: 'public/scripts/<%= pkg.name %>.js'
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      dist: {
        files: {
          'public/scripts/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');

  grunt.registerTask('default', ['concat', 'uglify']);
};