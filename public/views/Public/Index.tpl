<html>
    <head>
        <title>{pagetitle}</title>
        <link rel="stylesheet" href="/css/bootstrap.min.css">

        <!-- Optional theme -->
        <link rel="stylesheet" href="/css/bootstrap-theme.min.css">

        <!-- Latest compiled and minified JavaScript -->
        <script type="text/javascript" src="/js/jquery.js" ></script>
        <script type="text/javascript" src="/js/jquery.validate.min.js" ></script>
        <script type="text/javascript" src="/js/bootstrap.min.js"></script>
        :admin_script:
        
        <script type="text/javascript">
            var showMessage = function (type, message) {
              var span, element;

              if (type === 1) {
                span = $('.success-span');
                element = $('.successStatus');
              } else if (type === 2) {
                span = $('.error-span');
                element = $('.errorStatus');
              }

              span.html(message);
              element.fadeIn();
              setTimeout(function () {
                element.fadeOut();
              }, 2000);
            }
            var ajaxload;

            var loadPage = function(url) {
                if (ajaxload) {
                    ajaxload.abort();
                }

                if (url.indexOf('/api/') !== -1) {
                    return true;
                }

                $('div.inside').hide();
                $('div.loader').fadeIn();
                ajaxload = $.ajax({
                    url: url,
                    type: 'get',
                    success: function(msg) {
                        $('div.loader').fadeOut(function() {
                            $('div.loader').fadeOut(function() {
                                document.location.hash = url;
                                $('div.inside').html(msg);
                                $('div.inside').fadeIn();
                            });
                        });
                    }
                });
                return false;
            };

            $(document).on('click', 'a', function() {
                var link = $(this).attr('href');
                var hlink = window.location.hash === '#' + link;

                if (link != '#' && !hlink) {
                  loadPage(link);
                }

                return false;
            });

            $(document).on('click', function () {
                $('.errorStatus').fadeOut();
                $('.successStatus').fadeOut();
            });

            $(document).ready(function() {
                if (document.location.hash.slice(1).length) {
                    window.location = document.location.hash.slice(1);
                    return;
                } else {
                  window.location.hash = document.location.pathname;
                }
            });
        </script>
    </head>
    <body>
        <div class="container">
            :navbar:
            <div class="row errorStatus" style="display: none;">
                <div class="col-md-12 text-center ">
                    <div class="alert alert-danger">
                      <strong>Greska!</strong>
                      <span class="error-span"></span>
                    </div>
                </div>
            </div>
            <div class="row successStatus" style="display: none;">
                <div class="col-md-12 text-center ">
                    <div class="alert alert-success">
                      <strong>Poruka! </strong>
                      <span class="success-span"></span>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-xs-12 col-md-8 text-center">
                    <div class="loader" style="display: none;">
                        <img src="../images/new/ajax-loader.gif" />
                    </div>
                    <div class="inside">
                        :inside_contents:
                    </div>
                </div>
                <div class="col-xs-6 col-md-4">
                    <div class="panel panel-default panel-right">
                        <!-- Default panel contents -->
                        <div class="panel-heading">Neews Feed</div>
                        <div class="panel-body">
                            <div class="media">
                                <a class="pull-left" href="#">
                                    <img class="media-object" style="width: 64px;" src="http://i1.tribune.com.pk/wp-content/uploads/2014/03/677455-MicrosoftAFP-1393621093-915-640x480.jpg" alt="msoft">
                                </a>
                                <div class="media-body">
                                    <h4 class="media-heading">Media heading</h4>
                                    <h6>
                                        updalkjn aspiodkj cpisjnmadskhnasoci-ov dsp fijnsjkcv noid ahi
                                    </h6>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </body>

</html>
