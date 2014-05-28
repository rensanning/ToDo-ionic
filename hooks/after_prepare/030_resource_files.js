#!/usr/bin/env node
 
var filestocopy = [{
    "www/res/android/icon-96-xhdpi.png": 
    "platforms/android/res/drawable/icon.png"
}, {
    "www/res/android/icon-36-ldpi.png": 
    "platforms/android/res/drawable-ldpi/icon.png"
}, {
    "www/res/android/icon-48-mdpi.png": 
    "platforms/android/res/drawable-mdpi/icon.png"
}, {
    "www/res/android/icon-72-hdpi.png": 
    "platforms/android/res/drawable-hdpi/icon.png"
}, {
    "www/res/android/icon-96-xhdpi.png": 
    "platforms/android/res/drawable-xhdpi/icon.png"
}, {
    "www/res/android/screen-xhdpi-portrait.png": 
    "platforms/android/res/drawable/splash.png"
}, {
    "www/res/android/screen-ldpi-portrait.png": 
    "platforms/android/res/drawable-ldpi/splash.png"
}, {
    "www/res/android/screen-mdpi-portrait.png": 
    "platforms/android/res/drawable-mdpi/splash.png"
}, {
    "www/res/android/screen-hdpi-portrait.png": 
    "platforms/android/res/drawable-hdpi/splash.png"
}, {
    "www/res/android/screen-xhdpi-portrait.png": 
    "platforms/android/res/drawable-xhdpi/splash.png"
}];
 
var fs = require('fs');
var path = require('path');
 
var rootdir = process.argv[2];
 
filestocopy.forEach(function(obj) {
    Object.keys(obj).forEach(function(key) {
        var val = obj[key];
        var srcfile = path.join(rootdir, key);
        var destfile = path.join(rootdir, val);
        var destdir = path.dirname(destfile);
        if (fs.existsSync(srcfile) && fs.existsSync(destdir)) {
            fs.createReadStream(srcfile).pipe(
               fs.createWriteStream(destfile));
        }
    });
});