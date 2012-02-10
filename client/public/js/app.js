(function() {

"use strict";

var app = new $.Application({
  controllers: ['Main', 'PlayLists', 'Search', 'TrackList'],
  
  name: 'soundcloud',
  
  launch: function() {
    var main = this.getController('Main');
    
    new main({application: this});
  }
});

})();