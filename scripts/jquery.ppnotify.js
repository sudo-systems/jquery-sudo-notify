(function($) {
  $.fn.ppNotify = function(options) {
    var settings = $.extend(true, {}, $.fn.ppNotify.defaults, options);
    var wrapper = $('<div class="wrapper"></div>');
    var messageContainer = $('<div class="message"></div>');
    var closeButtonContainer = $('<div class="close-button">X</div>');
    var topCss = {top:0, bottom:''};
    var bottomCss = {bottom:0, top:''};
    var positionCss = (settings.position === 'bottom')? bottomCss : topCss;
    var timer = null;
    var element = this;
    var lastNotificationType = null;
    
    this.addClass('ppNotify');
    this.css(positionCss);
    this.css('opacity', settings.opacity);
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
      if(element.is(':visible') && lastNotificationType) {
        executeHide(function() {
          executeShow(messageType, message, function() {
            initDelayedHide();
          });
        });
      }
      else {
        executeShow(messageType, message, function() {
          initDelayedHide();
        });
      }
    }
    
    function executeShow(messageType, message, callback) {
      callback = (callback === 'undefined' || typeof callback !== 'function')? function(){} : callback;
      clearTimeout(timer);
      
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
        messageContainer.css('opacity', 0.0);
        closeButtonContainer.css('opacity', 0.0);
        element.css('left', '-'+element.width()+'px');
        element.show();

        element.stop().animate({
          left: '0px'
        }, settings.animation.showSpeed, 
        function() {
          settings.onShow.call();
          callback.call();
          messageContainer.stop().animate({opacity:1.0}, (settings.animation.showSpeed/3));
          closeButtonContainer.stop().animate({opacity:1.0}, (settings.animation.showSpeed/3));
        });
      }
      else if(settings.animation.type === 'fade') {
        element.fadeIn(
          settings.animation.showSpeed, 
          function() {
            settings.onShow.call();
            callback.call();
          });
      }
      else {
        element.show();
        settings.onShow.call();
      }

      if(settings.log) {
        debug(messageType, message);
      }
    }
    
    function executeHide(callback) {
      callback = (callback === 'undefined' || typeof callback !== 'function')? function(){} : callback;
      clearTimeout(timer);
      
      if(settings.animation.type === 'scroll') {
        element.stop().animate({
          left: '-'+element.width()+'px'
        }, settings.animation.hideSpeed, 
        function(){
          element.hide();
          settings.onClose.call();
          callback.call();
        });
        messageContainer.stop().animate({opacity:0.0}, (settings.animation.hideSpeed/2));
        closeButtonContainer.stop().animate({opacity:0.0}, (settings.animation.hideSpeed/2));
      }
      else if(settings.animation.type === 'fade') {
        element.fadeOut(
          settings.animation.hideSpeed,
          function() {
            settings.onClose.call();
            callback.call();
          });
      }
      else {
        element.hide();
        settings.onClose.call()
      }
    }
    
    function initDelayedHide() {
      if(settings.autoHide === true) {
        clearTimeout(timer);
        timer = setTimeout(function() {
          executeHide();
        }, (settings.duration*1000));
      }
    }
    
    closeButtonContainer.on('click', function(e) {
      e.preventDefault();
      executeHide();
    });

    function debug(messageType, data) {
      if(window.console && window.console.log) {
        window.console.log('ppNotify ' +messageType+ ': "' +data+ '"');
      }
    };
    
    return this;
  };
  
  $.fn.ppNotify.defaults = {
    autoHide: true,
    duration: 5, //seconds
    position: 'top', //top or bottom
    log: true,
    opacity: 0.95,
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
    animation: {
      type: 'scroll', //fade, scroll, slide or none (or empty)
      showSpeed: 300,
      hideSpeed: 500
    },
    onClose: function() {},
    onShow: function() {}
  };
}(jQuery));
