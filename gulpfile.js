'use strict';

var gulp = require('gulp');
var angularFilesort = require('gulp-angular-filesort');
var bower = require('gulp-bower');
var inject = require('gulp-inject');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var watch = require('gulp-watch');
var mainBowerFiles = require('main-bower-files');
var merge = require('merge-stream');
var runSequence = require('run-sequence');

// =============== Setup, Dev & Prod Task =========

gulp.task('setup', function() {
  runSequence('bower',
    'generateView',
    'sass',
    'inject');
});

// For dev purposes only
// Must have bower & npm install done prior
gulp.task('dev', function() {
  runSequence('generateView',
    'sass',
    'inject');
});

gulp.task('bower', function() {
  return bower({
    cmd: 'install'
  });
});

// =============== End: Setup, Dev & Prod Task =========

// =============== Tasks: Generate View =========
gulp.task('generateView', function() {
  // createIndexHtml stream
  var createIndexHtml = gulp.src('./www/main-view/pre-index.html')
                            .pipe(rename('index.html'))
                            .pipe(gulp.dest('./www/'));
  // End: createIndexHtml stream

  // compileModuleSass stream
  var compileModuleSass = gulp.src('./www/modules/**/*.scss')
                              .pipe(sass().on('error', sass.logError))
                              .pipe(gulp.dest('./www/modules'));
  // End: compileModuleSass stream

  return merge(compileModuleSass, createIndexHtml);
});
// =============== End: Tasks: Generate View =========

// =============== Tasks: SASS =========
gulp.task('sass', function() {
  gulp.src('./www/modules/**/*.scss')
      .pipe(sass().on('error', sass.logError))
      .pipe(gulp.dest('./www/modules'));
});

gulp.task('watchSass', function() {
  gulp.watch('./www/modules/**/*.scss', ['sass']);
});
// =============== End: Tasks: SASS =========

// =============== Tasks: Inject =========
gulp.task('inject', function() {
  runSequence('inject-bower',
    'inject-angular',
    'inject-css');
});

gulp.task('inject-bower', function() {
  var bowerOptions = {
    paths: {
      bowerDirectory: './www/lib',
      bowerrc: './.bowerrc',
      bowerJson: './bower.json'
    }
  };

  var target = gulp.src('./www/index.html');
  var sources = gulp.src(mainBowerFiles(bowerOptions), {
    read: false
  });

  return target.pipe(inject(sources, {
          name: 'bower',
          relative: 'true'
        }))
        .pipe(gulp.dest('./www/'));
});

gulp.task('inject-angular', function() {
  var target = gulp.src('./www/index.html');
  var sources = gulp.src(['./www/modules/**/*.js'])
                    .pipe(angularFilesort());

  return target.pipe(inject(sources, {
                  name: 'angular',
                  relative: 'true'
                }))
                .pipe(gulp.dest('./www/'));
});

gulp.task('inject-css', function() {
  var target = gulp.src('./www/index.html');
  var sources = gulp.src(['./www/modules/**/*.css']);

  return target.pipe(inject(sources, {
                  relative: 'true'
                }))
                .pipe(gulp.dest('./www/'));
});
// =============== End: Tasks: Inject =========

// =============== Tasks: Watch =========
gulp.task('watch', ['watchSass']);
// =============== End: Tasks: Watch =========