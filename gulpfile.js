var gulp = require('gulp'),
    sass = require('gulp-sass'),
    jade = require('gulp-jade'),
    autoprefixer = require('gulp-autoprefixer'),
    connect = require('gulp-connect'),
    plumber = require('gulp-plumber'),
    del = require('del'),
    deploy = require('gulp-gh-pages'),
    watch = require('gulp-watch'),
    sass = require('gulp-sass'),
    neat = require('node-neat').includePaths,
    normalize = require('node-normalize-scss').includePaths;

var paths = {
    scss: './assets/sass/*.scss'
};

var DEPLOY_OPTIONS = {
    remoteUrl: 'git@github.com:harshai/cloud-physician.git',
    branch: 'master'
};

gulp.task('clean', function (cb) {
    return del([
        './build/**/*'
    ]);
});

gulp.task('css', function () {
    gulp.src('app/styles/*.scss')
        .pipe(plumber(''))
        .pipe(autoprefixer())
        .pipe(sass({
            includePaths: ['styles'].concat(neat).concat(normalize)
        }))
        .pipe(gulp.dest('./build/styles'))
        .pipe(connect.reload());
});

gulp.task('html', function () {
    gulp.src('app/*.jade')
        .pipe(plumber(''))
        .pipe(jade())
        .pipe(gulp.dest('./build'))
        .pipe(connect.reload());
});

gulp.task('js', function () {
    gulp.src(['app/js/**/*', '!gulpfile.js'])
        .pipe(plumber(''))
        .pipe(gulp.dest('./build/js'))
        .pipe(connect.reload());
});

gulp.task('assets', function() {
    gulp.src(['app/assets/**/*'])
        .pipe(plumber(''))
        .pipe(gulp.dest('./build/assets'))
        .pipe(connect.reload());
});


// gulp.task('appcache', function () {
//     gulp.src('app/*.appcache')
//         .pipe(gulp.dest('./build'))
//         .pipe(connect.reload());
// })

gulp.task('config', function() {
    gulp.src(['app/config/**/*'])
        .pipe(plumber(''))
        .pipe(gulp.dest('./build'))
        .pipe(connect.reload());
});

gulp.task('watch', function() {
  gulp.watch('app/styles/**/*', ['css']);
  gulp.watch('app/js/*.js', ['js']);
  gulp.watch('app/assets/*', ['assets']);
  gulp.watch('app/**/*.jade', ['html']);
  watch('./build/**/*').pipe(connect.reload());
});

gulp.task('serve', ['build'], function() {
  connect.server({
    root: 'build',
    livereload: true
  });
});

gulp.task('deploy', function () {
    return gulp.src('./build/**/*')
        .pipe(deploy(DEPLOY_OPTIONS));
});

gulp.task('build', ['clean', 'html', 'css', 'js', 'assets', 'config']);

gulp.task('default', ['serve', 'watch']);
