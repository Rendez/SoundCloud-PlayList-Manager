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
    'click': 'select'
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
    
    this.component = new $.ViewCollection({
      el: '#playlists',
      collection: coll,
      view: this.getView('PlayList'),
      listeners: this.control(control)
    });
    coll.load({silent: true});
    
    this.component.on('selection', function(item) {
      $('#playlist-description').value = item.getModel().getData().description;
    });
  };
  
  this.selectFirst = function() {
    if (this.component.views.length) {
      this.component.views[0].select(this.component.views[0].dom);
    }
  }
  
}).call(controller.prototype);

})();