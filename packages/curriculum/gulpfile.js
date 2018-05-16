const gulp = require('gulp');
const util = require('gulp-util');
const jsonMinify = require('gulp-json-minify');
const babel = require('gulp-babel');

gulp.task('json:minify', function() {
  return gulp.src('./challenges/**/*.json')
      .pipe(jsonMinify())
      .pipe(gulp.dest('dist/challenges/'))
      .on('error', util.log);
});

gulp.task('babel-getChallenges', () =>
  gulp.src('./getChallenges.js')
    .pipe(babel({
      presets: ['env']
    }))
    .pipe(gulp.dest('dist'))
);

gulp.task('babel', ['babel-getChallenges'], () =>
gulp.src('./index.js')
		.pipe(babel({
			presets: ['env']
		}))
    .pipe(gulp.dest('dist'))
  );
