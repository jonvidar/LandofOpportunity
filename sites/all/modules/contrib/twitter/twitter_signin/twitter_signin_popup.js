(function ($) {

/**
 * Add Drupal behaviors
 */
Drupal.behaviors.TwitterSigninPopup = {
  attach : function(context, settings) {
    /**
     * modify Facbook Oauth (fboauth) button with class "facebook-action-connect"
     * to open in a popup window, instead of using the current window.
     * References:
     * http://thinkdiff.net/facebook/create-facebook-popup-authentication-window-using-php-and-javascript/
     * http://developers.facebook.com/docs/authentication/
     * http://developers.facebook.com/docs/authentication/server-side/
     * http://developers.facebook.com/docs/reference/dialogs/oauth/
     */
    $('.twitter-signin-popup').click(function() {
      var screenX    = typeof window.screenX != 'undefined' ? window.screenX : window.screenLeft,
        screenY      = typeof window.screenY != 'undefined' ? window.screenY : window.screenTop,
        outerWidth   = typeof window.outerWidth != 'undefined' ? window.outerWidth : document.body.clientWidth,
        outerHeight  = typeof window.outerHeight != 'undefined' ? window.outerHeight : (document.body.clientHeight - 22),
        width    = 500,
        height   = 270,
        left     = parseInt(screenX + ((outerWidth - width) / 2), 10),
        top      = parseInt(screenY + ((outerHeight - height) / 2.5), 10),
        features = 'width=' + width + ',height=' + height + ',left=' + left + ',top=' + top;

      var popupTwitterWindow = window.open($(this).attr("href"), 'fboauth', features);
      if (window.focus) {
        popupTwitterWindow.focus();
      }
  
      //popupTwitterWindow.unload = function() {looplayer.getUser();};

      return false;
    });
  }
};

})(jQuery);