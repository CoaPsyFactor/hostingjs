$(document).ready(function() {
    $.ajax({
        url: '/api/users/profile',
        type: 'get',
        success: function(data) {
            $('input#name').val(data.name);
            $('input#email').val(data.email);
            $('span#customer_name').html(data.name);
        }
    });

    return false;
});
