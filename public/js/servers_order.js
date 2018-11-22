$(document).on('submit', 'form#server_order', function() {
    $.ajax({
        url: '/api/servers/order',
        type: 'post',
        data: $(this).serialize(),
        success: function(msg) {
            $('input[type!="submit"]').css({border: '1px solid green'});
            $('input[type!="submit"]').val('');
        },
        error: function(xhr, status, error) {
            if (error === 'Forbidden') {
                var value = xhr.responseJSON;
                for (var key in value) {
                    $('[name="' + key + '"]').css({border: '1px solid red'});
                    var msg = value[key];
                }
            } else if (error === 'Unauthorized') {
                $('input[type!="submit"]').val('');
                $('input[type!="submit"]').attr('placeholder', 'Vec imate narudzbinu na cekanju...');
                $('input[type!="submit"]').attr('disabled', 'disabled');
            }
        }
    });
    return false;
});