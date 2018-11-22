$(document).on('mouseenter', 'i.order_decline', function() {
    $(this).css({color: 'brown'});
});

$(document).on('mouseleave', 'i.order_decline', function() {
    $(this).css({color: 'white'});
});

$(document).on('mouseenter', 'i.order_accept', function() {
    $(this).css({color: 'green'});
});

$(document).on('mouseleave', 'i.order_accept', function() {
    $(this).css({color: 'white'});
});

$(document).on('click', 'i.order_decline', function() {
    var id = $(this).attr('data-attr'), self = $(this);

    if (!id) {
        self.parents('.order_main').fadeOut();
        return false;
    }

    $.ajax({
        url: '/api/servers/decline/' + id,
        type: 'get',
        success: function(data) {
            self.parents('.order_main').fadeOut();
        },
        error: function(xhr, err, status) {
            self.parents('.order_main').css('border', '1px solid red;');
        }
    });
});

$(document).on('click', 'i.order_accept', function() {
    var id = $(this).attr('data-attr'), self = $(this);

    if (!id) {
        self.parents('.order_main').fadeOut();
        return false;
    }

    $.ajax({
        url: '/api/servers/accept/' + id,
        type: 'get',
        success: function(data) {
            self.parents('.order_main').fadeOut();
        },
        error: function(xhr, err, status) {
            self.parents('.order_main').css('border', '1px solid red;');
        }
    });
});
