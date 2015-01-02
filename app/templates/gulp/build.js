'use strict'

var gulp = require('gulp')
var gulpIf = require('gulp-if')

var $ = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'main-bower-files', 'uglify-save-license', 'buildbranch']
})

gulp.task('styles', function () {
  return gulp.src('app/styles/*.scss')
  .pipe($.plumber())
  .pipe($.rubySass({
    style: 'expanded',
    compass: true
  }))
  .pipe($.autoprefixer('last 1 version'))
  .pipe(gulp.dest('.tmp/styles'))
  .pipe($.size())
})

gulp.task('partials', ['images'], function () {
  return gulp.src('app/partials/**/*.{slim,html}')
  .pipe(gulpIf(/\.slim$/i, $.slim({
    pretty: true,
    options: "attr_delims={'(' => ')', '[' => ']'}"
  })))
  .pipe($.img64({
    baseDir: '.tmp/images'
  }))
  .pipe($.minifyHtml({
    empty: true,
    spare: true,
    quotes: true
  }))
  .pipe($.ngHtml2js({
    moduleName: 'crammer.<%= fleck.inflect(appName, "underscore", "dasherize") %>',
    prefix: 'partials/'
  }))
  .pipe(gulp.dest('.tmp/partials'))
  .pipe($.size())
})

gulp.task('images', function () {
  return gulp.src('app/images/**/*')
  .pipe($.cache($.imagemin({
    optimizationLevel: 3,
    progressive: true,
    interlaced: true
  })))
  .pipe(gulp.dest('.tmp/images'))
  .pipe($.size())
})

function scriptAssets() {
  var jsFilter = $.filter('**/*.js')

  return gulp.src('app/*.html')
  .pipe($.inject(gulp.src('.tmp/partials/**/*.js'), {
    read: false,
    starttag: '<!-- inject:partials -->',
    addRootSlash: false,
    addPrefix: '../'
  }))
  .pipe($.useref.assets())
  .pipe(jsFilter)
  .pipe($.ngAnnotate())
  .pipe($.uglify({
    preserveComments: $.uglifySaveLicense
    // ,compress: {drop_debugger: false}
  }))
}

function styleAssets() {
  var cssFilter = $.filter('**/*.css')

  return gulp.src('app/*.html')
  .pipe($.useref.assets())
  .pipe(cssFilter)
  .pipe($.replace('bower_components/bootstrap-sass-official/assets/fonts/bootstrap','fonts'))
  .pipe($.csso())
}

gulp.task('crush', ['styles', 'partials'], function () {
  return gulp.src('app/*.html')
  .pipe($.inject(scriptAssets(), {
    name: 'crush',
    transform: function (filePath, file) {
      return '<script>' + file.contents.toString('utf8') + '</script>'
    }
  }))
  .pipe($.inject(styleAssets(), {
    name: 'crush',
    transform: function (filePath, file) {
      return '<style>' + file.contents.toString('utf8') + '</style>'
    }
  }))
  .pipe($.inject(gulp.src('app/art.txt'), {
    starttag: '<!doctype html>',
    endtag: '<html',
    transform: function (filePath, file) {
      return '<!--\n' + file.contents.toString('utf8') + '\n-->'
    }
  }))
  .pipe(gulp.dest('dist'))
  .pipe($.size())
})

gulp.task('clean', function () {
  return gulp.src(['.tmp', 'dist'], { read: false }).pipe($.rimraf())
})

gulp.task('cache:clear', function (done) {
  return $.cache.clearAll(done)
})

gulp.task('build', ['crush'])
