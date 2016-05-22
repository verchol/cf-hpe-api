import gulp from 'gulp';
import eslint from 'gulp-eslint';
import babel from 'gulp-babel';
import mocha from 'gulp-mocha';
import bump from 'gulp-bump';
import git from 'gulp-git';
import runSequence from 'run-sequence';
import del from 'del';

gulp.task('lint', () =>
  gulp.src(['src/**/*.js', 'test/**/*.js'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError()));

gulp.task('test', () =>
  gulp.src(['test/**/*.unit.js'], { read: false })
    .pipe(mocha()));

gulp.task('bump-version', () => {
  gulp.src(['./package.json'])
    .pipe(bump())
    .pipe(gulp.dest('./'));
});

gulp.task('clean', () =>
  del(['dist']));

gulp.task('build', ['clean'], () =>
  gulp.src(['src/**/*.js'])
    .pipe(babel())
    .pipe(gulp.dest('dist')));

gulp.task('commit-changes', () =>
  gulp.src('.')
    .pipe(git.add())
    .pipe(git.commit('[Prerelease] Bumped version number')));

gulp.task('push-changes', (callback) =>
  git.push('origin', 'master', callback));

gulp.task('release', callback => {
  runSequence(
    'bump-version',
    'clean',
    'build',
    callback);
});
