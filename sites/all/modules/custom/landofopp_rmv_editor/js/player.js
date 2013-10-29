/**
* @file
* simple preview video
*/

var RMVplayer = (function ($) {
  var videoID, video, videoPaused = false, videoDuration, button;
  
  //add controls button to player
  function addControls(){
    var controls = '<div id="preview-box-controls">\
      <div id="preview-box-pauseplay"><a class="icon-play" href=""></a></div>\
      <div id="preview-timeline-wrap">\
        <div id="preview-timeline-wrap-inner">\
          <div id="preview-vidbox-progress"></div>\
        </div>\
      </div>\
    </div>';
    
    
    var addTriggerButton = '<a href="" class="add-trigger button">Add Trigger at this point</a>';
    $('#'+videoID).after(controls);
    $('#'+videoID).parents('div.preview_video').parent().append(addTriggerButton);
    
    button = $('#'+videoID).parents('div.preview_video').parent().find('a.add-trigger');
    button.hide();
  }
  
  // init event for video
  function handleCanplay(){
    
    videoDuration = video.duration();
    
    video.on( 'timeupdate', handleTimeupdate);
    
    video.on( 'pause', handlePauseOn);
    
    video.on( 'play', handlePlayOn);
    
    
    $('#edit-current-time').val('0:00:00');
    
    handlePlay();
    
    
    //click pauseplay
    $('#preview-box-pauseplay a').on('click',function(){
      handlePlay();
      return false;
    });
    
    
    // click on progress bar
    $('#preview-timeline-wrap-inner').click(function(e){

      var width = $(this).width();
      
      
      var x = e.pageX - $(this).offset().left;

      var time = parseFloat((x / width) * videoDuration).toFixed(2);
      
      video.currentTime(time);
      return false;
      
    });
    
    
    // click on button
    button.on('click',function(){
      addNewTrigger();
      return false;
    });
  }
  
  // event for timeupdate video
  function handleTimeupdate(e) {
    var progress = video.currentTime();
    var time = video.roundTime();
    var val = secondsToHms(time);
    
    var position =  parseFloat((progress / videoDuration ) * 100).toFixed(0);
      
    $('#preview-vidbox-progress').css({width:position+'%'});
    $('#edit-current-time').val(val);
  }
  
  function handlePlay(){
    if(videoPaused) {
      video.play();
      $('#preview-box-pauseplay a').removeClass('icon-play').addClass('icon-pause');
      videoPaused = false;
    } else {
      video.pause();
      $('#preview-box-pauseplay a').removeClass('icon-pause').addClass('icon-play');
      videoPaused = true;
      
    }
  }
  
  // event for play video
  function handlePlayOn(){
    $('#preview-box-pauseplay a').removeClass('icon-play').addClass('icon-pause');
    videoPaused = false;
    button.hide();
  }
  // event for play video
  function handlePauseOn(){
    $('#preview-box-pauseplay a').removeClass('icon-pause').addClass('icon-play');
    videoPaused = true;
    button.show();
    
  }
  
  // function return time string in seconds
  function secondsToHms(d) {
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);
    
    var time = ((h > 0 ? h + ":" : "0:") + (m > 0 ? (h > 0 && m < 10 ? "0" : "0") + m + ":" : "00:") + (s < 10 ? "0" : "") + s);

    return time;
  }


  // add new trigger when video is paused
  function addNewTrigger(){
    var time = video.roundTime();
    
    
    var addMore = $('#edit-field-trigger .field-add-more-submit');
    var textField = $('#edit-new-time');
    if ($('#edit-field-trigger').hasClass('hidden')) {
      var val = secondsToHms(time);
      $('#edit-field-trigger').find('#edit-field-trigger-und-0-field-time-und-0-value').val(val);
      $('#edit-field-trigger').slideUp(500,function(){
        $(this).removeClass('hidden');
        scrollToElement('#edit-field-trigger',500);
      });
      
    } else {
      scrollToElement(addMore,500);
      setTimeout(function(){ 
        textField.val(time);
        addMore.trigger('mousedown');
        setTimeout(function(){textField.val('');},1000);
      },500);
    }
    
    
    
  }
  
  // scroll to new section of trigger
  function scrollToElement(selector, speed, verticalOffset) {
    time = typeof(time) != 'undefined' ? time : 1000;
    verticalOffset = typeof(verticalOffset) != 'undefined' ? verticalOffset : 0;
    element = $(selector);
    offset = element.offset();
    offsetTop = offset.top + verticalOffset;
    $('html, body').animate({
      scrollTop: offsetTop
    }, speed);
}
  
  return {
    // init player
    init : function(conf){
      
      videoID = conf.videoId;
      
      if ($('#'+videoID).hasClass('youtube')) {
        url = $('#'+videoID).attr('data-url')+'&controls=0&rel=0&showinfo=0';
        video = Popcorn.youtube( '#'+videoID,url);
        video.play();
      } else if ($('#'+videoID).hasClass('vimeo')) {
        url = $('#'+videoID).attr('data-url');
        video = Popcorn.vimeo( '#'+videoID,url);
      } else {
        video = Popcorn( '#'+videoID);
      }
      
      addControls();
      
      if (video.duration()) {
        handleCanplay();
      } else {
        video.on('loadedmetadata', function() {
          handleCanplay();
        });
      }
      
    },
    // destroy player
    destroy : function(){
      video.destroy();
      videoID = videoDuration = null;
      videoPaused = false;
    }
  }
})(jQuery);
