const AUTOPREFIXER_BROWSERS = [
    'ie >= 8',
    'ie_mob >= 8',
    'ff >= 30',
    'chrome >= 34',
    'safari >= 7',
    'opera >= 23',
    'ios >= 7',
    'android >= 4.4',
    'bb >= 8'
]

gulp.task('moveDefineCSS', () => {
    // 将less变量和函数转移到新文件夹
    gulp.src([ 'resources/css/define/**/*.less' ])
        .pipe(gulp.dest('.tmp/less'))
})

gulp.task('css', ['moveDefineCSS'], () => {

    let filename = []

    // 转换less
    gulp.src([ 'resources/css/**/*.less', '!resources/css/define/**/*.less' ])
        .pipe(through.obj(function(file, enc, callback) {
            filename.push(file.relative)
            file.contents = Buffer.from(
                '@import (reference) "variable";\n'
                + '@import (once) "mixins";\n\n'
                + file.contents.toString()
            )
            this.push(file)
            callback()
        }))
        .pipe(gulp.dest('.tmp/less'))
        .pipe($.less())
        .pipe($.autoprefixer(AUTOPREFIXER_BROWSERS))
        .pipe($.cssnano())
        .pipe(gulp.dest('dist/css'))

    // pack
    gulp.src([ 'resources/css/**/*.css', '!resources/css/nano/*.css' ])
        .pipe($.newer('.tmp/css'))
        .pipe($.sourcemaps.init())
        .pipe($.autoprefixer(AUTOPREFIXER_BROWSERS))
        // .pipe($.if('*.css', $.cssnano()))
        .pipe($.size({ title: 'css' }))
        .pipe($.sourcemaps.write('./'))
        .on('error', swallowError)
        .pipe(gulp.dest('dist/css'))
})

CONFIG.nanocss && gulp.task('nanoCSS', () => {
    gulp.src([ 'resources/css/nano/*.{less,css}' ])
        .pipe($.newer('.tmp/nanoCSS'))
        .pipe($.sourcemaps.init())
        .pipe($.autoprefixer(AUTOPREFIXER_BROWSERS))
        .pipe(gulp.dest('.tmp/nanoCSS'))
        .pipe($.if('*.css', $.cssnano()))
        .pipe($.concat('nanocss.min.css'))
        .pipe($.size({ title: 'nanoCSS' }))
        .pipe($.sourcemaps.write('./'))
        .on('error', swallowError)
        .pipe(gulp.dest('dist/css'))
})
