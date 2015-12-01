'use strict';

// gulp
var gulp = require('gulp');

// plugins
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var minifyCSS = require('gulp-minify-css');
var runSequence = require('run-sequence');
var del = require('del');
var browserify = require('gulp-browserify');
var concat = require('gulp-concat');
var bower = require('gulp-bower');
var browserSync = require('browser-sync').create();
var notify = require('gulp-notify');

// tasks
gulp.task('clean', function(callback) {
  return del('./build');
});

gulp.task('data', function() {
  return gulp.src('./src/data/**')
    .pipe(gulp.dest('build/data'));
});
// ensure the task is complete before reloading
gulp.task('data-watch', ['data'], browserSync.reload);


gulp.task('browserify', function() {
  // Single point of entry (make sure not to src ALL your files, browserify will figure it out for you)
  return gulp.src(['src/js/main.js'])
    .pipe(browserify({
      insertGlobals: true,
      debug: true
    }))
    .pipe(gulp.dest('./build/js'));
});
gulp.task('js', function() {
  return gulp.src('src/js/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(jshint.reporter('fail'))
});
// ensure the task is complete before reloading
gulp.task('js-watch', ['js',  'browserify'], browserSync.reload);


gulp.task('css', function() {
  return gulp.src(['./src/**/*.css', '!./src/bower_components/**'])
    .pipe(minifyCSS({comments:true,spare:true}))
    .pipe(gulp.dest('./build'));
});
// ensure the task is complete before reloading
gulp.task('css-watch', ['css'], browserSync.reload);

gulp.task('copy-bower-components', function () {  
  return gulp.src('./src/bower_components/**')
    .pipe(gulp.dest('build/bower_components'));
});

// Views task
gulp.task('views', function() {
  // Get our index.html
  return gulp.src(['src/**/*.html', './build/partials/'])
    // And put it in the dist folder
    .pipe(gulp.dest('./build'));
});
// ensure the task is complete before reloading
gulp.task('views-watch', ['views'], browserSync.reload);

gulp.task('browser-sync', function(callback) {  
  browserSync.init({
      server: {
          baseDir: 'build'
      }
  }, callback);

  gulp.watch(['src/js/*.js', 'src/js/**/*.js'], ['js-watch']);
  gulp.watch(['src/css/*.css', 'src/css/**/*.css'], ['css-watch']);
  gulp.watch(['src/*.html', 'src/partials/**/*'], ['views-watch']);
  gulp.watch(['src/data/**/*'], ['data-watch']);
    
});


// *** build task *** //
gulp.task('build', function (callback) {
  runSequence('clean', ['js', 'browserify', 'data', 'views', 'css', 'copy-bower-components'], callback);
});


// *** default task *** //
gulp.task('default', ['build', 'browser-sync']);


