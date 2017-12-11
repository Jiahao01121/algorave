// var a = (function(){
//   var a = {};
//   a.a_ = function(){
//     var value = null;
//     (function(){
//       var a = 1;
//       value = a;
//     }());
//     return value
//   }
//
//   return a;
// }())
// console.log(a.a_());


function repeatInCaps(p){
  var arrL = Math.floor((p.length) / 2);

  var firstHalf = p.slice(0,arrL);
  return firstHalf + firstHalf.toUpperCase();

}

console.log(repeatInCaps('idfjoasdawa'));
