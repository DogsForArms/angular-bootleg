var gulp = require('gulp');
var awspublish = require('gulp-awspublish');
var exec = require('child_process').exec;

gulp.task('build', function (cb) {
  exec('ng build', {maxBuffer: 1024 * 500}, function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });
});

gulp.task('s3:production', ['build'], function() {
    var localConfig = {
      buildSrc: './dist/**/*',
      getAwsConf: function (environment) {
        var conf = require('./awsConfig');
        if (!conf[environment]) {
          throw 'No aws conf for env: ' + environment;
        }
        if (!conf[environment + 'Headers']) {
          throw 'No aws headers for env: ' + environment;
        }
        return { keys: conf[environment], headers: conf[environment + 'Headers'] };
      }
    };

  var awsConf = localConfig.getAwsConf('production');
  var publisher = awspublish.create(awsConf.keys);
  return gulp.src(localConfig.buildSrc)
    .pipe(awspublish.gzip({ ext: '' }))
    .pipe(publisher.publish(awsConf.headers))
    .pipe(publisher.cache())
    .pipe(publisher.sync())
    .pipe(awspublish.reporter());
});
