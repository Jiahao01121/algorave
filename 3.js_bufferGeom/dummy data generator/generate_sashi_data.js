const fs = require('fs');
const csv = require('fast-csv');
const _ = require('underscore');



var myModule = (function(stream){

  var my = {};

    my.map = function (n, start1, stop1, start2, stop2, withinBounds) {
      var newval = ((n - start1)/(stop1 - start1)) * (stop2 - start2) + start2;
      if (!withinBounds) {
        return newval;
      }
      return this.constrain(newval, start2, stop2);
    };

    my.readCsv = function(){

        function cb(d){
          my.a = d;
          my.mong(my.a);
        };
        var dataset = [];
        csv.fromStream(stream,{headers:true})
         .on("data", function(data){
           dataset.push(data);
         })
         .on("end", function(){
           cb(dataset)
         });

    };

    my.mong = function(data){
      console.log(
        (_.max(data,function(d){ return d.x })).x,
        (_.min(data,function(d){ return d.x })).x
      );
      // data.forEach(function (d,i){
      //   (_.max(data,function(d){ return d.x })).x
      //   (_.min(data,function(d){ return d.x })).x
      //   // d.x =  this.map(d.x,,,,)
      // })
    }

  return my;

}( fs.createReadStream("rostock.csv") ) );

myModule.readCsv()



// console.log(a);
// setTimeout(function () {
  // console.log(a);
// }, 2000);


// function test(dataset){
//   for (var i = 0; i < dataset.length; i++) {
//     dataset[i].x = +dataset[i].x;
//     dataset[i].y = +dataset[i].y;
//     dataset[i].z = +dataset[i].z;
//     console.log();
//   }
// }
