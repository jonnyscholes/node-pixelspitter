var stream = require('stream');
var util = require('util');

/*
* Creates a readable stream of RGB values from a canvas object in the order in which they appear.
* @constructor
* @param {object} canvas - A canvas object
* @param {integer} reverse - Spit out colors in reverse order (bottom right to top left)
*/

function PixelSpitter(canvas, reverse) {
  if (!(this instanceof PixelSpitter)) {
    return new PixelSpitter(canvas);
  }

  stream.Readable.call(this);

  this.options = {};

  if (reverse === undefined) reverse = false;
  this.options.reverse = reverse;

  //@todo @lookinto: Work around not implemented error
  this._read = function noop() {};

  this.parse(canvas);
}

util.inherits(PixelSpitter, stream.Readable);


PixelSpitter.prototype.parse = function(canvas) {
  var ctx = canvas.getContext('2d');
  var imgd = ctx.getImageData(0, 0, canvas.width, canvas.height);

  if (this.options.reverse) {
    for (var y = canvas.height-1; y >= 0; --y) {
      for (var x = 0; x < canvas.width; ++x) {
        var i = (y * canvas.width + x) * 4;
        this.push(imgd.data[i]+','+imgd.data[++i]+','+imgd.data[++i]);
      }
    }
  } else {
    for (var y = 0; y < canvas.height; ++y) {
      var i = (y * canvas.width + x) * 4;
      this.push(imgd.data[i]+','+imgd.data[++i]+','+imgd.data[++i]);
    }
  }
};

PixelSpitter.prototype.rgbToInt = function(r, g, b) {
  return (r << 0x10) + (g << 0x8) + (b << 0x0);
};

module.exports = PixelSpitter;