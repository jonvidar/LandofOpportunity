
/*
 *  @file
 *  This file handles the JS for Media Module functions.
 */

(function ($) {
/**
 * Loads media browsers and callbacks, specifically for media as a field.
 */
Drupal.behaviors.mediaElement = {
  attach: function (context, settings) {
    // Options set from media.fields.inc for the types, etc to show in the browser.
    // For each widget (in case of multi-entry)
  
    $('.media-widget', context).once('mediaBrowserLaunch', function () {
      var options = settings.media.elements[this.id];
      globalOptions = {};
      if (options.global != undefined) {
        var globalOptions = options.global;
      }
    var widget = this;
      //options = Drupal.settings.media.fields[this.id];
      var fidField = $('.fid', this);
      var previewField = $('.preview', this);
      var editButton = $('.edit', this);
      var removeButton = $('.remove', this);
    var mediaWidget = $(this);
    var previewVideo = $('.preview_video', this);
    var videoID;
    
    if (previewVideo.get(0)) {
      videoID = previewVideo.attr('data-id');
    if (videoID !=0) RMVplayer.init({ videoId : 'preview-video-'+ videoID});
    previewField.html('');
    }
    
      // Hide the edit and remove buttons if there is no file data yet.
      if (fidField.val() == 0) {
        if (editButton.length) {
          editButton.hide();
        }
        removeButton.hide();
      }

      // When someone clicks the link to pick media (or clicks on an existing thumbnail)
      $('.launcher', this).bind('click', function (e) {
        // Launch the browser, providing the following callback function
        // @TODO: This should not be an anomyous function.
        Drupal.media.popups.mediaBrowser(function (mediaFiles) {
          if (mediaFiles.length < 0) {
          var checkbox = mediaWidget.find('input.form-checkbox');
          if (checkbox.get(0)) {
            var fieldset = mediaWidget.parents('fieldset');
            fieldset.find('input.form-text:first').attr('readonly', false);
            fieldset.find('textarea:first').attr('readonly', false);
            fieldset.find('input.form-text:eq(2)').attr('readonly', false);
           }
            return;
          }
          var mediaFile = mediaFiles[0];
      // Set the value of the filefield fid (hidden) and trigger a change.
      fidField.val(mediaFile.fid);
      fidField.trigger('change');
      // Set the preview field HTML.
      previewField.html(mediaFile.preview);
      if (previewVideo.get(0)) {
          
        previewField.html('');
         $.ajax({
          type: 'get',
          url: Drupal.settings.basePath+'rmv/video/'+mediaFile.fid+'/json',
          data : 'is_ajax=1',
          success: function(msg){
            previewVideo.html('');
            $('.add-trigger', widget).remove();
            previewVideo.append(msg);
            previewVideo.attr('data-fid',mediaFile.fid);
            videoID = mediaFile.fid;
            RMVplayer.init({ videoId : 'preview-video-'+ videoID});
          }
        });
          
      }
      
      
      // added checkbox
      var checkbox = mediaWidget.find('input.form-checkbox');
      if (checkbox.get(0)) {
       $.ajax({
        type: 'get',
        url: Drupal.settings.basePath+'rmv/'+mediaFile.fid+'/json',
        dataType:"json",
        cache:"false",
        success: function(data){
          if (data.nid == 0) {
            checkbox.parent().show();
            var fieldset = mediaWidget.parents('fieldset');
            fieldset.find('input.form-text:first').attr('readonly', false);
            fieldset.find('textarea:first').attr('readonly', false);
            fieldset.find('input.form-text:eq(2)').attr('readonly', false);
            
            
          } else {
            var fieldset = mediaWidget.parents('fieldset');
            var titleText = fieldset.find('input.form-text:first');
            var whatText = fieldset.find('textarea:first');
            var tagsText = fieldset.find('input.form-text:eq(2)');
            
            //add title
            if(typeof data.title != 'undefined' && data.title != '') {
              titleText.val(data.title).attr('readonly', true);
            }
            //add what
            if(typeof data.what != 'undefined' && data.what != '') {
              whatText.val(data.what).attr('readonly', true);
            }
            //add what
            if(typeof data.tags != 'undefined' && data.tags != '') {
              tagsText.val(data.tags).attr('readonly', true);
            }
            checkbox.parent().hide();
          }
          
        }
      });
      }
      
      
        }, globalOptions);
        e.preventDefault();
      });

      // When someone clicks the Remove button.
      $('.remove', this).bind('click', function (e) {
        // Set the value of the filefield fid (hidden) and trigger change.
        fidField.val(0);
        fidField.trigger('change');
        // Set the preview field HTML.
        previewField.html('');
    if (previewVideo.get(0)) {
      RMVplayer.destroy();
      previewVideo.html('');
    }
    
    
        var checkbox = mediaWidget.find('input.form-checkbox');
        if (checkbox.get(0)) {
          var fieldset = mediaWidget.parents('fieldset');
          fieldset.find('input.form-text:first').attr('readonly', false);
          fieldset.find('textarea:first').attr('readonly', false);
          fieldset.find('input.form-text:eq(2)').attr('readonly', false);
         }
        e.preventDefault();
      });

      // Show or hide the edit/remove buttons if the field has a file or not.
      $('.fid', this).bind('change', function() {
        if (fidField.val() == 0) {
          if (editButton.length) {
            editButton.hide();
          }
          removeButton.hide();
        }
        else {
          if (editButton.length) {
            editButton.attr('href', editButton.attr('href').replace(/media\/\d+\/edit/, 'media/' + fidField.val() + '/edit'));
            // Re-process the edit link through CTools modal behaviors.
            editButton.unbind('click');
            editButton.removeClass('ctools-use-modal-processed');
            // @todo Maybe add support for Drupal.detachBehaviors in Drupal.behaviors.ZZCToolsModal?
            Drupal.attachBehaviors(editButton.parent(), Drupal.settings);
            editButton.show();
          }
          removeButton.show();
        }
      });
    
    
    });
  }
};

})(jQuery);
