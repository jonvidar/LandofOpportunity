
/**
*  @file
*  This file handles the JS for edit Rich Media Video.
*/

(function ($) {

Drupal.behaviors.nodeRMV = {
  attach: function (context, settings) {
    // click button preview
  $('#edit-preview, #edit-preview-1',context).on('click',function(){
    var data = $('#rich-media-node-form',context).serialize();
    var nav = '<div class="nav"><p>You are currently in preview mode.</p> <a class="button" href="">Continue Editing</a></div>';
    $.ajax({
      type: 'post',
      url: Drupal.settings.basePath+'rmv/preview-video',
      data : data+'&player_show=1',
      success: function(msg){
        if (!$('#preview-video').get(0)) $('body').append('<div id="preview-video" />');
        $('#preview-video').html(msg).show();
        $('#preview-video').append(nav);
        var ID = $('#preview-video .video-preview div.video-id').attr('data-id');
        looplayer.init({
          videoId : ID
        });
        $('#preview-video').find('div.nav a').click(function(){
          $('#preview-video').fadeOut(500,function(){
            looplayer.destroy();
            $('#preview-video').html();
          });
          return false;
        });
      }
    });
    
    return false;
  });
  
  // generate iframe code
  var $iframe = $('#edit-code',context);
  var $width = $('#edit-width',context);
  var $height = $('#edit-height',context);
  var $update_button = $('#edit-update-code',context);
  var nid = $('#node-nid',context).val();
  
  $width.on('change',function(){
    var width = parseInt($(this).val());
    var height = parseInt(width*3/4);
    $height.val(height);
    
  });
  
  $height.on('change',function(){
    var height = parseInt($(this).val());
    var width = parseInt(height*4/3);
    $width.val(width);
  });
  
  $update_button.on('click',function(){
    var width = parseInt($width.val());
    var height = parseInt($height.val());
    $.ajax({
      type: 'get',
      url: Drupal.settings.basePath+'node/'+nid+'/iframe/'+width+'/'+height,
      data : '&is_ajax=1',
      success: function(msg){
        $iframe.val(msg);
      }
    });
    return false;
  });
  

  }
};

})(jQuery);