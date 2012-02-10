(function() {

"use strict";

/**
 * App configuration for local and deploy servers
 */

var appConfig = {
  'http://soundcloud.dev/': {
    'client_id': 'fe6e754cf4484f5c1bfa00882734164b'
  },
  'http://soundcloud-playlist-manager.herokuapp.com/': {
    'client_id': '86f417f675c0c943e264fe229510fe8a'
  }
};

/**
 * Starting point, one application which defines the controllers.
 * Each controller contains unique actions for different parts of the application.
 * The 'launch' method is bound to be fired when the window's DOM is ready.
 */
var app = new $.Application({
  controllers: ['Main', 'PlayLists', 'Search', 'TrackList'],
  
  config: appConfig,
  
  name: 'soundcloud',
  
  launch: function() {
    var main = this.getController('Main');
    
    new main({application: this});
  }
});

})();