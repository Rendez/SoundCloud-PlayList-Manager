$.Application.Action = function(app, options) {
  this.application = app;
  this.initConfig(options);
};

(function() {
  
  var defaults = {
    controller: '',
    action: '',
    args: []
  };
  
  this.initConfig = function(options) {
    var config = $.Object.merge(defaults, options);
    
    for (var k in config) {
      this[k] = config[k];
    }
  };
  
  this.execute = function() {
    var controller = this.controller;
    var action = this.action;
    var args = this.args;
    
    controller[action].apply(controller, args);
  };
  
  this.undo = function(config) {
    config.callback('...');
  }

}).call($.Application.Action.prototype);