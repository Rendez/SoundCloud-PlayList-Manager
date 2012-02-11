(function() {
"use strict";

/**
 * Class used to bind a collection with a container view. It acts as a simple UI component
 * with binded events to the passed collection, allowing for the view items to be converted
 * to DOM elements and so forth.
 */

var __slice = Array.prototype.slice;

var view = $.ViewCollection = function(config) {
  $.Events.call(this);
  
  this.initConfig(config);
  this.initialize();
};

$.Function.mixin(view, $.Events);

(function() {
  
  this.initConfig = function(config) {
    for (var k in config) {
      this[k] = config[k];
    }
    if (typeof this.el === 'string') {
      this.el = $(this.el);
    }
    if (!this.el) {
      throw new Error('Reference to HTMLElement container is not in the DOM yet.');
    }
    if (!(this.view.superclass.constructor == $.View)) {
      throw new Error('The view collection must be based upon a View instance');
    }
  };
  
  this.initialize = function() {
    var me = this;
    
    this.views = [];
    this.collection.on('sync', this.update.bind(this));
    this.collection.on('load', this.update.bind(this));
  };
  
  this.update = function(model, collection, options) {
    var selectedId = null;
    
    if (this.selected) {
      selectedId = this.selected.getModel().getId();
    }
    
    this.reset();
    
    var models = collection.models;
    var view = this.view;
    var me = this;
    var item;
    
    models.forEach(function(model) {
      item = new view(model);
      if (model.getId() === selectedId) me.selected = item;
      item.container = me;
      item.render();
      me.views.push(item);
      me.add(item);
    });
    this.fireEvent('update', this, this.views);
  };
  
  this.reset = function() {
    var item;
    
    while(item = this.views.pop()) {
      item.destroy();
    }
    this.fireEvent('reset');
  };
  
  this.add = function(item) {
    this.addEvents(item);
    this.el.appendChild(item.dom);
    this.fireEvent('add', item);
  };
  
  this.addEvents = function(item) {
    var dom = item.dom;
    var el;
    
    if (!this.listeners) return;
    this.listeners.forEach(function(ev) {
      el = dom;
      if (ev.delegate) {
        el = $(ev.delegate, el);
      }
      if (el) {
        el.addEventListener(ev.type, item[ev.callback].bind(item), true);
      }
    });
  };

  this.getViewItems = function() {
    return this.el.getElementsByTagName(this.view.prototype.defaults.tagName);
  };
  
  this.last = function() {
    return this.views[this.views.length - 1];
  };
  
  this.setSelection = function(item) {
    var previous = this.selected;
    
    if (previous && previous === item) {
      return;
    }
    this.selected = item;
    this.fireEvent('selection', item);
  };
  
  this.getViewFromRecord = function(record) {
    var found = null;
    
    this.views.forEach(function(view) {
      if (view.model.getId() == (record && record.getId())) {
        found = view;
      }
    });
    
    return found;
  };
  
  this.destroy = function() {
    this.views.forEach(function(view) {
      view.destroy();
    });
  }
  
}).call(view.prototype);

})();