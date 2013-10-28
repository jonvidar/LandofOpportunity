/**
 * @file
 * This file handles the JS for edit Rich Media Video.
 */

(function ($) {
  Drupal.behaviors.looAdmin = {
    attach: function(context, settings) {
      $('#edit-options .form-item-promote input[type*="checkbox"]')
        .each(function() {
          if ($(this).is(':checked')) {
            $('#edit-field-category').show();
			$('#edit-field-embed-code').show();
          }
		  else{
		  	$('#edit-field-category').hide();
			$('#edit-field-embed-code').hide();
		  }
        })
        .unbind('change')
        .on('change', function(e) {
          $('#edit-field-category').slideToggle(250);
		  $('#edit-field-embed-code').slideToggle(250);
      });
    }
  };
})(jQuery);