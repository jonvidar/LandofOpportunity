/**
 *  @file
 *  This file handles the JS for edit Timeline.
 */

(function ($) {
  Drupal.behaviors.looAdmin = {
    attach: function(context, settings) {
      if(!$('#edit-field-event-position div.form-item div.slider-wrapper').get(0)){
        $('#edit-field-event-position div.form-item').prepend('<div class="slider-wrapper"><div class="slider"></div></div>');
        $('#edit-field-event-position div.form-item div.slider').slider({
          change: function( event, ui ) {
            $('#edit-field-event-position div.form-item input.form-text').val(ui.value);
          }
        });
        var default_value = $('#edit-field-event-position div.form-item input.form-text').val();
        $('#edit-field-event-position div.form-item div.slider').slider( "value", default_value);
        $('#edit-field-event-position div.form-item input.form-text').change(function() {
          var value = $(this).val();
          $('#edit-field-event-position div.form-item div.slider').slider( "value", value );
        });
        $('#content div.headers').prependTo('#edit-field-event-position div.form-item div.slider-wrapper');
        var sectors_count = $('#content div.headers div.sector').size();
        var sectors_width = parseInt(100/sectors_count)+'%';
        $('#content div.headers div.sector').width(sectors_width);
      }
    }
  };
})(jQuery);