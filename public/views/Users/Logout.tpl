<script type="text/javascript">
	$(document).ready(function () {
		$.ajax({
			url: '/api/users/logout',
			type: 'get',
			success: function (msg) {
				window.location = '/users/login';
			}
		})
	});
</script>