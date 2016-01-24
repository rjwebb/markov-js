var gulp = require('gulp'),
    connect = require('gulp-connect');

/*
Tasks for copying dependencies to the application
*/
gulp.task('copy-css', function() {
  return gulp.src(['bower_components/bootstrap/dist/css/bootstrap.min.css',
		   'bower_components/bootstrap/dist/css/bootstrap-theme.min.css'
		  ])
    .pipe(gulp.dest('css'));
});

gulp.task('copy-js', function() {
  return gulp.src(['bower_components/bootstrap/dist/js/bootstrap.min.js',
		   'bower_components/jquery/dist/jquery.min.js',
		   'bower_components/underscore/underscore-min.js'
		  ])
    .pipe(gulp.dest('js'));
});

gulp.task('connect', function() {
  connect.server();
});


gulp.task('copy', ['copy-css', 'copy-js']);

gulp.task('default', ['copy', 'connect']);
