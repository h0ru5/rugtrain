/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    meta: {
      version: '0.0.1'
    },
    banner: '/*! RugTrain - v<%= meta.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '* http://training.munich-rugbears.de/shiny/\n' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> ' +
      'h0ru5; Licensed MIT */\n',
    // Task configuration.
    concat: {
      options: {
        banner: '<%= banner %>',
        stripBanners: true
      },
      train: {
        src: ['js/lib/jquery.timeago.js','js/lib/jquery.timeago.de.js','js/lib/angular-locale_de.js','js/ng-directives/autocomplete.js','js/ng-directives/dialog.js',
            'js/ng-modules/pdate.js','js/ng-modules/timeago.js','js/ng-directives/jqButton.js','js/controllers/training.js'],
        dest: 'js/dist/train-all.js'
      },
      shiny: {
        src: ['js/lib/jquery.timeago.js','js/lib/jquery.timeago.de.js','js/lib/ui-bootstrap.min.js','js/lib/bootstrap.js','js/lib/guiders-1.3.0.js',
            'js/ng-modules/pdate.js','js/ng-modules/timeago.js','js/controllers/shiny.js'],
        dest: 'js/dist/shiny-all.js'
      },
    admin: {
        src: ['js/lib/jquery.dataTables.js','js/lib/angular-ui.min.js','js/ng-directives/datatable.js','js/ng-directives/dialog.js','js/ng-directives/addButton.js','js/controllers/admin.js'],
        dest: 'js/dist/admin-all.js'
      }
    },
    uglify: {
      options: {
        banner: '<%= banner %>'
      },
      admin: {
        src: '<%= concat.admin.dest %>',
        dest: 'js/dist/admin-all.min.js'
      },
      train: {
        src: '<%= concat.train.dest %>',
        dest: 'js/dist/train-all.min.js'
      },
      shiny: {
        src: '<%= concat.shiny.dest %>',
        dest: 'js/dist/shiny-all.min.js'
      }
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  
  // Default task.
  grunt.registerTask('train', ['concat:train', 'uglify:train']);
  grunt.registerTask('shiny', ['concat:shiny', 'uglify:shiny']);
  grunt.registerTask('default', ['concat', 'uglify']);

};
