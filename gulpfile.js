var gulp = require('gulp'),
	gutil = require("gulp-util"),
	args = require('yargs').argv,
	$ = require('gulp-load-plugins')(),
	del = require('del'),
	historyApiFallback = require('connect-history-api-fallback'),
    webpackDevMiddleware = require('webpack-dev-middleware'),
    webpackHotMiddleware = require('webpack-hot-middleware'),
    webpack = require('webpack'),
    browserSync = require('browser-sync');
// production mode (see build task)
// Example:
//    gulp --prod
var isProduction = !!args.prod;
if (isProduction)
    log('Starting production build...');

var webpackConfig = require(
    isProduction ?
    './webpack.config.prod' :
    './webpack.config.dev'
);
var bundler = webpack(webpackConfig);

var paths = {
	app: 'src/',
	dist: 'dist/',
    assets: 'assets/',
    scripts: 'scripts/',
    static: 'scripts/static/'
}
// ignore everything that begins with underscore
var hidden_files = '**/_*.*';
var ignored_files = hidden_files;
// SOURCES CONFIG
var source = {
    scripts: {
        app: [paths.app + paths.scripts + '**/*.{jsx,js}'],
        static: [paths.app + paths.static + '**/*.js'],
        entry: [paths.app + paths.scripts + 'App.{jsx,js}']
    },
    images: [paths.app + paths.assets + 'img/**/*'],
    fonts: [
        paths.app + paths.assets + 'font/*.{ttf,woff,woff2,eof,svg}'
    ]
};
var build = {
    scripts: 
    {
    	//assets:paths.assets + 'js',
    	static:paths.dist + paths.assets + 'js/static'
    },
    styles: paths.dist +paths.assets + 'style',
    images: paths.dist +paths.assets + 'img',
    fonts: paths.dist + paths.assets + 'font'
};

gulp.task('images', function() {
    return gulp.src(source.images)
        .pipe(gulp.dest(build.images))
})
gulp.task('fonts', function() {
    return gulp.src(source.fonts)
        .pipe(gulp.dest(build.fonts))
})
gulp.task('static', function() {
    return gulp.src(source.scripts.static)
        .pipe(gulp.dest(build.scripts.static))
})

// Remove all files from dist folder
gulp.task('clean', function(done) {
    log('Clean dist folder..');
    del(paths.dist+paths.assets, {
        force: true // clean files outside current directory
    }, done);
    del(paths.dist+'index.html', {
        force: true // clean files outside current directory
    }, done);
});

// Serve files with auto reaload
gulp.task('browsersync', function() {
    log('Starting BrowserSync..');

    var middlewares = [historyApiFallback()];

    if (!isProduction) {
        middlewares = middlewares.concat([
            webpackDevMiddleware(bundler, {
                publicPath: webpackConfig.output.publicPath,
                stats: {
                    colors: true
                }
            }),
            webpackHotMiddleware(bundler)
        ])
    }

    browserSync({
        notify: false,
        server: {
            baseDir: paths.dist,
            middleware: middlewares
        },
        files: [source.scripts.app]
    });

});

gulp.task("webpack:build", function(callback) {
	webpack(webpackConfig, function(err, stats) {
	        if(err) throw new gutil.PluginError("webpack:build", err);
	        gutil.log("[webpack:build]", stats.toString({
	            colors: true
	        }));
	    });
	callback();
});

gulp.task("build", ["webpack:build"]);

gulp.task('default', function() {
  // 将你的默认的任务代码放在这
});

// log to console using
function log(msg) {
    $.util.log($.util.colors.blue(msg));
}