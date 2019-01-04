const gulp      = require('gulp');
const concat    = require('gulp-concat');
const uglify    = require('gulp-uglify');
const gulpDocs  = require('gulp-ngdocs');
const clean     = require('gulp-clean');
const rename    = require('gulp-rename');
const through = require('through2');
const File = require('vinyl');

var fs = require('fs');

var env = {};

// See if there is an enviromental file with options to override
try {
    env = JSON.parse(fs.readFileSync('.env.json').toString());
} catch (e) {}

var target = {
    docs: env.docs || './docs'
};

function processScripts () {
    return gulp.src('./src/**/*.js')
        .pipe(concat('angular-screenfull.js'))
        .pipe(gulp.dest('./dist/'))
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('./dist/'));
};

const watch = function() {
    gulp.watch('./src/**/*.js', gulp.series(processScripts, ngdocs));
};

exports.watch = watch;

const ngdocs = gulp.series(cleanNgdocs, function ngdocs () {
    var options = {
        html5Mode: false,
        analytics: {
            account: 'UA-44454147-3',
            domainName: 'http://hrajchert.github.io/angular-screenfull/'
        },
        scripts: [
            'dist/angular-screenfull.js',
            'https://cdnjs.cloudflare.com/ajax/libs/screenfull.js/4.0.0/screenfull.js'
        ]
    };
    return gulp.src(['./src/**/*.js', './src/**/*.ngdoc'])
        .pipe(gulpDocs.process(options))
        .pipe(upgradeVynil())
        .pipe(gulp.dest(target.docs));
});

/**
 * gulp-watch/vinyl-source-stream uses an outdated vinyl, which doesn't have some functions which vinyl-fs expects.
 * Can be removed when gulp-watch updates it to vinyl 2.x.
 * @returns {NodeJS.ReadWriteStream}
 */
function upgradeVynil() {
    return through.obj(function(file, encoding, cb) {
      const upgradedFile = new File(file);
      cb(null, upgradedFile);
    });
  }

exports.ngdocs = ngdocs;
function cleanNgdocs() {
    return gulp.src(target.docs + '/*', {read:false})
        .pipe(clean({force: true}));
}

exports.release = gulp.series(processScripts, ngdocs);
exports.default = gulp.series(processScripts, ngdocs, watch);

