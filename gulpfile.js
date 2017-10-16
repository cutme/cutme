var gulp         = require('gulp'),
    gutil        = require('gulp-util'),
    jshint       = require('gulp-jshint'),
    compass      = require('compass-importer'),
    concat       = require('gulp-concat'),
    sass         = require('gulp-sass'),
    sassGlob     = require('gulp-sass-glob'),
    cssmin       = require('gulp-cssmin'),
    uglify       = require('gulp-uglify'),
    imagemin     = require('gulp-imagemin'),
    pngquant     = require('imagemin-pngquant'),
    watch        = require('gulp-watch'),
    newer        = require('gulp-newer'),
    manifest     = require('gulp-manifest'),
    fileinclude  = require('gulp-file-include'),
    autoprefixer = require('gulp-autoprefixer'),
    browserSync  = require('browser-sync').create(),
    gulpFilter   = require('gulp-filter'),
    gcmq         = require('gulp-group-css-media-queries'),
    bowerFiles   = require('gulp-main-bower-files'),
    w3cjs = require('gulp-w3cjs'),
    merge        = require('merge-stream'),
    spritesmith  = require('gulp.spritesmith'),
    batch = require('gulp-batch');


var config = {
  src: {
    root: 'src',
    img: 'src/img/**/*.{jpg,png,gif,svg}',
    js: [
      'src/js/*/*.js',
    ],
    fonts: 'src/fonts/**/*',
  },
  dist: {
    root: 'web',
    img: 'web/img',
    js: 'web/js',
    css: 'web/css',
    html: 'web',
    fonts: 'web/fonts',
  }
}

gulp.task('default', ['watch']);

gulp.task('jshint', function() {
    return gulp.src('src/js/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(concat('script.js'))
        .pipe(uglify())
        .on('error', function (err) { gutil.log(gutil.colors.red('[Error]'), err.toString()); })
        .pipe(gulp.dest('web/js/'))
        .pipe(browserSync.stream());
});

gulp.task('bower', function() {
	var jsFilter = gulpFilter('**/*.js', {restore: true})
	var cssFilter = gulpFilter('**/*.css', {restore: true})

    return gulp.src('./bower.json')
    	.pipe(bowerFiles())
    	.pipe(jsFilter)
        .pipe(concat('libs.js'))
        .pipe(uglify())
        .pipe(gulp.dest(config.dist.js))
        .pipe(jsFilter.restore)
        .pipe(cssFilter)
        .pipe(concat('libs.css'))
        .pipe(cssmin())
        .pipe(gulp.dest(config.dist.css))
});

gulp.task('sass', function() {
    return gulp.src('src/sass/**/*.scss')
      .pipe(sassGlob())
      .pipe(sass({ importer: compass }).on('error', sass.logError))
        .pipe(autoprefixer({
        browsers: ['last 5 versions', 'safari 5', 'ie 8' ,'ie 9', 'ie 10', 'ie 11', 'opera 12.1', 'ios 6', 'ios 7', 'Android >= 2.1'],
            cascade: false,
            add: true,
            remove: false
        }))
      .pipe(gcmq())
      .pipe(cssmin())
      .pipe(gulp.dest('web/css/'))
      .pipe(browserSync.stream());

});

gulp.task('img', function () {
    return gulp.src('src/img/**/*')
        .pipe(newer('web/img'))
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(gulp.dest('web/img'));
});

gulp.task('manifest', function(){
    gulp.src(['web/**/*'], { base: './web' })
        .pipe(manifest({
            hash: true,
            preferOnline: true,
            network: ['*'],
            filename: 'app.manifest',
            exclude: 'app.manifest'
        }))
        .pipe(gulp.dest('web'));
});

gulp.task('fileinclude', function() {
    gulp.src(['src/**/*.html'])
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        //.pipe(w3cjs())
        //.pipe(w3cjs.reporter())
        .pipe(gulp.dest('web/'))
        .pipe(browserSync.stream());        
});

gulp.task('sprite', function () {
    var spriteData = gulp.src('src/sprites/*.png').pipe(spritesmith({
        imgName     : 'sprites.png',
        cssName     : '_sprites.scss',
        cssTemplate : 'sprites.css.handlebars',
        padding     : 2,
        algorithm   : 'top-down'
    }));
    
    var imgStream = spriteData.img.pipe(gulp.dest('src/img/'));
    var cssStream = spriteData.css.pipe(gulp.dest('src/sass/tools/'));

    return merge(imgStream, cssStream);
});

gulp.task('w3cjs', function () {
    gulp.src('src/*.html')
        .pipe(w3cjs())
        .pipe(w3cjs.reporter());
});


gulp.task('browser-sync', function() {  
    browserSync.init(["css/*.css", "js/*.js"], {
        server: {
            baseDir: "./web"
        }
    });
});


gulp.task('default', ['sass', 'browser-sync'], function () {  
    watch("src/sass/**/*.scss", batch(function (events, done) {
        gulp.start('sass', done);
    }));
    
    watch("src/js/**/*.js", batch(function (events, done) {
        gulp.start('jshint', done);
    }));
    
    watch("src/img/**/*", batch(function (events, done) {
        gulp.start('img', done);
    }));
    
    watch("src/**/*.html", batch(function (events, done) {
        gulp.start('fileinclude', done);
    }));
    
    watch("src/includes/**/*.html", batch(function (events, done) {
        gulp.start('fileinclude', done);
    }));
});


