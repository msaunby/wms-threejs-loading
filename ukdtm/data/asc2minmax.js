// asc2minmax.js

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

function maxOfArray(numArray) {
  return Math.max.apply(null, numArray);
}

function minOfArray(numArray) {
  return Math.min.apply(null, numArray);
}

var infiles = process.argv.slice(2);


var maxList = [], minList = [];
process.on('exit', function(code) {
  var max = maxOfArray(maxList);
  var min = minOfArray(minList);
  var cmdtxt = min + " " + max + " " + infiles.join(' ');
  console.log(cmdtxt);
});


console.log("args",infiles);
infiles.forEach(function(element, index, array){
var src = fs.createReadStream(element);
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
     maxList.push(maxOfArray(row));
     minList.push(minOfArray(row));

   }
   lineno++;
}).on ('close', function () {
  console.log(hdr);
});
});
