(function($) {
  $.fn.ppNotify = function(options) {
    var settings = $.extend(true, {}, $.fn.ppNotify.defaults, options);
    var topCss = {top:0, bottom:''};
    var bottomCss = {bottom:0, top:''};
    var positionCss = (settings.position === 'bottom')? bottomCss : topCss;
    var timer = null;
    var element = this;
    var currentMessageType = '';
    
    var wrapper = $('<div></div>');
    var messageContainer = $('<div></div>');
    
    this.addClass('ppNotify');
    this.css(positionCss);
    this.css('opacity', settings.opacity);
    wrapper.addClass('wrapper');
    messageContainer.addClass('message');
    
    this.append(wrapper);
    wrapper.append(messageContainer);
    
    if(settings.showCloseButton) {
      var closeButtonContainer = $('<div></div>');
      closeButtonContainer.addClass('close-button');
      wrapper.append(closeButtonContainer);
    }
 
    this.error = function(message) {
      show('error', message);
    };
    
    this.warning = function(message) {
      show('warning', message);
    };
    
    this.success = function(message) {
      show('success', message);
    };
    
    this.setOption = function(key, value) {
      settings[key] = value;
    };
    
    this.getOption = function(key) {
      return settings[key];
    };
    
    function setClass(className) {
      element.removeClass('error warning success');
      element.addClass(className);
    }
    
    function show(messageType, message) {
      if(element.is(':visible') && settings.animation.type !== 'none') {
        executeHide(function() {
          currentMessageType = messageType;
          executeShow(messageType, message, function() {
            initDelayedHide();
          });
        });
      }
      else {
        currentMessageType = messageType;
        executeShow(messageType, message, function() {
          initDelayedHide();
        });
      }
    }
    
    function executeShow(messageType, message, callback) {
      callback = (callback === 'undefined' || typeof callback !== 'function')? function(){} : callback;
      clearTimeout(timer);
      
      setClass(messageType);
      
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
      
      if(settings.animation.type === 'scroll-right' || settings.animation.type === 'scroll-left' || settings.animation.type === 'scroll-right-fade' || settings.animation.type === 'scroll-left-fade') {
        var initialPosition = (settings.animation.type === 'scroll-right' || settings.animation.type === 'scroll-right-fade')? '-'+element.width()+'px' : element.width()+'px';
        
        if(settings.animation.type === 'scroll-right-fade' || settings.animation.type === 'scroll-left-fade') {
          element.css('opacity', 0.0);
        }
        
        wrapper.css('opacity', 0.0);
        element.css('left', initialPosition);
        element.show();

        var animationOptions = {
          left: '0px'
        };
        
        if(settings.animation.type === 'scroll-right-fade' || settings.animation.type === 'scroll-left-fade') {
          animationOptions.opacity= settings.opacity;
        }

        element.stop().animate(animationOptions, settings.animation.showSpeed, 
          function() {
            settings.onShow(currentMessageType);
            callback();
            wrapper.stop().animate({opacity:1.0}, (settings.animation.showSpeed/3));
          }
        );
      }
      else if(settings.animation.type === 'slide' || settings.animation.type === 'slide-fade') {
        if(settings.animation.type === 'slide-fade') {
          element.css('opacity', 0.0);
        }
        
        wrapper.css('opacity', 0.0);
        element.css('top', '-'+element.height());
        element.show();
        
        var animationOptions = {
          top: '0px'
        };
        
        if(settings.animation.type === 'slide-fade') {
          animationOptions.opacity= settings.opacity;
        }
        
        element.stop().animate(animationOptions, settings.animation.showSpeed, 
          function() {
            settings.onShow(currentMessageType);
            callback();
            wrapper.stop().animate({opacity:1.0}, (settings.animation.showSpeed/3));
          }
        );
      }
      else if(settings.animation.type === 'fade') {
        element.fadeIn(
          settings.animation.showSpeed, 
          function() {
            settings.onShow(currentMessageType);
            callback();
          });
      }
      else {
        element.show();
        settings.onShow(currentMessageType);
      }

      if(settings.log) {
        debug(messageType, message);
      }
    }
    
    function executeHide(callback) {
      callback = (callback === 'undefined' || typeof callback !== 'function')? function(){} : callback;
      clearTimeout(timer);
      
      if(settings.animation.type === 'scroll-right' || settings.animation.type === 'scroll-left' || settings.animation.type === 'scroll-right-fade' || settings.animation.type === 'scroll-left-fade') {
        var targetPosition = (settings.animation.type === 'scroll-right' || settings.animation.type === 'scroll-right-fade')? '-'+element.width()+'px' : element.width()+'px';
        
        var animationOptions = {
          left: targetPosition
        };
        
        if(settings.animation.type === 'scroll-right-fade' || settings.animation.type === 'scroll-left-fade') {
          animationOptions.opacity= 0.0;
        }
        
        element.stop().animate(animationOptions, settings.animation.hideSpeed, 
          function(){
            element.hide();
            settings.onClose(currentMessageType);
            callback();
          }
        );
        
        wrapper.stop().animate({opacity:0.0}, (settings.animation.hideSpeed/2));
      }
      else if(settings.animation.type === 'slide' || settings.animation.type === 'slide-fade') {
        var animationOptions = {
          top: '-'+element.height()
        };
        
        if(settings.animation.type === 'slide-fade') {
          animationOptions.opacity= 0.0;
        }
        
        wrapper.stop().animate({opacity:0.0}, (settings.animation.hideSpeed/2));
        
        element.stop().animate(animationOptions, settings.animation.hideSpeed, 
          function(){
            element.hide();
            settings.onClose(currentMessageType);
            callback();
          }
        );
      }
      else if(settings.animation.type === 'fade') {
        element.fadeOut(
          settings.animation.hideSpeed,
          function() {
            settings.onClose(currentMessageType);
            callback();
            currentMessageType = '';
          });
      }
      else {
        element.hide();
        settings.onClose(currentMessageType)
        currentMessageType = '';
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
    
    function getDateTime() {
      var now     = new Date(); 
      var year    = now.getFullYear();
      var month   = now.getMonth()+1; 
      var day     = now.getDate();
      var hour    = now.getHours();
      var minute  = now.getMinutes();
      var second  = now.getSeconds(); 
      
      if(month.toString().length === 1) {
          var month = '0'+month;
      }
      if(day.toString().length === 1) {
          var day = '0'+day;
      }   
      if(hour.toString().length === 1) {
          var hour = '0'+hour;
      }
      if(minute.toString().length === 1) {
          var minute = '0'+minute;
      }
      if(second.toString().length === 1) {
          var second = '0'+second;
      }   
      
      return day+'-'+month+'-'+year+' '+hour+':'+minute+':'+second;
  }

    function debug(messageType, data) {
      if(window.console && window.console.log) {
        window.console.log(getDateTime()+' ~ ' +messageType+ ': "' +data+ '"');
      }
    };
    
    return this;
  };
  
  $.fn.ppNotify.defaults = {
    autoHide: true,
    showCloseButton: true,
    duration: 5, //seconds
    position: 'top', //top or bottom
    log: true,
    opacity: 0.95,
    errorStyle: {
      color: '#000000',
      backgroundColor: '#FF9494'
    },
    warningStyle: {
      color: '#000000',
      backgroundColor: '#FFFF96'
    },
    successStyle: {
      color: '#000000',
      backgroundColor: '#B8FF6D'
    },
    animation: {
      type: 'slide-fade', //fade, scroll-left, scroll-left-fade, scroll-right, scroll-right-fade, slide, slide-fade or none
      showSpeed: 400 ,
      hideSpeed: 250
    },
    onClose: function() {},
    onShow: function() {}
  };
}(jQuery));
