const { src, dest, parallel, series } = require('gulp')
const pug = require('gulp-pug')
const sass = require('gulp-sass')
const watch = require('gulp-watch')
const minifyCSS = require('gulp-csso')
const concat = require('gulp-concat')
const browsersync = require('browser-sync').create()
const del = require('del')

function css() {
  return src('./src/*.scss')
    .pipe(sass())
    .pipe(minifyCSS())
    .pipe(dest('build'))
}

function js() {
  return src('./src/*.js', { sourcemaps: true })
    .pipe(concat('js.min.js'))
    .pipe(dest('build', { sourcemaps: true }))
}

function html() {
  return src('./src/*.pug')
    .pipe(pug())
    .pipe(dest('build'))
}

function watchFiles() {
  watch('./src/*.scss', series(css, browserSyncReload))
  watch('./src/*.js', series(js, browserSyncReload))
  watch('./src/*.pug', series(html, browserSyncReload))
}

function browserSync(done) {
  browsersync.init({
    server: {
      baseDir: './build'
    },
    port: 3000
  });
  done()
}

function browserSyncReload(done) {
  browsersync.reload()
  done()
}

function clean() {
  return del(['./build/*'])
}

exports.clean = clean
exports.build = series(clean, parallel(css, js, html))
exports.default = parallel(watchFiles, browserSync)