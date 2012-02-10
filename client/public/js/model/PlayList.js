(function() {
"use strict";

var model = $.PlayListModel = function(data, options) {
  model.superclass.constructor.call(this, data, options);
};

$.Function.inherits(model, $.Model);

(function() {
  
  this._name = 'playlist';
  
}).call(model.prototype);

})();