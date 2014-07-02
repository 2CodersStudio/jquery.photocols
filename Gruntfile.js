module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    clean: ["dist"],
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: '<%= pkg.name %>.js',
        dest: 'dist/<%= pkg.name %>.min.js'
      }
    }
  });

  // Libraries
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-clean');

  // Default task(s).
  grunt.registerTask('default', ['clean','uglify']);

};
