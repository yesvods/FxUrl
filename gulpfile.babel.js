import gulp from 'gulp';
import del from 'del'
import webpack from 'gulp-webpack';
import named from 'vinyl-named';
import uglify from 'gulp-uglifyjs';
import zip from 'gulp-zip';

gulp.task('clean', done => {
  return del('dist')
});

gulp.task('move', ['clean'],done => {
  return gulp.src(['src/**/*.*', 'src/lib/qrcode.js'])
    .pipe(gulp.dest('dist'));
});

gulp.task('prebuild', ['clean', 'move'],done => {
  return gulp.src(['./src/lib/index.js'])
    .pipe(named())
    .pipe(webpack({
      // watch: true,
      // format: 'iife',
      module: {
        loaders: [{
          test: /\.js$/,
          loader: 'babel',
          exclude: /(node_modules|bower_components|test)/,
          query: {
            presets: ['es2015', 'stage-0']
          }
        },
        { test: /\.css$/, loader: 'style!css' },
        { test: /\.(png|jpg|jpeg)$/, loader: 'url-loader?limit=8192' },
        { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url-loader?limit=10000&minetype=application/font-woff" },
        { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader" }]
      }
    }))
    .pipe(gulp.dest('dist/lib'));
});

gulp.task('distbuild', ['clean', 'move'],done => {
  return gulp.src(['./src/lib/index.js'])
    .pipe(named())
    .pipe(webpack({
      // watch: true,
      // format: 'iife',
      module: {
        loaders: [{
          test: /\.js$/,
          loader: 'babel',
          exclude: /(node_modules|bower_components|test)/,
          query: {
            presets: ['es2015', 'stage-0']
          }
        }]
      }
    }))
    .pipe(uglify())
    .pipe(gulp.dest('dist/lib'));
});

gulp.task('build', ['distbuild'], done => {
  return gulp.src('dist/**/*.*')
          .pipe(zip('dist.zip'))
          .pipe(gulp.dest('.'))
})


gulp.task('dev', done => {
  gulp.watch(['src/lib/index.js', 'src/lib/**/*.*'], ["prebuild"]);
})