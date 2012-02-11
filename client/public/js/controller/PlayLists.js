(function() {
"use strict";

var controller = $.PlayListsController = function(config) {
  controller.superclass.constructor.call(this, config);
};

$.Function.inherits(controller, $.Controller);

(function() {
  
  var control = {
    'click .blue': 'edit',
    'blur div': 'editComplete',
    'focus div': 'selectRange',
    'click .red': 'remove',
    'click': 'select',
    'keydown div': 'stopEditing'
  };
  
  this.views = ['PlayList'];
  this.stores = ['PlayLists'];
  
  this.initialize = function() {
    this.createEvents();
  };
  
  this.createEvents = function() {
    var me = this;
    
    $('#create-playlist').addEventListener('click', function() {
      var newPlayList = me.component.collection.create({
        title: 'Untitled',
        description: 'Insert a description for this playlist...'
      });
      var relatedView = me.component.getViewFromRecord(newPlayList);
      
      relatedView.edit($('div', relatedView.dom));
    }, false);
    $('#playlist-description').addEventListener('focus', function(e) {
      setTimeout(function(){ e.target.select()}, 100);
    });
    $('#playlist-description').addEventListener('blur', function(e) {
      if (me.component.selected) {
        me.component.selected.getModel().set('description', e.target.value);
      }
    });
  };
  
  this.createView = function() {
    var me = this;
    var PlayLists = this.getCollection('PlayLists');
    var coll = new PlayLists(null, {
      model: 'PlayListModel',
      sorter: 'title'
    });
    
    coll.on('remove', this.handleRemovePlayList.bind(this));
    
    this.component = new $.ViewCollection({
      el: '#playlists',
      collection: coll,
      view: this.getView('PlayList'),
      listeners: this.control(control)
    });
    
    this.component.on('selection', function(item) {
      $('#playlist-description').value = item.getModel().getData().description;
    });
    // 
    // this.component.on('update', function(list) {
    //   var last = list.last();
    //   if (last && last.dom) last.select(last.dom);
    //   // me.getApplication().mainController.trackList.component.trigger('selection', last);
    // });
    
    coll.load({silent: true});
  };
  
  this.selectFirst = function() {
    if (this.component.views.length) {
      this.component.views[0].select(this.component.views[0].dom);
    }
  };
  
  /**
   * Fires up a delegated method in order to remove the items in the TrackList
   * associated with the removed PlayList.
   */
  this.handleRemovePlayList = function(model) {
    console.log('[INFO] "remove" playlist.', this);
    
    this.getApplication().mainController.trigger('playlistremove', this, model);
  };
  
}).call(controller.prototype);

})();