import Ember from 'ember';
import Util from 'ember-cli-pagination/util';
import PageItems from 'ember-cli-pagination/lib/page-items';
import Validate from 'ember-cli-pagination/validate';

export default Ember.Component.extend({
  currentPageBinding: "content.page",
  totalPagesBinding: "content.totalPages",

  hasPages: Ember.computed.gt('totalPages', 1),
  watchInvalidPage: function() {
    var me = this;
    var c = this.get('content');
    if (c && c.on) {
      c.on('invalidPage', function(e) {
        me.sendAction('invalidPageAction',e);
      });
    }
  }.observes("content"),
  truncatePages: true,
  numPagesToShow: 10,

  validate: function() {
    if (Util.isBlank(this.get('currentPage'))) {
      Validate.internalError("no currentPage for page-numbers");
    }
    if (Util.isBlank(this.get('totalPages'))) {
      Validate.internalError('no totalPages for page-numbers');
    }
  },

  pageItemsObj: function() {
    return PageItems.create({
      parent: this,
      currentPageBinding: "parent.currentPage",
      totalPagesBinding: "parent.totalPages",
      truncatePagesBinding: "parent.truncatePages",
      numPagesToShowBinding: "parent.numPagesToShow",
      showFLBinding: "parent.showFL"
    });
  }.property(),


  pageItems: function() {
    this.validate();
    return this.get("pageItemsObj.pageItems");
  }.property("pageItemsObj.pageItems","pageItemsObj"),

  canStepForward: (function() {
    var page = Number(this.get("currentPage"));
    console.log("current Page"+this.get('currentPage')+"  total Page"+this.get('totalPages'));
    var totalPages = Number(this.get("totalPages"));
    if(page === 0 && totalPages > 0){
      page = 1;
      this.set('currentPage', 1);
    }
    return page < totalPages;
  }).property("currentPage", "totalPages"),

  canStepBackward: (function() {
    var page = Number(this.get("currentPage"));
    console.log("current Page "+this.get('currentPage'));
    return page > 1;
  }).property("currentPage"),

  lastPage:(function () {
    console.log('checking inside page-numbers'+" "+this.get('content')+" "+this.get('totalPagesBinding'));
    var total = this.get('totalPages'),cur = this.get('currentPage');
    if(total - cur > 10){
      return this.get('totalPages');
    }
    if(total > 10 && cur + 5 <= total){
      return this.get('totalPages');
    }
    return undefined;
  }).property('currentPage','totalPages','content'),

  actions: {
    pageClicked: function(number) {
      console.log("PageNumbers#pageClicked number " + number);
      this.set("currentPage", number);
      this.sendAction('action',number);
    },
    incrementPage: function(num) {
      var currentPage = Number(this.get("currentPage")),
        totalPages = Number(this.get("totalPages"));

      if(currentPage === totalPages && num === 1) { return false; }
      if(currentPage <= 1 && num === -1) { return false; }
      this.incrementProperty('currentPage', num);

      var newPage = this.get('currentPage');
      this.sendAction('action',newPage);
    }
  }
});
