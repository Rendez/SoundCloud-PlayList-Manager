(function() {
"use strict";

var controller = $.TrackListController = function(config) {
  controller.superclass.constructor.call(this, config);
};

$.Function.inherits(controller, $.Controller);

(function() {
  
  var control = {
    'click .play': 'loadTrack',
    'click .remove': 'removeTrack'
  };
  
  this.views = ['Track'];
  this.stores = ['Tracks'];
  
  this.initialize = function() {
    this.getApplication().mainController.playLists.component.on('selection', this.changeTrackList.bind(this));
    scope = this;
  };
  
  this.changeTrackList = function(item) {
    console.log('[INFO] "selection" PlayLists component.');
    var me = this;
    var playListId = item.getModel().getId();
    var Tracks = this.getCollection('Tracks');
    var coll = new Tracks(null, {
      model: 'TrackModel',
      playListId: 'playlist-'+playListId
    });
    
    if (this.component) {
      this.component.destroy();
    }
    this.component = new $.ViewCollection({
      el: '#tracks',
      collection: coll,
      view: this.getView('Track'),
      listeners: this.control(control)
    });
    
    this.component.on('add', function(item) {
      item.on('beforeload', me.handleLoadTrack.bind(me));
    });
    
    coll.load(/*{silent: true}*/);
    
    setTimeout(function(){ if (me.component.views[0]) me.component.views[0].loadTrack(); }, 1000); // @todo First thing to fix after testing. Also test if track is already playing.
    
    this.component.on('update', function(list) {
      if (list.selected) {
        list.selected.select();
      }
    });
    
    this.getApplication().mainController.trigger('tracklistchange', this, this.component, item);
  };
  
  this.selectCurrentTrack = function(list) {
    if (list.selected) {
      list.selected.select();
    }
  };
  
  this.addTrack = function(record) {
    this.component.collection.create(record);
  };
  
  this.handleLoadTrack = function(player, file) {
    soundcloud.removeEventListener('onPlayerReady', handlePlayerReady);
    soundcloud.addEventListener('onPlayerReady', handlePlayerReady);
  };
  
  this.handlePlayerReady = function(player, scope) {
    player.api_play();
    
    var streamUrl = player.api_getCurrentTrack().streamUrl;
    var currentViewTrack;
    var re = /api\.soundcloud\.com\/tracks\/([\d]+)/;
    
    this.component.views.forEach(function(view) {
      if (view.getModel().get('stream_url').match(re)[1] == streamUrl.match(re)[1]) {
        currentViewTrack = view;
      }
    });
    this.component.setSelection(currentViewTrack);
    currentViewTrack.select();
  };
  
  var scope;
  var handlePlayerReady = function(player, data) {
    scope.handlePlayerReady(player, data);
  }

}).call(controller.prototype);

})();