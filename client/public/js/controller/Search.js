(function() {
"use strict";

var controller = $.SearchController = function(config) {
  controller.superclass.constructor.call(this, config);
};

$.Function.inherits(controller, $.Controller);

(function() {
  
  this.views = ['SearchResult'];
  
  this.initialize = function() {
    $('#search-field').removeAttribute('disabled');
    this.ajax = new $.AjaxProxy();
    this.ajax.setAccessToken(localStorage.getItem('soundcloud-authtoken'));
    this.ajax.on('success', this.onSuccess.bind(this));
    
    $('#search-field').addEventListener('keyup', this.onSearch.bind(this));
  };
  
  this.onSearch = function(e) {
    var value = e.target.value;
    
    if (value.length < 3) {
      return;
    }
    if (this.request) {
      this.request.abort();
    }
    this.request = this.ajax.request({query: value}).send();
  };
  
  this.onSuccess = function(results) {
    var container = $('#search-results');
    
    if (!results.length) {
      return container.className = '';
    }
    var SearchResult = this.getView('SearchResult');
    var me = this;
    
    while(container.hasChildNodes()) {container.removeChild(container.firstChild);}
    
    var views = [];
    results.forEach(function(data) {
      var view = new SearchResult(new $.SearchResultModel(data));
      
      views.push(view);
      container.appendChild(view.render());
      container.className = 'visible';
    });
    
    views.forEach(function(item) {
      item.dom.addEventListener('click', function() {
        container.className = '';
        me.getApplication().mainController.trackList.addTrack(item.getModel());
      });
    });
  };

}).call(controller.prototype);

})();