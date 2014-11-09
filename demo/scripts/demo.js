      $(document).ready(function(){
        var showCallbackNotifications = false;
        var countdown = null;
        
        $('.notification-container').sudoNotify({
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
            
            if($('.notification-container').sudoNotify('getOption', 'autoHide') === true) {
              clearInterval(countdown);
              $('#countdown').html('0');
              $('#closeButton').hide();
            }
          },
          onShow: function(notificationType) {
            if(showCallbackNotifications){
              alert(notificationType+ ' notification showing');
            }
 
            if($('.notification-container').sudoNotify('getOption', 'autoHide') === true) {
              var duration = $('.notification-container').sudoNotify('getOption', 'duration');
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
          $('.notification-container').sudoNotify('success', 'Great success!!!');
        });

        $('#warningButton').click(function(){
          $('.notification-container').sudoNotify('warning', 'Something\'s ratteling!');
        });

        $('#errorButton').click(function(){
          $('.notification-container').sudoNotify('error', 'Stop right now!!!');
        });
        
        $('#closeButton').click(function(){
          $('.notification-container').sudoNotify('close');
        });

        $('#animationType').change(function() {
          $('.notification-container').sudoNotify('setOption', 'animation', {
            type: $(this).val(),
          });
        });
        
        $('#timeout').change(function() {
          if($(this).val() === '0') {
            $('.notification-container').sudoNotify('setOption', 'autoHide', false);
          }
          else {
            $('.notification-container').sudoNotify('setOption', 'autoHide', true);
            $('.notification-container').sudoNotify('setOption', 'duration', $(this).val());
          }
        });
        
        $('#showCallbackNotifications').change(function() {
          showCallbackNotifications = ($(this).val() === '1');
        });
        
        $('#position').change(function() {
          $('.notification-container').sudoNotify('setOption', 'position', $(this).val());
        });
        
        $('#showCloseButton').change(function() {
          $('.notification-container').sudoNotify('setOption', 'showCloseButton', ($(this).val() ==='1'));
        });
        
        //Notifications within container
        $('.notification-container-2').sudoNotify({
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
          $('.notification-container-2').sudoNotify('success', 'Great success!!!');
        });

        $('#warningButton-2').click(function(){
          $('.notification-container-2').sudoNotify('warning','Something\'s ratteling!');
        });

        $('#errorButton-2').click(function(){
          $('.notification-container-2').sudoNotify('error', 'Stop right now!!!');
        });
        
        $('#closeButton-2').click(function(){
          $('.notification-container-2').sudoNotify('close');
        });
      });
