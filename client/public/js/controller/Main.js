(function() {
"use strict";

/**
 * Main application controller. It is the first and only controller that gets called from DOM ready,
 * and serves as constructor for the other controllers, since everything it's in one viewport.
 */

var controller = $.MainController = function(config) {
  $.Events.call(this);
  controller.superclass.constructor.call(this, config);
};

$.Function.inherits(controller, $.Controller);
$.Function.mixin(controller, $.Events);

(function() {
  
  /**
   * "Global" emitted events from other controllers.
   */
  var listeners = {
    tracklistchange: function(me, component, currentView) {
      console.log('[INFO] "tracklistchange" event fired.', this);
      $('#search-field').removeAttribute('disabled');
    },
    playlistremove: function(me, model) {
      this.trackList.component.collection.destroy();
    }
  };
  
  this.initialize = function() {
    this.application.mainController = this;
    this.mon(listeners);
    
    if (!this.isAuthenticated()) {
      return this.authenticate();
    }
  };
  
  /**
   * Creates other controller's instances and initializes them.
   */
  this.launch = function() {
    console.log('[INFO] Application launched.');
    
    var playLists = this.getApplication().getController('PlayLists');
    var search = this.getApplication().getController('Search');
    var trackList = this.getApplication().getController('TrackList');

    this.playLists = new playLists();
    this.playLists.createView();
    this.search = new search();
    this.trackList = new trackList();
    this.playLists.selectFirst();
    
    
  };
  
  /**
   * Uses oauth2 authentication process with a popup window.
   * @return {Boolean}
   */
  this.isAuthenticated = function() {
    var key = this.getApplication().name + '-authtoken';
    var authenticated = localStorage[key];
    
    if (!authenticated) {
      SC.initialize({
        client_id: this.getApplication().config[location.href].client_id,
        redirect_uri: location.href + 'callback'
      });
      return false;// start oauth protocol
    } else {
      SC.initialize({
        client_id: this.getApplication().config[location.href].client_id,
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
  
  /**
   * Triggers authentication.
   */
  this.authenticate = function() {
    var me = this;
    
    SC.connect(function() {
      alert('connect')
    });
  }
  
}).call(controller.prototype);

})();