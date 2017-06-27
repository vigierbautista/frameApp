var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');


// Creamos el path para nuestros archivos.js
var paths = {
  sass: ['./scss/**/*.scss'],
  js: ['./www/js/*.js', './www/js/**/*.js'],
  dist: './www/dist/'
};

// Tarea por defecto
gulp.task('default', ['sass']);

// Creamos nuestra tarea para unificar los archivos de js.
gulp.task('js', function(done) {
  // Leemos todos los archivos de js.
  // gulp.src lee y guarda en memoria todos los archivos que le indicamos por parámetro.
  gulp.src(paths.js)
      // Le pasamos todos los archivos leidos en memoria al módulo de concatenación.
      // Recordar que la concatenación la estamos haciendo en memoria.
      .pipe(concat('bundle.js'))
      // Escribimos en disco el archivo utilizando gulp.dest
      .pipe(gulp.dest(paths.dist))
      // Imprimimos el mensaje de fin en la consola.
      .on('end', done);
});

// Definimos nuestro watcher para los js.
gulp.task('js:watch', ['js'], function() {
  // Observamos cambios en los archivos de js, y si detectamos alguno, llamamos a la tarea 'js'.
  gulp.watch(paths.js, ['js']);
});


gulp.task('sass', function(done) {
  gulp.src('./scss/ionic.app.scss')
    .pipe(sass())
    .on('error', sass.logError)
    .pipe(gulp.dest('./www/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});

gulp.task('watch', ['sass'], function() {
  gulp.watch(paths.sass, ['sass']);
});

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});
