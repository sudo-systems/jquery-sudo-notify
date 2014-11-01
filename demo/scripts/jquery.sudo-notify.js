String.prototype.isIn = function() {
  if(this === 'undefined') {
    return false;
  }
  
  for(var i=0; i<arguments.length; i++) {
    if($.trim(arguments[i]) === $.trim(this.toString())){ 
      return true;
    }
  }
  
  return false;
};

(function($) {
  $.fn.sudoNotify = function(options) {
    var settings = $.extend(true, {}, $.fn.sudoNotify.defaults, options);
    var topCss = {top:0, bottom:''};
    var bottomCss = {bottom:0, top:''};
    var timer = null;
    var element = this;
    var currentMessageType = '';
    var cssPosition, messageContainer, closeButtonContainer, wrapper;

    init();

    //Private methods
    function init() {
      cssPosition = element.parent().is('body')? 'fixed' : 'absolute';
      messageContainer = $('<div></div>').addClass('message');
      closeButtonContainer = $('<div></div>').addClass('close-button');
      wrapper = $('<div></div>').addClass('wrapper', 'sn-clearfix').css(settings.defaultStyle).append(messageContainer, closeButtonContainer);
      
      element.addClass('sudoNotify', 'sn-clearfix').css('position', cssPosition).append(wrapper);
      closeButtonContainer.toggle(settings.showCloseButton);

      if(!element.parent().is('body')) {
        if(element.parent().css('position').isIn('', 'static')){
          element.parent().css('position', 'relative');
        }

        if(element.parent().css('overflow').isIn('', 'visible')){
          element.parent().css('overflow', 'hidden');
        }
      }
    }

    function setClass(className) {
      element.removeClass('error warning success').addClass(className);
    }
    
    function show(messageType, message) {
      var positionCss = (settings.position === 'bottom')? bottomCss : topCss;
      element.css(positionCss).css('opacity', settings.opacity);
      closeButtonContainer.toggle(settings.showCloseButton);
        
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
      element.css(settings[messageType+'Style']);
      messageContainer.html(message);

      if(settings.animation.type.isIn('scroll-right', 'scroll-left', 'scroll-right-fade', 'scroll-left-fade')) {
        scrollIn(callback);
      }
      else if(settings.animation.type.isIn('slide', 'slide-fade') ) {
        slideIn(callback);
      }
      else if(settings.animation.type === 'fade') {
        fadeIn(callback);
      }
      else {
        simpleShow(callback);
      }

      if(settings.log === true) {
        debug(messageType, message);
      }
    }
    
    function executeHide(callback) {
      callback = (callback === 'undefined' || typeof callback !== 'function')? function(){} : callback;
      clearTimeout(timer);
      
      if(settings.animation.type.isIn('scroll-right', 'scroll-left', 'scroll-right-fade', 'scroll-left-fade')) {
        scrollOut(callback);
      }
      else if(settings.animation.type.isIn('slide', 'slide-fade')) {
        slideOut(callback);
      }
      else if(settings.animation.type === 'fade') {
        fadeOut(callback);
      }
      else {
        simpleHide(callback);
      }
    }
    
    function initDelayedHide() {
      if(settings.autoHide === true) {
        clearTimeout(timer);
        timer = setTimeout(function() {
          executeHide();
        }, (parseInt(settings.duration)*1000));
      }
    }
    
    //Animations
    function scrollIn(callback) {
      var initialPosition = settings.animation.type.isIn('scroll-right', 'scroll-right-fade')? '-'+element.width()+'px' : element.width()+'px';
        
      if(settings.animation.type.isIn('scroll-right-fade', 'scroll-left-fade')) {
        element.css('opacity', 0.0);
      }

      wrapper.css('opacity', 0.0);
      element.css('left', initialPosition).show();
      var animationOptions = {left: '0px'};

      if(settings.animation.type.isIn('scroll-right-fade', 'scroll-left-fade')) {
        animationOptions.opacity= settings.opacity;
      }

      element.stop().animate(animationOptions, parseInt(settings.animation.showSpeed), 
        function() {
          settings.onShow(currentMessageType);
          callback();
          wrapper.stop().animate({opacity:1.0}, (parseInt(settings.animation.showSpeed)/3));
        }
      );
    }
    
    function scrollOut(callback) {
      var targetPosition = settings.animation.type.isIn('scroll-right', 'scroll-right-fade')? '-'+element.width()+'px' : element.width()+'px';
      var animationOptions = {left: targetPosition};

      if(settings.animation.type.isIn('scroll-right-fade', 'scroll-left-fade')) {
        animationOptions.opacity= 0.0;
      }

      wrapper.stop().animate({opacity:0.0}, (parseInt(settings.animation.hideSpeed)/2));
      element.stop().animate(animationOptions, parseInt(settings.animation.hideSpeed), 
        function(){
          element.hide();
          settings.onClose(currentMessageType);
          callback();
        }
      );
    }
    
    function slideIn(callback) {
      if(settings.animation.type === 'slide-fade') {
        element.css('opacity', 0.0);
      }

      wrapper.css('opacity', 0.0);
      element.css(settings.position, '-'+element.height()).show();

      var animationOptions = {};
      animationOptions[settings.position] = '0px';

      if(settings.animation.type === 'slide-fade') {
        animationOptions['opacity'] = settings.opacity;
      }

      element.stop().animate(animationOptions, parseInt(settings.animation.showSpeed), 
        function() {
          settings.onShow(currentMessageType);
          callback();
          wrapper.stop().animate({opacity:1.0}, (parseInt(settings.animation.showSpeed)/3));
        }
      );
    }
    
    function slideOut(callback) {
      var animationOptions = {};
      animationOptions[settings.position] = '-'+element.height();

      if(settings.animation.type === 'slide-fade') {
        animationOptions['opacity'] = 0.0;
      }

      wrapper.stop().animate({opacity:0.0}, (parseInt(settings.animation.hideSpeed)/2));
      element.stop().animate(animationOptions, parseInt(settings.animation.hideSpeed), 
        function(){
          element.hide();
          settings.onClose(currentMessageType);
          callback();
        }
      );
    }
    
    function fadeIn(callback) {
      element.fadeIn(parseInt(settings.animation.showSpeed), 
        function() {
          settings.onShow(currentMessageType);
          callback();
        }
      );
    }
    
    function fadeOut(callback) {
      element.fadeOut(parseInt(settings.animation.hideSpeed),
        function() {
          settings.onClose(currentMessageType);
          callback();
          currentMessageType = '';
        }
      );
    }
    
    function simpleShow(callback) {
      element.show();
      callback();
      settings.onShow(currentMessageType);
    }
    
    function simpleHide(callback) {
      element.hide();
      callback();
      settings.onClose(currentMessageType);
      currentMessageType = '';
    }
    
    closeButtonContainer.on('click', function(e) {
      e.preventDefault();
      executeHide();
    });
    
    //Helper methods
    function getDateTime() {
      var now     = new Date(); 
      var year    = now.getFullYear();
      var month   = now.getMonth()+1; 
      var day     = now.getDate();
      var hour    = now.getHours();
      var minute  = now.getMinutes();
      var second  = now.getSeconds(); 
      
      month = (month.toString().length === 1)? month = '0'+month : month;
      day = (day.toString().length === 1)? day = '0'+day : day;
      hour = (hour.toString().length === 1)? hour = '0'+hour : hour;
      minute = (minute.toString().length === 1)? minute = '0'+minute : minute;
      second = (second.toString().length === 1)? second = '0'+second : second;

      return day+'-'+month+'-'+year+' '+hour+':'+minute+':'+second;
  }

    function debug(messageType, data) {
      if(window.console && window.console.log) {
        window.console.log(getDateTime()+' ~ ' +messageType+ ': "' +data+ '"');
      }
    };

    //Public methods
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
    
    this.close = function() {
      executeHide();
    };

    return this;
  };
  
  $.fn.sudoNotify.defaults = {
    autoHide: true,
    showCloseButton: true,
    duration: 5, //seconds
    position: 'top', //top or bottom
    log: true,
    opacity: 0.95,
    defaultStyle: {
      maxWidth: '1200px'
    },
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
