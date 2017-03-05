const gulp = require('gulp');
const ts = require('gulp-typescript');
const sourcemaps = require('gulp-sourcemaps');
const ava = require('gulp-ava');
const tslint = require('gulp-tslint');
const del = require('del');

const tsProject = ts.createProject('tsconfig.json');
const paths = {
  fixturesOut: './out/test/fixtures',
  fixturesIn: ['./src/test/fixtures/**'],
  testsOut: ['./out/test/**'],
  source: ['./src/**/*.ts'],
  nonTsSource: ['./src/**', '!./src/**/*.ts'],
};

gulp.task('lint', () =>
  gulp.src(paths.source)
    .pipe(tslint({
      formatter: 'stylish',
    }))
    .pipe(tslint.report({
      emitError: false,
    })));

gulp.task('scripts', ['clean:tests', 'clean:scripts'], () => {
  gulp.src(paths.nonTsSource)
    .pipe(gulp.dest('./out'));
  const tsResult = gulp.src(paths.source)
    .pipe(sourcemaps.init())
    .pipe(tsProject());
  return tsResult.js.pipe(sourcemaps.write('.', { destPath: './out' }))
    .pipe(gulp.dest('./out'));
});

gulp.task('clean:scripts', () =>
  del('./out/**', '!./out/', '!./out/test'));
gulp.task('clean:tests', () =>
  del(paths.testsOut));
gulp.task('clean', ['clean:scripts', 'clean:tests']);

gulp.task('watch', ['lint', 'scripts'], () =>
  gulp.watch(paths.source, ['lint', 'scripts']));

gulp.task('test', ['lint', 'scripts'], () => {
  gulp.src(paths.fixturesIn)
    .pipe(gulp.dest(paths.fixturesOut));
  return gulp.src(paths.testsOut)
    .pipe(ava({ verbose: true }));
});

gulp.task('test:watch', ['test'], () =>
  gulp.watch(paths.source, ['test']));

gulp.task('default', ['watch']);
