(function() {
"use strict";

var model = $.SearchResultModel = function(data, options) {
  model.superclass.constructor.call(this, data, options);
};

$.Function.inherits(model, $.Model);

(function() {
  
  this._name = 'searchresult';
  
}).call(model.prototype);

})();