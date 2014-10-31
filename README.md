## Demo

Take a look at the simple [demo](http://sudo-systems.github.io/jquery-sudo-notify/) that demonstrates some of the plugin's functionality


## Usage

1. Include plugin's css:

	```html
	<link rel="stylesheet" type="text/css" href="style/jquery.sudo-notify.min.css" />
	```

2. Include jQuery:

	```html
	<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
	```

3. Include plugin's code:

	```html
	<script type="text/javascript" src="scripts/jquery.sudo-notify.min.js"></script>
	```

4. Add html element to the body:

	```html
	<div id="notificationContainer"></div>
	```

4. Call the plugin (with default configuration):

	```javascript
	$(document).ready(function(){
      var sudoNotify = $('div#notificationContainer').sudoNotify();

      sudoNotify.success('Some success message');
      sudoNotify.warning('Some warning');
      sudoNotify.error('Some error');
    });
    ```

5. OPTIONAL: Call plugin with custom configuration (all attributes are optional)

    ```javascript
    $(document).ready(function(){
      var sudoNotify = $('div#notificationContainer').sudoNotify({
        autoHide: true,
        showCloseButton: true,
        duration: 6, //seconds
        position: 'top', //top or bottom
        log: true, //log all messages to console with timestamp
        opacity: 0.95,
        defaultStyle: {
          maxWidth: '1000px',
          fontSize: '16px'
        },
        errorStyle: { //allows for all possible css options
          color: '#000000',
          backgroundColor: '#FF9494'
        },
        warningStyle: { //allows for all possible css options
          color: '#000000',
          backgroundColor: '#FFFF96'
        },
        successStyle: { //allows for all possible css options
          color: '#000000',
          backgroundColor: '#B8FF6D'
        },
        animation: {
          type: 'slide-fade', //fade, scroll-left, scroll-left-fade, scroll-right, scroll-right-fade, slide, slide-fade or none
          showSpeed: 400,
          hideSpeed: 250
        },
        onClose: function(notificationType) {
          alert(notificationType+ ' notification closed');
        },
        onShow: function(notificationType) {
          alert(notificationType+ ' notification showing');
        }
      }
    });
	```

5. OPTIONAL: Or overwrite the default configuration before initiating the plugin (all attributes are optional)

    ```javascript
    $.fn.sudoNotify.defaults = {
      autoHide: true,
      showCloseButton: true,
      duration: 5, //seconds
      position: 'top', //top or bottom
      log: true,
      opacity: 0.95,
`     defaultStyle: {
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
        type: 'slide-fade', //fade, scroll-left, scroll-left-fade, scroll-right, scroll-right-fade, slide, slide-fade or none
        showSpeed: 400 ,
        hideSpeed: 250
      },
      onClose: function(notificationType) {
        alert(notificationType+ ' notification closed');
      },
      onShow: function(notificationType) {
        alert(notificationType+ ' notification showing');
      }
    };
	```

## TODO

1. Stop the scrollbars from appearing when a scroll or slide animation is in progress


## License

[MIT License](http://zenorocha.mit-license.org/) © Bram van Oploo / http://sudo-systems.com