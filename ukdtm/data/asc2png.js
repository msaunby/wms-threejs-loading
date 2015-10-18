// asc2png.js

var fs = require("fs"),
  readline = require('readline'),
  PNG = require("node-png").PNG;


// After header read, we'll have something like -
//{ ncols: 500,
//  nrows: 500,
//  xllcorner: 257000,
//  yllcorner: 100000,
//  cellsize: 2,
//  NODATA_value: -9999 }

function makePng(wid, hei, data, min, max){
  var png = new PNG({width:wid,height:hei});
  var idx = 0;
  var v;
  for (var y = 0; y < hei; y++) {
      for (var x = 0; x < wid; x++) {
        v = (data[y][x] - min) * (256.0/(max-min));
        png.data[idx  ] = v; // r
        png.data[idx+1] = v; // g
        png.data[idx+2] = v; // b
        png.data[idx+3] = 0xff;
        idx +=4;
      }
    }
  return png;
}

var min = Number(process.argv[2]);
var max = Number(process.argv[3]);
var infiles = process.argv.slice(4);

process.on('exit', function(code) {
  console.log("All done.");
});

infiles.forEach(function(element, index, array){
var src = fs.createReadStream(element);
var outname = element.substr(0, element.lastIndexOf(".")) + ".png";
var dst = fs.createWriteStream(outname);
var rawRows = [];
var lineno = 0;
var hdr = {};
readline.createInterface({
    input: src,
    terminal: false
}).on('line', function(line) {
   if(lineno < 6){
     hdr[line.split(/ +/)[0]] = Number(line.split(/ +/)[1]);

   }else{
     var row = line.split(/ +/);
     row.forEach(function(el,idx,array){array[idx] = Number(el);})
     row.shift(); // remove first, empty, element. Consequence of split()
     rawRows.push(row);
   }
   lineno++;
}).on ('close', function () {
  console.log(hdr);
  var png = makePng(hdr.ncols, hdr.nrows, rawRows, min, max);
  png.pack().pipe(dst);
  console.log('The END');
});
});
