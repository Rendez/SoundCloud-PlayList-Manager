(function() {
"use strict";

var view = $.PlayListView = function(model, config) {
  view.superclass.constructor.call(this, model, config);
};

$.Function.inherits(view, $.View);

(function() {
  
  this.defaults = {
    tagName: 'li',
    tpl: '<a class="awesome small red">Remove</a><a class="awesome small blue">Edit</a><div><%= title %></div>'
  };
  
  this.remove = function(e) {
    this.container.collection.remove(this.getModel().getId());
  };
  
  this.select = function(e) {
    var el = e.target;
    
    if (!el) {
      el = e;
    }
    var i = 0;
    var viewItems = this.container.getViewItems();
    
    for (; i < viewItems.length; i++) {
      viewItems[i].className = '';
    }
    if (el.tagName.toLowerCase() != 'li') {
      el = el.parentNode;
    }
    
    el.className = 'selected';
    this.container.setSelection(this);
  };
  
  this.edit = function(e) {
    var el = e.target;
    
    if (!el) {
      el = e;
    }
    if (el.tagName.toLowerCase() == 'a') {
      el = $('div', el.parentNode);
    }
    el.setAttribute('contenteditable', 'true');
    el.focus();
  };
  
  this.editComplete = function(e) {
    var el = e.target;
    
    if (!el) {
      el = e;
    }
    this.getModel().set('title', el.innerHTML);
    el.removeAttribute('contenteditable');
    var me = this;
    setTimeout(function(){ me.select(e); }, 100);
  };
  
  this.selectRange = function(e) {
    var range = document.createRange();
    var sel = window.getSelection();
    
    range.selectNodeContents(e.target);
    sel.removeAllRanges();
    sel.addRange(range);
  };
  
}).call(view.prototype);

})();