var formIsOk;

$(document).on('submit', 'form#register', function() {
    if (formIsOk.form()) {
      $.ajax({
          url: '/api/users/register',
          type: 'post',
          data: $('form#register').serialize(),
          success: function(msg, test) {
              window.location = '/users/login';
          },
          error: function(xhr, status, error) {
              if (error === 'Forbidden') {
                  var field = xhr.responseJSON;

                  $.each(field, function(index, value) {
                      for (var key in value) {
                          $('[name="' + key + '"]').css({border: '1px solid red'});
                          var msg = value[key];
                      }
                  });
              }
          }
      });
    }

    return false;
});
