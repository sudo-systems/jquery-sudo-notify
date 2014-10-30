(function($) {
  $.fn.ppNotify = function(options) {
    var settings = $.extend(true, {}, $.fn.ppNotify.defaults, options);
    
    this.addClass('ppNotify');
    
    function debug(data) {
      if(window.console && window.console.log) {
        window.console.log('ppNotify debug: ' +data);
      }
    };
    
    return this;
  };
  
  $.fn.ppNotify.defaults = {
    errorStyle: {
      color: '#000000',
      backgroundColor: 'red'
    },
    warningStyle: {
      color: '#000000',
      backgroundColor: 'orange'
    },
    successStyle: {
      color: '#000000',
      backgroundColor: 'green'
    }
  };
}(jQuery));
