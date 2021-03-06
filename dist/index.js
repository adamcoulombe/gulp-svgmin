'use strict';

var _stream = require('stream');

var _svgo = require('svgo');

var _svgo2 = _interopRequireDefault(_svgo);

var _gulpUtil = require('gulp-util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PLUGIN_NAME = 'gulp-svgmin';

module.exports = function (opts) {
    var stream = new _stream.Transform({ objectMode: true });
    var svgo = void 0;

    if (typeof opts !== 'function') {
        svgo = new _svgo2.default(opts);
    }

    stream._transform = function (file, encoding, cb) {
        if (file.isNull()) {
            return cb(null, file);
        }

        if (file.isStream()) {
            return cb(new _gulpUtil.PluginError(PLUGIN_NAME, 'Streaming not supported'));
        }

        if (file.isBuffer()) {
            if (typeof opts === 'function') {
                svgo = new _svgo2.default(opts(file));
            }

            svgo.optimize(String(file.contents), function (result) {
                if (result.error) {
                    return cb(new _gulpUtil.PluginError(PLUGIN_NAME, result.error));
                }
                file.contents = new Buffer(result.data);
                cb(null, file);
            });
        }
    };

    return stream;
};