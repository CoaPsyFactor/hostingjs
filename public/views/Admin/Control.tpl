<div class="panel panel-default panel-left">
  <div class="panel-heading text-left">
    Admin Panel
  </div>
  <div class="panel-body">
    <div class="col-md-6">
    <div class="panel panel-primary">
      <div class="panel-heading text-center">
        Narudzbine
      </div>
      <div class="panel-body orders">

      </div>
    </div>
  </div>
  <div class="col-md-6">
    <div class="panel panel-primary">
      <div class="panel-heading text-center">
        Tiketi
      </div>
      <div class="panel-body tickets">

      </div>
    </div>
  </div>
  </div>
</div>
<script type="text/javascript">
var buildOrder = function(data) {
    //var content =
    var content = '<div class="order_main">' +
            '<span class="order_message">Korisnik <b>' + data.owner + '</b> je narucio server od <b>' + data.slots + '</b> slotova</span>' +
            '<span class="order_action"><i data-attr="' + data.id + '" class="order_accept fa fa-check-square-o"></i>' +
            '<i data-attr="' + data.id + '" class="order_decline fa fa-minus-square"></i></span></div>';

    return content;
}

$(document).ready(function() {
    $.ajax({
        url: '/api/orders',
        type: 'get',
        success: function(data) {
            if (data.length) {
                for (key in data) {
                    var value = data[key]
                    $('.orders').append(buildOrder(value));
                }
            } else {
                $('.orders').append('<center><div class="order_main">Nema porudzbina</div></center>');
            }
        }
    });
});

</script>
