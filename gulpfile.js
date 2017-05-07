var gulp = require("gulp");
require("require-dir")("gulp");

// just compiles the plugins
gulp.task("default", ["build-plugins"], function(){});