import Ember from 'ember';
import Util from 'ember-cli-pagination/util';
import TruncatePages from './truncate-pages';
import SafeGet from '../util/safe-get';

export default Ember.Object.extend(SafeGet, {
  // lastTotal:null,
  keyBinding:'content.start',
  pageItemsAll: function() {
    var currentPage = this.getInt("currentPage");
    console.log("pageItem class has binding key"+this.get('keyBinding'));
    var totalPages = this.getInt("totalPages");
    Util.log("PageNumbers#pageItems, currentPage " + currentPage + ", totalPages " + totalPages);

    /*// var start = this.get('content')
     if(this.get('lastTotal') === null)this.set('lastTotal',totalPages);
     if(this.get('lastTotal') < totalPages){
     this.set('lastTotal',totalPages);
     this.set('currentPage', 1);
     currentPage = 1;
     }
     if(currentPage > totalPages)currentPage = Math.min(1, totalPages);*/
    var res = [];
    for(var i=1; i<=totalPages; i++) {
      res.push({
        page: i,
        current: currentPage === i
      });
    }
    return res;
  }.property("currentPage", "totalPages"),

  pageItemsTruncated: function() {
    console.log("pageItem class has binding key"+this.get('keyBinding'));

    var currentPage = this.getInt('currentPage');
    var totalPages = this.getInt("totalPages");
    var toShow = this.getInt('numPagesToShow');
    var showFL = this.get('showFL');

    /* if(this.get('lastTotal') === null)this.set('lastTotal',totalPages);
     if(this.get('lastTotal') !== totalPages){
     this.set('lastTotal',totalPages);
     this.set('currentPage', 1);
     currentPage = 1;
     }

     if(currentPage > totalPages){
     var min = Math.min(totalPages, 1);
     this.set('currentPage',min);
     currentPage = min;
     }*/
    var t = TruncatePages.create({currentPage: currentPage, totalPages: totalPages,
      numPagesToShow: toShow,
      showFL: showFL});
    var pages = t.get('pagesToShow');
    return pages.map(function(page) {
      if(page <= totalPages)
        return {
          page: page,
          current: (currentPage === page)
        };
    });
  }.property('currentPage','totalPages','numPagesToShow'),

  pageItems: function() {
    if (this.get('truncatePages')) {
      return this.get('pageItemsTruncated');
    }
    else {
      return this.get('pageItemsAll');
    }
  }.property('currentPage','totalPages','truncatePages','numPagesToShow')
});
