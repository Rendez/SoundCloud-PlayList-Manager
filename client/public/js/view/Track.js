(function() {
"use strict";

var view = $.TrackView = function(model, config) {
  view.superclass.constructor.call(this, model, config);
  $.Events.call(this);
};

$.Function.inherits(view, $.View);
$.Function.mixin(view, $.Events);

(function() {
  
  this.defaults = {
    tagName: 'li',
    tpl: '<button class="play"><button class="remove"></button></button><span><%= title %></span>'
  };
  
  this.select = function() {
    var el = this.dom;
    var viewItems = this.container.getViewItems();
    
    for (var i = 0; i < viewItems.length; i++) {
      viewItems[i].className = '';
    }
    console.log(this);
    
    el.className = 'selected';
    this.container.setSelection(this);
  };
  
  this.loadTrack = function() {
    var file = this.getModel().getData().stream_url.replace('/stream', '');
    var player = soundcloud.getPlayer('myPlayerId');
    
    this.fireEvent('beforeload', player, file);
    player.api_load(file);
  };
  
  this.removeTrack = function() {
    this.container.collection.remove(this.getModel());
  };
  
}).call(view.prototype);

})();