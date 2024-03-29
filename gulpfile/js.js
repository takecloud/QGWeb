const TestJSFiles = [
    'resources/js/@test.js',
]

// 转换ES6语法
gulp.task('convertLogic', () => {
    gulp.src('resources/views/logic/es6/**/*.js')
        .pipe($.changed('.tmp/logic', { hasChanged: $.changed.compareSha1Digest }))
        .pipe($.newer('.tmp/logic'))
        .pipe($.babel())
        .pipe($.uglify())
        .on('error', swallowError)
        .pipe(gulp.dest('dist/views/logic/packed'))
})

// 打包非插件JS
gulp.task('js', () => {
    gulp.src([ 
        'resources/js/*.js',
        '!resources/js/util/*.js',
        ...TestJSFiles.map(x => '!' + x)
    ])
        .pipe($.changed('.tmp/js', { hasChanged: $.changed.compareSha1Digest }))
        .pipe($.newer('.tmp/js'))
        .pipe($.sourcemaps.init())
        .pipe($.babel())
        .pipe($.sourcemaps.write())
        .pipe(gulp.dest('.tmp/js'))
        .pipe($.uglify())
        .pipe($.size({ title: 'js' }))
        .pipe($.sourcemaps.write('.'))
        .on('error', swallowError)
        .pipe(gulp.dest('dist/js'))
})

// 引入的插件JS,通常是min.js,不需要再进行babel编译等处理
gulp.task('utiljs', () => {
    gulp.src([ 'resources/js/util/*.js' ])
        .pipe($.changed('.tmp/utiljs', { hasChanged: $.changed.compareSha1Digest }))
        // .pipe($.newer('.tmp/utiljs'))
        // .pipe(gulp.dest('.tmp/utiljs'))
        // .pipe($.size({ title: 'utiljs' }))
        .on('error', swallowError)
        .pipe(gulp.dest('dist/js/util'))
})

// 打包所有JS
gulp.task('ALL:js', ['utiljs', 'js', 'convertLogic'], () => {
    console.log('JS Packed Success')
})