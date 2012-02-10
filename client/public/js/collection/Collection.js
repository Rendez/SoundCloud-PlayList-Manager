(function() {
"use strict";

var __slice = Array.prototype.slice;

var collection = $.Collection = function(models, options) {
  $.Events.call(this);
  
  options = options || {};
  
  if (options.model && $[options.model]) {
    if (typeof options.model === 'string') {
      options.model = $[options.model];
    }
  }
  if (!options.model) {
    throw new Error('Model has to be included in the options as first argument.');
  }
  
  options.sorter || (options.sorter = options.model._idProperty);
  
  this.initConfig(options);
  this.initialize(models, options);
  this._reset();
};

$.Function.mixin(collection, $.Events);

(function() {
  
  var defaults = {
    autoSave: true
  };
  
  var eventHooks = [
    'add',
    'remove',
    'update'
  ];
  
  this.initConfig = function(options) {
    var config = $.Object.merge(defaults, options),
        me = this;

    for (var k in config) {
      me[k] = config[k];
    }
    eventHooks.forEach(function(ev) {
      me.on(ev, me._handleEvent.bind(me));
    });
  };
  
  this.initialize = function(models, options) {
    if (models && models.length) {
      this.reset(models, {silent: true, parse: options.parse});
    }
  };
  
  this.get = function(id) {
    if (id == null) return null;
    return this._byId[id[id._idProperty] != null ? id[id._idProperty] : id];
  },
  
  this.at = function(index) {
    return this.models[index];
  };
  
  this.reset = function(models, options) {
    models  || (models = []);
    options || (options = {});
    for (var i = 0, l = this.models.length; i < l; i++) {
      if (this == this.models[i].collection) {
          delete this.models[i].collection;
      }
    }
    this._reset();
    this.add(models, {silent: true, parse: options.parse});
    if (!options.silent) this.fireEvent('reset', this, options);
    return this;
  };
  
  this.add = function(models, options) {
    var i, index, length, model, id, ids = {};
    options || (options = {});
    models = Array.isArray(models) ? models.slice() : [models];
    
    for (i = 0, length = models.length; i < length; i++) {
      model = models[i] = this._prepareModel(models[i], options);
      
      if (((id = model[model._idProperty]) != null) && (ids[id] || this._byId[id])) {
        throw new Error('Can\'t add the same model to a collection twice');
      }
      ids[id] = model;
    }
    index = options.at != null ? options.at : this.models.length;
    
    for (i = 0; i < length; i++) {
      (model = models[i]).on('update', this._handleEvent.bind(this));
      this._byId[(model[model._idProperty] != null) ? model[model._idProperty] : (model[model._idProperty] = index+i)] = model;
    }
    
    this.length += length;
    // index = options.at != null ? options.at : this.models.length;
    Array.prototype.splice.apply(this.models, [index, 0].concat(models));
    //this.sort({silent: true});
    if (options.silent) {
      return this;
    }
    for (i = index, length = this.models.length; i < length; i++) {
      // if (!cids[(model = this.models[i]).cid]) continue;
      options.index = i;
      this.fireEvent('add', model, this, options);
    }
    return this;
  };
  
  this.create = function(model, options) {
    // var coll = this;
    options = $.Object.merge(options || {}, {add: true})
    model = this._prepareModel(model);
    // if (!model) return false;
    if (options.add) {
      this.add(model, options);
    }

    // var success = options.success;
    //     options.success = function(nextModel, resp, xhr) {
    //       if (options.wait) coll.add(nextModel, options);
    //       if (success) {
    //         success(nextModel, resp);
    //       } else {
    //         nextModel.trigger('sync', model, resp, options);
    //       }
    //     };
    // model.save(null, options);
    return model;
  };
  
  this.remove = function(models, options) {
    var i, l, index, model;
    
    options || (options = {});
    models = Array.isArray(models) ? models.slice() : [models];
    for (i = 0, l = models.length; i < l; i++) {
      model = /*this.getByCid(models[i]) || */this.get(models[i]);
      if (!model) continue;
      delete this._byId[model[model._idProperty]];
      // delete this._byCid[model.cid];
      index = this.models.indexOf(model);
      this.models.splice(index, 1);
      this.length--;
      this._reindex(index);
      if (!options.silent) {
        options.index = index;
        this.fireEvent('remove', model, this, options);
      }
      if (this == model.collection) {
        delete model.collection;
      }
    }
    return this;
  },
  
  this._reindex = function(index) {
    var model;
    
    for (var len = this.models.length; index < len; index++) {
      model = this.models[index];
      model[model._idProperty] = model[model._idProperty] - 1;
      this.models[index] = model;
    }
  };
  
  this._handleEvent = function(model, collection, options, ev) {
    if (!ev) {
      ev = options;
      options = null;
    }
    if (eventHooks.indexOf(ev) != -1 && collection == this) {
      this.fireEvent('sync', __slice.call(arguments));
    }
  };
  
  this._prepareModel = function(model) {
    if (!(model instanceof this.model)) {
      var instance = this.model;
      
      model = new instance(model);
    }
    model.collection = this;
    return model;
  };
  
  this._reset = function(options) {
    this.length = 0;
    this.models = [];
    this._byId  = {};
  };
  
}).call(collection.prototype);

})();