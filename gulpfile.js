const { exec } = require('child_process')
const merge = require('merge2')
const rimraf = require('rimraf')
const gulp = require('gulp-help')(require('gulp'))
const $plugins = require('gulp-load-plugins')()
const tsCJSProject = $plugins.typescript.createProject('tsconfig.cjs.json')
const tsESMProject = $plugins.typescript.createProject('tsconfig.esm.json')

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

gulp.task('build', 'Build the code into plain Javascript.', ['lint', 'clean'], () => {
  gulp.src('src/**/*.ts')
    .pipe(tsCJSProject())
    .pipe(gulp.dest('./dist/cjs'))

  const esm = gulp.src('src/**/*.ts')
    .pipe(tsESMProject())

  return merge([
    esm.dts.pipe(gulp.dest('./types')),
    esm.js.pipe(gulp.dest('./dist/esm')),
  ])
})

gulp.task('bundle', 'Bundle the code using Rolllup.', ['test', 'build'], (cb) => {
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
