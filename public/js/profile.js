$(document).on('submit', 'form#profile', function() {
    $.ajax({
        url: '/api/users/profile',
        type: 'put',
        data: $(this).serialize(),
        success: function(msg) {
            $('input[type="password"]').attr('disabled', 'disabled');

            $('form#profile button')
              .removeClass('btn-primary')
              .addClass('btn-success')
              .attr('disabled', 'disabled');


            showMessage(1, 'Lozinka uspesno promenjena');
            // $('.success-span').html('Lozinka uspesno promenjena.');
            // $('.successStatus').fadeIn();
        },
        error: function(xhr, status, error) {
            if (error === 'Forbidden') {
                var value = xhr.responseJSON;
                var msg = '';
                for (var key in value) {
                    msg = msg + value[key];
                };

                showMessage(2, msg)
            }
        }
    });

    return false;
});

$(document).on('keyup', 'form#profile input', function () {
  var _pass = $('form#profile input#password').val() || '';
  var _re_pass = $('form#profile input#repassword').val() || '';
  var _cur_pass = $('form#profile input#currentpassword').val() || '';

  if (_pass.length && _re_pass.length && _cur_pass.length) {
    $('form#profile button').removeAttr('disabled');
  } else {
    $('form#profile button').attr('disabled', 'disabled');
  }
});
