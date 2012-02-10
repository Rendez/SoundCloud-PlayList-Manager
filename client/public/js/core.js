$ = function(selector, context) {
  context || (context = document);
  return context.querySelector(selector);
};

$$ = function(selector, context) {
  context || (context = document);
  return context.querySelectorAll(selector);
};

(function() {
"use strict";

$.Application = function(options) {
  this.initConfig(options);
  this._history = new $.Application.History();
  
  var launch = options.launch || this.launch;
  var me = this;
  
  window.addEventListener('DOMContentLoaded', function(){
      launch.call(me, me.controllers);
  }, true);
};

(function() {
  
  var defaults = {
    name: 'newapplication',
    version: '1'
  };
  
  this.launch = function() {
    throw new Error('Please define a launch method for your application to start-up.');
  };
  
  this.initConfig = function(options) {
    var config = $.Object.merge(defaults, options);
    
    for (var k in config) {
      this[k] = config[k];
    }
    
    if (this.controllers) {
      var controllers = {};
      
      this.controllers.forEach(function(controller) {
        controllers[controller] = $[controller + 'Controller'];
      });
      
      this.controllers = controllers;
    }
  };
  
  this.getHistory = function() {
    return this._history;
  };
  
  this.getController = function(name) {
    return this.controllers[name];
  };

}).call($.Application.prototype);

$.Events = function(events) {
  this._events = {};
};

(function() {

  this.addEvent = this.on = function(type, fn) {
    var array = (this._events[type] || []);
    
    array.push(fn)
    this._events[type] = array;
    return this;
  };
  
  this.addEvents = this.mon = function(array) {
    for (var type in array) this.addEvent(type, array[type]);
    return this;
  };

  this.fireEvent = this.trigger = function(type, args){
    var array = this._events[type];
    var me = this;
    
    if (!array) {
      return me;
    }
    if (arguments.length > 2) {
      args = [].slice.call(arguments, 1);
    }
    args = !Array.isArray(args) ? [args] : args;
    array.forEach(function(fn) {
      args.push(type);
      fn.apply(me, args);
    });
    return me;
  };

  this.removeEvent = this.un = function(type, fn){
    var array = this._events[type];
    
    if (array) {
      var index = array.indexOf(fn);
      if (index != -1) delete this._events[index];
    }
    return this;
  };

}).call($.Events.prototype);

['Function', 'String', 'Object', 'Number', 'Array'].forEach(function(primitive) {
  $[primitive] = {};
});

// Utils
$.Function.inherits = function(subClass, superClass) {
  var F = function() {};
  F.prototype = superClass.prototype;
  subClass.prototype = new F();
  subClass.prototype.constructor = subClass;

  subClass.superclass = superClass.prototype;
  if(superClass.prototype.constructor == Object.prototype.constructor) {
    superClass.prototype.constructor = superClass;
  }
};

$.Function.mixin = function(receivingClass, givingClass) {
  for(var methodName in givingClass.prototype) { 
    if(!receivingClass.prototype[methodName]) {
      receivingClass.prototype[methodName] = givingClass.prototype[methodName];
    }
  }
};

$.Object.merge = function(obj){
    [].slice.call(arguments, 1).forEach(function(source) {
      for (var prop in source) {
        obj[prop] = source[prop];
      }
    });
    return obj;
};

$.String.escape = function(string) {
  return (''+string).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;').replace(/\//g,'&#x2F;');
};

$.tplSettings = {
  evaluate    : /<%([\s\S]+?)%>/g,
  interpolate : /<%=([\s\S]+?)%>/g,
  escape      : /<%-([\s\S]+?)%>/g
};

$.tpl = function(str, data) {
  var c = this.tplSettings;
  var tpl = 'var __p=[],print=function(){__p.push.apply(__p,arguments);};' +
    'with(obj||{}){__p.push(\'' +
    str.replace(/\\/g, '\\\\')
       .replace(/'/g, "\\'")
       .replace(c.escape || noMatch, function(match, code) {
         return "',_.escape(" + unescape(code) + "),'";
       })
       .replace(c.interpolate || noMatch, function(match, code) {
         return "'," + unescape(code) + ",'";
       })
       .replace(c.evaluate || noMatch, function(match, code) {
         return "');" + unescape(code).replace(/[\r\n\t]/g, ' ') + ";__p.push('";
       })
       .replace(/\r/g, '\\r')
       .replace(/\n/g, '\\n')
       .replace(/\t/g, '\\t')
       + "');}return __p.join('');";
  var func = new Function('obj', '_', tpl);
  if (data) return func(data, $.String);
  return function(data) {
    return func.call(this, data, $.String);
  };
  
};

if (typeof Object.create !== 'function') {
    Object.create = function (o) {
        function F() {}
        F.prototype = o;
        return new F();
    };
}

})();