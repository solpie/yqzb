var gulp = require('gulp');
var path = require('path');
var less = require('gulp-less');
var minifyCSS = require('gulp-minify-css');
var run = require('gulp-run');
var NwBuilder = require('nw-builder');
//setting
var nwjsVersion = "0.12.3";
var isDev = true;
var tsc = function () {
    return run('tsc --out src/main.js src/ts/main.ts').exec();
};
var runNw = function () {
    return run(path.join('cache', nwjsVersion, "win64", "nw.exe") + " src").exec();
};
gulp.task('ts', function () {
    run('tsc --out src/main.js src/ts/main.ts').exec();
    //run('tsc --out src/main.js src/ts/main.ts --module commonjs').exec();
});
gulp.task("less", function () {
    if (isDev)
        return gulp.src('./src/less/style.less')
            .pipe(less({
                paths: [path.join(__dirname, 'less', 'includes')]
            }))

            .pipe(gulp.dest('./src/'));
    //.pipe(tsc())
    //.pipe(runNw());
    else
        return gulp.src('./src/less/style.less')
            .pipe(less({
                paths: [path.join(__dirname, 'less', 'includes')]
            }))
            .pipe(minifyCSS())
            .pipe(gulp.dest('./src/'));
});
gulp.task("nwjs", function () {
    var nw = new NwBuilder({
        files: [
            // './src/**/*.png',
            // './src/**/*.db',
            './src/**/*.gif',
            './src/**/*.json',
            './src/**/*.ejs',
            './src/**/*.js',
            './src/**/*.css',
            './src/**/*.html'
        ], // use the glob format
        version: nwjsVersion,
        run: './src', // use the glob format
        platforms: ['win64']
    });

//Log stuff you want
    nw.on('log', console.log);

// Build returns a promise
    nw.build().then(function () {
        var destPath = 'build/YuanQiTv/win64';
        console.log('all done!');
        gulp.src('./src/js/**/*.js')
            .pipe(gulp.dest(destPath+"/js"));
        gulp.src('./src/**/*.png')
            .pipe(gulp.dest(destPath));
        // gulp.src('./src/**/*.db')
        //     .pipe(gulp.dest(destPath));
        gulp.src('./src/**/*.css')
            .pipe(gulp.dest(destPath));
        gulp.src('./src/**/*.pdf')
            .pipe(gulp.dest(destPath));
        // gulp.src('./src/**/config.json')
        //     .pipe(gulp.dest(destPath));
    }).catch(function (error) {
        console.error(error);
    });

});
gulp.task("run", function () {
    run(path.join('cache', nwjsVersion, "win64", "nw.exe") + " src").exec();
});
gulp.task("dev-run", function () {
    run(path.join('cache', nwjsVersion, "win64", "nw.exe") + " src").exec();
});
//gulp.task("default", ["ts", "less", "nwjs"]);
//gulp.task("default", ["ts", "less"]);
gulp.task("default", ["nwjs"]);
//gulp.task("default", ["less"]);