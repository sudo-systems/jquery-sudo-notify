$(document).ready(function(){
  var showCallbackNotifications = false;
  var countdown = null;

  var sudoNotify = $('.notification-container').sudoNotify({
    autoHide: ($('#timeout').val() !== '0'),
    showCloseButton: ($('#showCloseButton').val() === '1'),
    duration: $('#timeout').val(), //seconds
    position: $('#position').val(), //top or bottom
    log: true,
    opacity: 0.95,
    defaultStyle: {
      maxWidth: '1000px',
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
      type: $('#animationType').val(), //fade, scroll-left, scroll-left-fade, scroll-right, scroll-right-fade, slide, slide-fade or none
      showSpeed: 400,
      hideSpeed: 250
    },
    onClose: function(notificationType) {
      if(showCallbackNotifications){
        alert(notificationType+ ' notification closed');
      }

      if(sudoNotify.getOption('autoHide') === true) {
        clearInterval(countdown);
        $('#countdown').html('0');
        $('#closeButton').hide();
      }
    },
    onShow: function(notificationType) {
      if(showCallbackNotifications){
        alert(notificationType+ ' notification showing');
      }

      if(sudoNotify.getOption('autoHide') === true) {
        var duration = sudoNotify.getOption('duration');
        $('#countdown').html(duration);
        $('#closeButton').show();

        duration = duration-1;
        countdown = setInterval(function(){
          if(duration === -1) {
            $('#countdown').html('0');
            $('#closeButton').hide();
            clearInterval(countdown);
          }
          else {
            $('#countdown').html(duration);
            duration--;
          }
        }, 1000);
      }
    }
  });

  $('#successButton').click(function(){
    sudoNotify.success('Great success!!!');
  });

  $('#warningButton').click(function(){
    sudoNotify.warning('Somthing\'s ratteling!');
  });

  $('#errorButton').click(function(){
    sudoNotify.error('Stop right now!!!');
  });

  $('#closeButton').click(function(){
    sudoNotify.close();
  });

  $('#animationType').change(function() {
    sudoNotify.setOption('animation', {
      type: $(this).val(),
      showSpeed: $.fn.sudoNotify.defaults.animation.showSpeed,
      hideSpeed: $.fn.sudoNotify.defaults.animation.hideSpeed
    });
  });

  $('#timeout').change(function() {
    if($(this).val() === '0') {
      sudoNotify.setOption('autoHide', false);
    }
    else {
      sudoNotify.setOption('autoHide', true);
      sudoNotify.setOption('duration', $(this).val());
    }
  });

  $('#showCallbackNotifications').change(function() {
    showCallbackNotifications = ($(this).val() === '1');
  });

  $('#position').change(function() {
    sudoNotify.setOption('position', $(this).val());
  });

  $('#showCloseButton').change(function() {
    sudoNotify.setOption('showCloseButton', ($(this).val() ==='1'));
  });

  //Notifications within container
  var sudoNotify2 = $('.notification-container-2').sudoNotify({
    autoHide: false,
    animation: {
      type: 'scroll-left-fade'
    },
    onShow: function() {
      $('#closeButton-2').show();
    },
    onClose: function() {
      $('#closeButton-2').hide();
    }
  });

  $('#successButton-2').click(function(){
    sudoNotify2.success('Great success!!!');
  });

  $('#warningButton-2').click(function(){
    sudoNotify2.warning('Somthing\'s ratteling!');
  });

  $('#errorButton-2').click(function(){
    sudoNotify2.error('Stop right now!!!');
  });

  $('#closeButton-2').click(function(){
    sudoNotify2.close();
  });
});