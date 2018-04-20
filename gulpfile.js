const { exec } = require('child_process')
const rimraf = require('rimraf')
const gulp = require('gulp-help')(require('gulp'))
const $plugins = require('gulp-load-plugins')()

const tsProject = $plugins.typescript.createProject('tsconfig.json')

gulp.task('default', ['help'])

gulp.task('lint', 'Lint the code.', () => (
  gulp.src('src/**/*.ts')
    .pipe($plugins.eslint())
    .pipe($plugins.eslint.format())
    .pipe($plugins.eslint.failAfterError())
))

gulp.task('clean', 'Clean build & dist directory.', (cb) => {
  rimraf('./+(build|dist)', cb)
})

gulp.task('build', 'Build the code into plain Javascript.', ['lint', 'clean'], () => (
  gulp.src('src/**/*.ts')
    .pipe(tsProject())
    .pipe(gulp.dest('./build'))
))

gulp.task('bundle', 'Bundle the code using Rolllup.', ['build'], (cb) => {
  exec('npx rollup -c', (err, stdout, stderr) => {
    console.log(stdout)
    console.log(stderr)
    cb(err)
  })
})

gulp.task('test', 'Run tests.', ['build'], (cb) => {
  exec('npx nyc japa', (err, stdout, stderr) => {
    console.log(stdout)
    console.log(stderr)
    cb(err)
  })
})
