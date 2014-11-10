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

(function( $ ){
  var privateMethods = {
    //Helper methods
    getDateTime: function() {
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
    },
    debug: function(messageType, data) {
      if(window.console && window.console.log) {
        window.console.log(privateMethods.getDateTime.call(self)+' ~ ' +messageType+ ': "' +data+ '"');
      }
    },
    setIcon: function(messageType) {
      var self = this;
      var data = self.data("sudoNotify");
      var settings = data.settings;

      if(messageType === 'success'){
        data.iconContainer.removeClass('fa-check fa-exclamation-triangle fa-ban').addClass('fa-check');
      }
      else if(messageType === 'warning'){
        data.iconContainer.removeClass('fa-check fa-exclamation-triangle fa-ban').addClass('fa-exclamation-triangle');
      }
      else if(messageType === 'error'){
        data.iconContainer.removeClass('fa-check fa-exclamation-triangle fa-ban').addClass('fa-ban');
      }
    },
    show: function(messageType, message) {
      var self = this;
      var data = self.data("sudoNotify");
      var settings = data.settings;

      var positionCss = (settings.position === 'bottom')? data.bottomCss : data.topCss;
      self.css(positionCss).css('opacity', settings.opacity);
      data.closeButtonContainer.toggle(settings.showCloseButton);
        
      if(self.is(':visible') && settings.animation.type !== 'none') {
        privateMethods.executeHide.call(self, function() {
          data.currentMessageType = messageType;
          privateMethods.executeShow.apply(self, [messageType, message, function() {
            privateMethods.initDelayedHide.call(self);
          }]);
        });
      }
      else {
        data.currentMessageType = messageType;
        privateMethods.executeShow.apply(self, [messageType, message, function() {
          privateMethods.initDelayedHide.call(self);
        }]);
      }
    },
    executeShow: function(messageType, message, callback) {
      var self = this;
      var data = self.data("sudoNotify");
      var settings = data.settings;

      callback = (callback === 'undefined' || typeof callback !== 'function')? function(){} : callback;
      clearTimeout(data.timer);
      self.css(settings[messageType+'Style']);
      data.messageContainer.html(message);
      data.closeButtonContainer.css('color', settings[messageType+'Style'].color);
      privateMethods.setIcon.call(self, messageType);
      
      if(settings.animation.type === 'expand') {
        privateMethods.expandIn.call(self, callback);
      }
      else if(settings.animation.type.isIn('scroll-right', 'scroll-left', 'scroll-right-fade', 'scroll-left-fade')) {
        privateMethods.scrollIn.call(self, callback);
      }
      else if(settings.animation.type.isIn('slide', 'slide-fade') ) {
        privateMethods.slideIn.call(self, callback);
      }
      else if(settings.animation.type === 'fade') {
        privateMethods.fadeIn.call(self, callback);
      }
      else {
        privateMethods.simpleShow.call(self, callback);
      }

      if(settings.log === true) {
        privateMethods.debug.apply(self, [messageType, message]);
      }
    }, 
    executeHide: function(callback) {
      var self = this;
      var data = self.data("sudoNotify");
      var settings = data.settings;

      callback = (callback === 'undefined' || typeof callback !== 'function')? function(){} : callback;
      clearTimeout(data.timer);
      
      if(settings.animation.type === 'expand') {
        privateMethods.expandOut.call(self, callback);
      }
      else if(settings.animation.type.isIn('scroll-right', 'scroll-left', 'scroll-right-fade', 'scroll-left-fade')) {
        privateMethods.scrollOut.call(self, callback);
      }
      else if(settings.animation.type.isIn('slide', 'slide-fade')) {
        privateMethods.slideOut.call(self, callback);
      }
      else if(settings.animation.type === 'fade') {
        privateMethods.fadeOut.call(self, callback);
      }
      else {
        privateMethods.simpleHide.call(self, callback);
      }
    },
    initDelayedHide: function() {
      var self = this;
      var data = self.data("sudoNotify");
      var settings = data.settings;

      if(settings.autoHide === true) {
        clearTimeout(data.timer);
        data.timer = setTimeout(function() {
          privateMethods.executeHide.call(self);
        }, settings.duration * 1000);
      }
    },
    
    //Animations
    expandIn: function(callback) {
      var self = this;
      var data = self.data("sudoNotify");
      var settings = data.settings;

      var initialPosition = (data.parentElement.width()/2)+'px';
      var targetPostion = '0px';
      
      data.wrapper.css('whiteSpace', 'nowrap').css('opacity', 0.0);
      self.css('width', '0%').css('left', initialPosition).show();
      
      var animationOptions = {
        left: targetPostion,
        width: '100%'
      };

      self.stop().animate(animationOptions,settings.animation.selfShowSpeed, 
        function() {
          settings.onShow(data.currentMessageType);
          callback();
          data.wrapper.stop().css('whiteSpace', 'normal').animate({opacity:1.0}, data.wrapperFadeSpeed);
        }
      );
    },
    expandOut: function(callback) {
      var self = this;
      var data = self.data("sudoNotify");
      var settings = data.settings;

      var targetPosition = (data.parentElement.width()/2)+'px';
      var animationOptions = {
        left: targetPosition,
        width: '0%'
      };

      data.wrapper.stop().animate({opacity:0.0}, data.wrapperFadeSpeed, function() {
        $(this).hide();
      });
      
     self.stop().animate(animationOptions,settings.animation.selfHideSpeed, 
        function(){
         self.hide();
          data.wrapper.show();
          settings.onClose(data.currentMessageType);
          callback();
        }
      );
    },
    scrollIn: function(callback) {
      var self = this;
      var data = self.data("sudoNotify");
      var settings = data.settings;

      var initialPosition = settings.animation.type.isIn('scroll-right', 'scroll-right-fade')? '-'+self.width()+'px' :self.width()+'px';
        
      if(settings.animation.type.isIn('scroll-right-fade', 'scroll-left-fade')) {
       self.css('opacity', 0.0);
      }

      data.wrapper.css('opacity', 0.0);
      self.css('left', initialPosition).show();
      var animationOptions = {left: '0px'};

      if(settings.animation.type.isIn('scroll-right-fade', 'scroll-left-fade')) {
        animationOptions.opacity= settings.opacity;
      }

      self.stop().animate(animationOptions,settings.animation.selfShowSpeed, 
        function() {
          settings.onShow(data.currentMessageType);
          callback();
          data.wrapper.stop().animate({opacity:1.0}, data.wrapperFadeSpeed);
        }
      );
    },
    scrollOut: function(callback) {
      var self = this;
      var data = self.data("sudoNotify");
      var settings = data.settings;

      var targetPosition = settings.animation.type.isIn('scroll-right', 'scroll-right-fade')? '-'+self.width()+'px' :self.width()+'px';
      var animationOptions = {left: targetPosition};

      if(settings.animation.type.isIn('scroll-right-fade', 'scroll-left-fade')) {
        animationOptions.opacity= 0.0;
      }
      
      data.wrapper.stop().animate({opacity:0.0}, data.wrapperFadeSpeed);
      self.stop().animate(animationOptions,settings.animation.selfHideSpeed, 
        function(){
         self.hide();
          settings.onClose(data.currentMessageType);
          callback();
        }
      );
    },
    slideIn: function(callback) {
      var self = this;
      var data = self.data("sudoNotify");
      var settings = data.settings;

      if(settings.animation.type === 'slide-fade') {
        self.css('opacity', 0.0);
      }

      data.wrapper.css('opacity', 0.0);
      self.css(settings.position, '-'+self.height()).show();

      var animationOptions = {};
      animationOptions[settings.position] = '0px';

      if(settings.animation.type === 'slide-fade') {
        animationOptions['opacity'] = settings.opacity;
      }

      self.stop().animate(animationOptions,settings.animation.selfShowSpeed, 
        function() {
          settings.onShow(data.currentMessageType);
          callback();
          data.wrapper.stop().animate({opacity:1.0}, data.wrapperFadeSpeed);
        }
      );
    },
    slideOut: function(callback) {
      var self = this;
      var data = self.data("sudoNotify");
      var settings = data.settings;

      var animationOptions = {};
      animationOptions[settings.position] = '-'+self.height();

      if(settings.animation.type === 'slide-fade') {
        animationOptions['opacity'] = 0.0;
      }

      data.wrapper.stop().animate({opacity:0.0}, data.wrapperFadeSpeed);
      self.stop().animate(animationOptions,settings.animation.selfHideSpeed, 
        function(){
         self.hide();
          settings.onClose(data.currentMessageType);
          callback();
        }
      );
    },
    fadeIn: function(callback) {
      var self = this;
      var data = self.data("sudoNotify");
      var settings = data.settings;

      self.fadeIn(settings.animation.showSpeed, 
        function() {
          settings.onShow(data.currentMessageType);
          callback();
        }
      );
    },
    fadeOut: function(callback) {
      var self = this;
      var data = self.data("sudoNotify");
      var settings = data.settings;

      self.fadeOut(settings.animation.hideSpeed,
        function() {
          settings.onClose(data.currentMessageType);
          callback();
          data.currentMessageType = '';
        }
      );
    }, 
    simpleShow: function(callback) {
      var self = this;
      var data = self.data("sudoNotify");
      var settings = data.settings;

      self.show();
      callback();
      settings.onShow(data.currentMessageType);
    },
    simpleHide: function(callback) {
      var self = this;
      var data = self.data("sudoNotify");
      var settings = data.settings;

      self.hide();
      callback();
      settings.onClose(data.currentMessageType);
      data.currentMessageType = '';
    }
  };

  var methods = {
    init: function( options ) {
      return this.each(function(){
        var self = $(this);
        var data = self.data("sudoNotify");

        // If the plugin hasn't been initialized yet
        if (! data) {
          var settings = $.extend(true, {}, $.fn.sudoNotify.defaults, options);
          self.data("sudoNotify", {
            settings: settings,
            topCss: {
              top: 0, 
              bottom:''
            },
            bottomCss: {
              bottom: 0, 
              top:''
            },
            timer:                null,
            currentMessageType:   '',
            wrapperFadeSpeed:     null, 
            cssPosition:          null, 
            parentElement:        null,
            iconContainer:        $('<div class="sn-icon fa" style="font-size: '+settings.defaultStyle.fontSize+'"></div>'),
            messageContainer:     $('<div class="sn-message"></div>'),
            closeButtonContainer: $('<div class="sn-close-button fa fa-times"></div>'),
            wrapper:              $('<div class="sn-wrapper"></div>')
          });
          var data = self.data("sudoNotify");
          var settings = data.settings;

          data.parentElement = self.parent();
          data.wrapperFadeSpeed = (settings.animation.showSpeed/3);


          self.addClass('sn')
              .css('position', data.parentElement.is('body') ? 'fixed' : settings.positionType)
              .append(data.wrapper);

          data.wrapper
              .css(settings.defaultStyle)
              .append(data.iconContainer, data.messageContainer, data.closeButtonContainer);

          if(settings.position === 'bottom') {
            self.css('borderBottomRadius', 'inherit');
            data.bottomCss.bottom = settings.verticalMargin;
          } else {
            self.css('borderTopRadius', 'inherit');
            data.topCss.top = settings.verticalMargin;
          }

          if(!data.parentElement.is('body')) {
            if(data.parentElement.css('position').isIn('', 'static')){
              data.parentElement.css('position', 'relative');
            }

            if(data.parentElement.css('overflow').isIn('', 'visible')){
              data.parentElement.css('overflow', 'hidden');
            }
          }

          data.closeButtonContainer.on('click', function(e) {
            e.preventDefault();
            executeHide();
          });
        }
      });
    },
    error: function(message) {
      var self = this;
      privateMethods.show.apply(self, ['error', message]);
    },
    warning: function(message) {
      var self = this;
      privateMethods.show.apply(self, ['warning', message]);
    },
    success: function(message) {
      var self = this;
      privateMethods.show.apply(self, ['success', message]);
    },
    setOption: function(key, value) {
      var self = this;
      var data = self.data("sudoNotify");
      var settings = data.settings; 

      settings[key] = value;
    },
    getOption: function(key) {
      var self = this;
      var data = self.data("sudoNotify");
      var settings = data.settings; 

      return settings[key];
    },
    close: function() {
      var self = this;
      privateMethods.executeHide.call(self);
    }
  };
  $.fn.sudoNotify = function(method, options) {
    if (methods[method]) {
      return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
    } else if ( typeof method === 'object' || ! method ) {
      return methods.init.apply( this, arguments );
    } else {
      $.error( 'Method ' +  method + ' does not exist on jQuery.sudoNotify' );
    }
  };
  $.fn.sudoNotify.defaults = {
    autoHide: true,
    showCloseButton: true,
    duration: 6, //seconds
    position: 'top', //top or bottom
    positionType: 'absolute', //absolute, relative or fixed. Only applies if the elemnt's parent isn't the body. Otherwise it will always be fixed
    verticalMargin: '0px', //Doesn't work if positionType is 'relative'
    log: true,
    opacity: 0.95,
    defaultStyle: {
      maxWidth: '1200px',
      fontSize: '16px'
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
      type: 'slide-fade', //fade, scroll-left, scroll-left-fade, scroll-right, scroll-right-fade, slide, slide-fade or none, expand
      showSpeed: 400 ,
      hideSpeed: 250
    },
    onClose: function() {},
    onShow: function() {}
  };

})( jQuery );

