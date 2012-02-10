$.Application.History = function() {
  this._actions = [];
};

(function() {
  
  this.getActions = function() {
    return this._actions;
  };
  
  this.add = function(action) {
    if (!(action instanceof $.Application.Action)) {
      action = new $.Application.Action(action);
    }
    this._actions.push(action);
  };
  
  this.back = function() {
    this._actions.pop().execute();
  };

}).call($.Application.History.prototype);