<?php


/**
 * @file
 * Page callbacks for preview video, add file, webform submissions and etc.
 */
 
 /*
 * Preview video in admin section
 */
function rmv_preview_video() {
  $build = array();
  
  $node = (object)$_POST;
  $markers = rmv_preview_video_get_markers($node);
  
  $output = theme('rmv_preview', array('node' => $node, 'markers' => $markers));
  $build['content']['#markup'] = $output;
  return $build;
}
/*
* 
* Return array of markers.
* 
*/
function rmv_preview_video_get_markers($node) {
  $triggers = array();
  if (!empty($node->field_trigger['und'])) {
    $id = 0;
    foreach ($node->field_trigger['und'] as $trigger) {
      
      $id++;
      $preview = $video = $audio = $image = $pdf = $url =  $tags_str = $tags = '';
      // get time for trigger
      $time = @$trigger['field_time']['und'][0]['value'];
      if (empty($time))  continue;
      $seconds = _hms_formatted_to_seconds($time, 'h:mm:ss');
      if ($seconds < 3600) {
        $time = _hms_seconds_to_formatted($seconds, 'm:ss');
      }
      
      $title = @$trigger['field_trigger_title']['und'][0]['value'];
      $title = check_plain($title);
      $title = str_replace('&quot;', '"', $title);
      
      $what = @$trigger['field_what']['und'][0]['value'];
      $what = check_plain($what);
      $what = str_replace('&quot;', '"', $what);
      
      $why = @$trigger['field_why']['und'][0]['value'];
      $why = check_plain($why);
      $why = str_replace('&quot;', '"', $why);
      
      
      $type = 'info';
      
      if (!empty($trigger['field_tags']['und'])) {
        $tags_str = @$trigger['field_tags']['und'];
        $tags_str = check_plain($tags_str);
      }
      
      
      if ($tags_str) {
        $tags = explode(', ', $tags_str);
      }
      
      $fid_media = @$trigger['field_media_type']['und'][0]['fid'];
      $fid_preview = @$trigger['field_trigger_image']['und'][0]['fid'];
      $url = @$trigger['field_url']['und'][0]['url'];
      
      // create media content for trigger
      if ($fid_media) {
        $file_media = file_load($fid_media);
        if (!empty($file_media) && $file_media->type == 'video') {
          $nid_rmv = loo_get_related_rmv($file_media->fid);
          if ($nid_rmv) $video = url('node/' . $nid_rmv);
            else $video = url('file/' . $file_media->fid);
        } 
        if (!empty($file_media) && $file_media->filemime == 'application/pdf') {
          $pdf = file_create_url($file_media->uri);
        }
        
        if (!empty($file_media) && $file_media->type == 'image') {
          $image = file_create_url($file_media->uri);
          $preview = image_style_url('preview-image', $file_media->uri);
        }
      }
      // create preview image
      if ($fid_preview) {
        $file_preview = file_load($fid_preview);
        $preview = image_style_url('preview-image', $file_preview->uri);
      } 
      else {
        if (!empty($file_media) && $file_media->type == 'video') {
          $wrapper = file_stream_wrapper_get_instance_by_uri($file_media->uri);
          $thumbnail = $wrapper->getLocalThumbnailPath();
          $preview = image_style_url('preview-image', $thumbnail);
        }
      }
      
      // if empty preview image, set default preview image
      if (empty($preview)) {
        if (!empty($video)) {
          $preview = file_create_url(file_default_scheme() . '://default-image/default-image-video.png');
        }
        if (!empty($image)) {
          $preview = file_create_url(file_default_scheme() . '://default-image/default-image-photo.png');
        }
        if (!empty($audio)) {
          $preview = file_create_url(file_default_scheme() . '://default-image/default-image-audio.png');
        }
        if (!empty($url)) {
          $preview = file_create_url(file_default_scheme() . '://default-image/default-image-url.png');
        }
        if (!empty($pdf)) {
          $preview = file_create_url(file_default_scheme() . '://default-image/default-image-pdf.png');
        }
      }
      
      
      $triggers[] = array(
        'seconds' => $seconds,
        'nid' => $id,
        'time' => $time,
        'type' => $type,
        'title' => $title,
        'what' => $what,
        'why' => $why,
        'tags' => $tags,
        'preview' => $preview,
        'video' => $video,
        'image' => $image,
        'audio' => $audio,
        'url' => $url,
        'pdf' => $pdf,
      );
      
    }
    // sorting triggers by time
    usort($triggers, "trigger_sort_preview");
  }
  return $triggers;
}
/*
* function for sorting triggers
*/
function trigger_sort_preview($a, $b) {
  return $a['seconds'] > $b['seconds'];
}


/**
*  Callback url for webform results
*/
function webform_feedback_results() {
  $url = 'node/58/webform-results';
  drupal_goto($url);
}
/**
*  Callback url for file add
*/
function client_file_add() {
  $url = 'file/add';
  drupal_goto($url);
}