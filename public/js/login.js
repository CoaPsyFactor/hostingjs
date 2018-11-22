$(document).on('submit', 'form#login', function() {
    var u = $('#username').val() || '';
    var p = $('#password').val() || '';
    if (u.length && p.length) {
      console.log('test');
	     $.ajax({
	        url: '/api/users/login',
	         type: 'post',
	          data: 'email=' + u + '&password=' + p,
	          success: function(msg) {
		               window.location = '/home/main';
		               return false;
            },
            error: function (msg) {

              showMessage(2, msg.responseJSON.message);
              // $('.error-span').html(msg.responseJSON.message);
              // $('.errorStatus').fadeIn();
            }
       });
    }
    return false;
});
