(function($) {
  $.fn.ppNotify = function(options) {
    var settings = $.extend(true, {}, $.fn.ppNotify.defaults, options);
    var wrapper = $('<div class="wrapper"></div>');
    var messageContainer = $('<div class="message"></div>');
    var closeButtonContainer = $('<div class="close-button">X</div>');
    var topCss = {top:0, bottom:''};
    var bottomCss = {bottom:0, top:''};
    var positionCss = (settings.position === 'bottom')? bottomCss : topCss;
    var timeout;
    var element = this;
    
    this.addClass('ppNotify');
    this.css(positionCss);
    this.append(wrapper);
    wrapper.append(messageContainer);
    wrapper.append(closeButtonContainer);

    this.error = function(message) {
      show('error', message);
    };
    
    this.warning = function(message) {
      show('warning', message);
    };
    
    this.success = function(message) {
      show('success', message);
    };
    
    function show(messageType, message) {
      if(messageType === 'error') {
        element.css(settings.errorStyle);
        messageContainer.html(message);
      }
      else if(messageType === 'warning') {
        element.css(settings.warningStyle);
        messageContainer.html(message);
      }
      else if (messageType === 'success') {
        element.css(settings.successStyle);
        messageContainer.html(message);
      }
      
      if(settings.animation.type === 'scroll') {
        element.animate({width: 'toggle'}, settings.animation.speed, settings.onShow.call());
      }
      else if(settings.animation.type === 'fade') {
        element.fadeIn(settings.animation.speed, settings.onShow.call());
      }
      else {
        element.show();
        settings.onShow.call();
      }
        
      if(settings.consoleLog) {
        debug(messageType, message);
      }
      
      if(settings.autoHide === true) {
        timeout = setTimeout(function() {
          closeButtonContainer.trigger('click');
        }, (settings.showDuration*1000));
      }
    };
    
    closeButtonContainer.on('click', function(e) {
      e.preventDefault();
      clearTimeout(timeout);
      
      if(settings.animation.type === 'scroll') {
        element.animate({width: 'toggle'}, settings.animation.speed, settings.onClose.call());
      }
      else if(settings.animation.type === 'fade') {
        element.fadeOut(settings.animation.speed, settings.onClose.call());
      }
      else {
        element.hide();
        settings.onClose.call()
      }
    });

    function debug(messageType, data) {
      if(window.console && window.console.log) {
        window.console.log('ppNotify ' +messageType+ ': "' +data+ '"');
      }
    };
    
    return this;
  };
  
  $.fn.ppNotify.defaults = {
    errorStyle: {
      color: '#FFFFFF',
      backgroundColor: 'red'
    },
    warningStyle: {
      color: '#FFFFFF',
      backgroundColor: 'orange'
    },
    successStyle: {
      color: '#FFFFFF',
      backgroundColor: 'green'
    },
    consoleLog: true,
    animation: {
      type: 'scroll', //fade, scroll or none (or empty)
      speed: 1000
    },
    autoHide: true,
    showDuration: 5, //seconds
    position: 'top', //top or bottom
    onClose: function() {},
    onShow: function() {}
  };
}(jQuery));
