(function ($, window, document) {
  Drupal.behaviors.thsixty = {
    attach: function (context) {
      var config = {
        env: Drupal.settings.hm_newsletter.env,
        version: 'v1',
      };
      window.thsixtyQ = window.thsixtyQ || [];
      window.thsixtyQ.push(['init', {config: config}]);
      var th = document.createElement('script');
      th.type = 'text/javascript';
      th.async = true;
      if (Drupal.settings.hm_newsletter.env == 'staging') {
        th.src = "//d2528hoa8g0iaj.cloudfront.net/staging/thsixty.min.js";
      } else {
        th.src = "//d2528hoa8g0iaj.cloudfront.net/thsixty.min.js";
      }
      var s = document.getElementsByTagName('script')[0];
      s.parentNode.insertBefore(th, s);
    }
  };
})(jQuery, window, document);
