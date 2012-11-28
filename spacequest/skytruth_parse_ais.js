var child_process = require('child_process');
var carrier = require('carrier');

var lines = [];

var transformer = child_process.spawn("gpsdecode", []);
carrier.carry(transformer.stdout, function(line) {
  line = JSON.parse(line);
  var orig = lines.shift();
  line.time = Date.parse(orig[1]);
  line.device = "/skytruth";
  console.log(JSON.stringify(line));
});

carrier.carry(process.stdin, function(line) {
  line = /^([^|]*)\|([^|]*)\|([^|]*)\|([^|]*)\|(.*)$/.exec(line);
  lines.push(line);
  transformer.stdin.write(line[5] + '\n');
});
process.stdin.on('end', function () {
  transformer.stdin.end();
});

process.stdin.resume();
