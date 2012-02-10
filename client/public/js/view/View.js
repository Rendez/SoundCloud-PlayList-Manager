(function() {
"use strict";

/**
 * View class. Represents a single item view, and is handled a unique model with data.
 * Uses micro-templating engine to generate a DOM element filled with values.
 * This class should be extended should custom methods be added to handle the assigned DOM events.
 */

$.View = function(model, config) {
  this.initConfig(config);
  
  if (!model) {
    throw new Error('First arguments must be a Model instance');
  }
  this.model = model;
  
};

(function() {
  
  this.defaults = {
    tagName: '<div>',
    identifier: 'data-view-item',
    tpl: ''
  };
  
  this.initConfig = function(options) {
    var defaults = this.constructor.superclass.defaults;
    var config = $.Object.merge(defaults || {}, this.defaults, options);
    
    for (var k in config) {
      this[k] = config[k];
    }
  };
  
  this.getModel = function() {
    return this.model;
  };
  
  this.render = function(data) {
    data || (data = this.model.getData());
    
    if (!this.dom) {
      var view = document.createElement(this.tagName);
      var model = this.model;
      var id = model[model._idProperty];
      
      view.setAttribute(this.identifier, '' + id);
      this.dom = view;
      this.dom.innerHTML = $.tpl(this.tpl, data);
    }
    this.dom.innerHTML = $.tpl(this.tpl, data);
    
    return this.dom;
  };
  
  this.destroy = function() {
    this.dom.parentNode.removeChild(this.dom);
    delete this.dom;
  };
  
}).call($.View.prototype);

})();