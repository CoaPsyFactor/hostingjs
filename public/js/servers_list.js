var serverItem = function(data) {

    if (data.status === 0) {
	     content += '<div style="z-index: 2; width: 1004px; height: 90px; position: absolute; background-color: rgba(100, 100, 100, 0.8)"><center style="color: white; font-size: 48px; opacity: 0.6; margin-top: 15px">Na cekanju</center></div>';
    }
    return content;
};

var serverOnline = function(id) {
    $('i#status_' + id).css({color: 'silver'});

    $.ajax({
	url: '/api/servers/online/' + id,
	type: 'get',
	success: function(msg) {
	    id = msg.id;
	    $('i#status_' + id).css({color: 'green'});
	},
	error: function(xhr, err, status) {
	    id = xhr.responseJSON.id;
	    $('i#status_' + id).css({color: 'darkred'});
	}
    });
};

var SendAjax = function(url) {
    var tmp = url.split('/');
    var id = tmp[tmp.length - 1];

    $.ajax({
	url: url,
	type: 'get',
	success: function(msg) {
	    serverOnline(id);
	}
    });

    return false;
};

$(document).ready(function() {


    $.ajax({
      url: '/api/servers/list',
      type: 'get',
	    success: function(data) {
        for (var key in data) {
		        serverOnline(data[key].id);
	          $('div.serversContainer').append(serverItem(data[key]));
        }
	     }
    });
});
