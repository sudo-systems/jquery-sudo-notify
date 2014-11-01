## Demo

Take a look at the simple [demo](http://sudo-systems.github.io/jquery-sudo-notify/) that demonstrates some of the plugin's functionality


## Updates

The current version is 0.2.0 (november 1st 2014)


## Description

A jQuery plugin that allows you to create fully customisable notifications with very little effort.
Multiple instances can be added to one page without conflicts. 
You can add a notifications directly to the body and on the same page create anonther instances in i.e. a div or any other DOM element for that matter.
The plugin will automatically prepare the parent element to fit the needs for proper usage within that element. 

The available public methods per instance are:

1. showError('error message')
2. showSuccess('success message')
3. showWarning('warning message')
4. close()

Event callback options are:

1. onClose
2. onShow

The configuration options are explained below.


## Usage

1. Include plugin's css:

	```html
	<link rel="stylesheet" type="text/css" href="https://cdn.rawgit.com/sudo-systems/jquery-sudo-notify/master/dist/style/jquery.sudo-notify.min.css" />
	```

2. Donwload the plugin, extract it and place the directory "dist/images/" in the root of your web application (or use the downloaded css file and modify the image paths).

3. Include jQuery:

	```html
	<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
	```

4. Include plugin's code:

	```html
	<script type="text/javascript" src="https://cdn.rawgit.com/sudo-systems/jquery-sudo-notify/master/dist/jquery.sudo-notify.min.js"></script>
	```

5. Add html element to the body:

	```html
	<div id="notificationContainer"></div>
	```

6. Call the plugin (with default configuration):

	```javascript
	$(document).ready(function(){
      var sudoNotify = $('div#notificationContainer').sudoNotify();

      sudoNotify.success('Some success message');
      sudoNotify.warning('Some warning');
      sudoNotify.error('Some error');
      sudoNotify.close();
    });
    ```

7. OPTIONAL: Call plugin with custom configuration (all attributes are optional)

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

8. OPTIONAL: Or overwrite the default configuration before initiating the plugin (all attributes are optional)

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

[BSD License](http://opensource.org/licenses/BSD-3-Clause) © Bram van Oploo / [Sudo Systems](http://sudo-systems.com)