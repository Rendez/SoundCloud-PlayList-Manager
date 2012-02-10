(function() {
"use strict";

var controller = $.MainController = function(config) {
  controller.superclass.constructor.call(this, config);
};

$.Function.inherits(controller, $.Controller);

(function() {
  
  this.initialize = function() {
    if (!this.isAuthenticated()) {
      return this.authenticate();
    }
  };
  
  this.launch = function() {
    var playLists = this.getApplication().getController('PlayLists');
    var search = this.getApplication().getController('Search');
    var trackList = this.getApplication().getController('TrackList');
    
    this.application.mainController = this;
    
    this.playLists = new playLists();
    this.playLists.createView();
    this.search = new search();
    this.trackList = new trackList();
    this.playLists.selectFirst();
  };
  
  this.isAuthenticated = function() {
    var key = this.getApplication().name + '-authtoken';
    var authenticated = localStorage[key];
    
    if (!authenticated) {
      SC.initialize({
        client_id: "e0972a9396a694adedadde6caf4287ac",
        redirect_uri: location.href + 'callback'
      });
      return false;// start oauth protocol
    } else {
      SC.initialize({
        client_id: "e0972a9396a694adedadde6caf4287ac",
        redirect_uri: location.href + 'callback',
        access_token: authenticated
      });
    }
    
    var me = this;
    SC.whenStreamingReady(function(){
      me.launch();
    });
        
    return true;
  };
  
  this.authenticate = function() {
    var me = this;
    
    SC.connect(function() {
      alert('connect')
    });
  }
  
}).call(controller.prototype);

})();