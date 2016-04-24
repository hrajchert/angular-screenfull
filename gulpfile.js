var gulp      = require('gulp'),
    concat    = require('gulp-concat'),
    uglify    = require('gulp-uglify'),
    gulpDocs  = require('gulp-ngdocs'),
    clean     = require('gulp-clean'),
    rename    = require('gulp-rename');

var fs = require('fs');

var env = {};

// See if there is an enviromental file with options to override
try {
    env = JSON.parse(fs.readFileSync('.env.json').toString());
} catch (e) {}

var target = {
    docs: env.docs || './docs'
};

gulp.task('process-scripts', function() {
    return gulp.src('./src/**/*.js')
        .pipe(concat('angular-screenfull.js'))
        .pipe(gulp.dest('./dist/'))
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('./dist/'));

});

gulp.task('watch', function() {
    gulp.watch('./src/**/*.js', ['process-scripts', 'ngdocs']);

});

gulp.task('ngdocs', ['clean-ngdocs'], function () {
    var options = {
        html5Mode: false,
        analytics: {
            account: 'UA-44454147-3',
            domainName: 'http://hrajchert.github.io/angular-screenfull/'
        },
        scripts: [
            'dist/angular-screenfull.js',
            'https://cdnjs.cloudflare.com/ajax/libs/screenfull.js/3.0.0/screenfull.js'
        ]
    };
    return gulp.src(['./src/**/*.js', './src/**/*.ngdoc'])
        .pipe(gulpDocs.process(options))
        .pipe(gulp.dest(target.docs));
});

gulp.task('clean-ngdocs', function() {
    return gulp.src(target.docs + '/*', {read:false})
        .pipe(clean({force: true}));
});

gulp.task('release', ['process-scripts', 'ngdocs']);

gulp.task('default', ['process-scripts', 'ngdocs', 'watch']);
