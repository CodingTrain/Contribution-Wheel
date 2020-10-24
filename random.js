Random = (() => {
  let random = {}
  random.s = false;
  random.p = [];
  random.random = function(start = 0, stop = 1) {
    this.s = !this.s;
    var l;
    if (this.p == undefined) this.p = [];
    while (l == undefined || this.p.indexOf(l) > -1)
      l = Math.abs(stop - start) / 2 * (this.s ? Math.cos(pow(Date.now(), 4) * new Date().getTime()) : Math.sin(pow(Date.now(), 4) * new Date().getTime())) + (start + stop) / 2;
    this.p.push(l);
    if (this.p.length > Math.abs(stop - start) * 1e+5) this.p = [];
    return l;
  }
  random.testRandomness = function(func, stop = 100, args = []) {
    var f = [];
    for (var i = 0; i < stop; i++) {
      var j = func(...args);
      if (f.indexOf(j) == -1) f.push(j);
    }
    return (f.length / stop * 100) + '%';
  }
  random.reset = function() {
    this.p = [];
  }
  return random;
})();