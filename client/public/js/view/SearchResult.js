(function() {
"use strict";

var view = $.SearchResultView = function(model, config) {
  view.superclass.constructor.call(this, model, config);
};

$.Function.inherits(view, $.View);

(function() {
  
  this.defaults = {
    tagName: 'li',
    tpl: '<%= title %> <span>(<%= stream_url %>)</span>'
  };
  
}).call(view.prototype);

})();