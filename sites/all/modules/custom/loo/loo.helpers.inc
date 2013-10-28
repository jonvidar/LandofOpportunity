<?php
/**
 * @file
 * LandofOpportunity helper functions.
 */
/**
*  function return value from object
*/
function loo_get_field_value($object, $field_name, $value_key = 'value', $lang = 'und') {
  $value = '';
  $object = (array)$object;
  if (!empty($object['language'])) $lang = $object['language'];
  if (isset($object[$field_name]{$lang}[0][$value_key])) {
    $value = $object[$field_name]{$lang}[0][$value_key];
  }
  return $value;
}
/**
* return tags for trigger
*/
function loo_get_tags_from_trigger($trigger) {
  $tags = array();
  if (!empty($trigger->field_tags['und'][0])) {
    foreach ($trigger->field_tags['und'] as $item) {
      $tags[] = check_plain($item['taxonomy_term']->name);
    }
  }
  return $tags;
}

/**
* return markers for RMV node
*/
function loo_get_markers_from_richmedia($node, $key_search = '') {
  $triggers = array();
  if (!empty($node->field_trigger['und'][0])) {
    foreach ($node->field_trigger['und'] as $item) {
      $items = entity_load('field_collection_item', array($item['value']));
      
      $add_trigger = TRUE;
      $trigger = $items[$item['value']];
      $file = array();
      $preview = $video = $video_flickr = $audio = $image = $pdf = $url = '';
      $body = '';
      
      // check plain title
      $title = loo_get_field_value($trigger, 'field_trigger_title');
      $title = check_plain($title);
      $title = str_replace('&quot;', '"', $title);
      
      // check plain field what
      $what = loo_get_field_value($trigger, 'field_what', 'value');
      $what = strip_tags($what, '<strong><em><u>');
      $what = check_plain($what);
      $what = str_replace('&amp;nbsp;', ' ', $what);
      $what = str_replace('&quot;', '"', $what);
      
      // check plain field why
      $why =  loo_get_field_value($trigger, 'field_why', 'value');
      $why = strip_tags($why, '<strong><em><u>');
      $why = check_plain($why);
      $why = str_replace('&amp;nbsp;', ' ', $why);
      $why = str_replace('&quot;', '"', $why);
      
      
      $tags = loo_get_tags_from_trigger($trigger);
      
      $id = $trigger->item_id;
      
      // type set info
      $type = 'info';
      
      // prepare time
      $seconds = loo_get_field_value($trigger, 'field_time');
      if (empty($seconds)) continue; 
      if ($seconds < 3600) {
        $time = _hms_seconds_to_formatted($seconds, 'm:ss');
      } 
      else $time = _hms_seconds_to_formatted($seconds, 'h:mm:ss');
      
      if (!empty($trigger->field_media_type)) {
        
        $file = $trigger->field_media_type['und'][0];
        if (!empty($file['file']) && $file['file']->type == 'video') {
          // video file
          $nid_rmv = loo_get_related_rmv($file['fid']);
          // if video file related to another RMV return url for node
          if ($nid_rmv) {
            $video = url('node/' . $nid_rmv);
          } 
          else {
            if ($file['file']->filemime == 'video/flickr') {
              // flick url
              $video_flickr = url('file/' . $file['fid'], array('query' => array('is_ajax' => 1)));
            } 
            else $video = url('file/' . $file['fid']);
          }
        } 
        elseif (!empty($file['file']) && $file['file']->filemime == 'application/pdf') {
          // pdf file
          $pdf = file_create_url($file['file']->uri);
        } 
        elseif (!empty($file['file']) && $file['file']->type == 'image') {
          // pdf image
          $image = file_create_url($file['file']->uri);
          if (strpos('flickr', $file['file']->uri) !== FALSE) {
            $preview = image_style_url('preview-image', $file['file']->uri);
          } 
          else {
            $preview = $image;
          }
        } 
        elseif (!empty($file['file']) && $file['file']->type == 'audio') {
          $audio = url('file/' . $file['fid'], array('query' => array('is_ajax' => 1)));
        }
      }
      
    
      // set preview image
      if (!empty($trigger->field_trigger_image)) {
        $image_file = $trigger->field_trigger_image['und'][0];
        $preview = file_create_url($image_file['uri']);
      } 
      else {
        if (!empty($file['file']) && $file['file']->type == 'video') {
          $wrapper = file_stream_wrapper_get_instance_by_uri($file['file']->uri);
          $thumbnail = $wrapper->getLocalThumbnailPath();
          $preview = image_style_url('preview-image', $thumbnail);
        }
      }
      // set url for iframe
      if (!empty($trigger->field_url)) {
        $url = $trigger->field_url['und'][0]['url'];
      }
      
      // set default preview image, if empty preview image
      if (empty($preview)) {
        if (!empty($video)) {
          $preview = file_create_url(file_default_scheme() . '://default-image/default-image-video.png');
        }
        if (!empty($image) || !empty($video_flickr)) {
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
      
      // check add trigger to search result
      if ($key_search) {
        $search_fields = array();
        $search_fields[] = $title;
        $search_fields[] = $what;
        $search_fields[] = $why;
        if ($tags) {
          foreach ($tags as $tag) {
            $search_fields[] = $tag;
          }
        }
        $search_body = implode(' ', $search_fields);
        $search_body = strtolower($search_body);
        
        if (strpos($search_body, $key_search) === FALSE) {
          $add_trigger = FALSE;
        } 
      }
      // hide why field and tags for iframe 
      if (!empty($_GET['iframe_mode'])) {
        $why = $tags = '';
      }
      
      if ($add_trigger) {
        
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
          'flickr' => $video_flickr,
          'image' => $image,
          'audio' => $audio,
          'url' => $url,
          'pdf' => $pdf,
        );
      }
      
    }
    
    
    usort($triggers, "trigger_sort");
    
    
  }
  
  return $triggers;
}

/**
* sorting triggers
* 
*/
function trigger_sort($a, $b) {
  return $a['seconds'] > $b['seconds'];
}

/**
* get comment from node
* 
*/
function loo_get_comment_from_richmedia($node) {
  $comments = array();
  $query = db_select('comment', 'c')->extend('PagerDefault');
  $query->addField('c', 'cid');
  $query
    ->condition('c.nid', $node->nid)
    ->addTag('node_access')
    ->addTag('comment_filter')
    ->addMetaData('node', $node)
    ->condition('c.status', COMMENT_PUBLISHED)
    ->orderBy('c.cid', 'ASC');
  $cids = $query->execute()->fetchCol();
  
  if (!empty($cids)) {
    $items = comment_load_multiple($cids);
    //comment_prepare_thread($items);
    foreach ($items as $item) {
      $seconds = loo_get_field_value($item, 'field_time');
      
      $body = loo_get_field_value($item, 'comment_body', 'value');
      $body = strip_tags($body, '<strong><em><u>');
      $body = check_plain($body);
      $body = str_replace('&amp;nbsp;', ' ', $body);
      $body = str_replace('&quot;', '"', $body);
  
      if ($seconds < 3600) {
        $time = _hms_seconds_to_formatted($seconds, 'm:ss');
      } 
      else $time = _hms_seconds_to_formatted($seconds, 'h:mm:ss');
      
      $comments[$seconds][] = array(
        'cid' => $item->cid,
        'time' => $time,
        'body' => $body,
        'author' => $item->name,
      );
    }
    ksort($comments);
    $comments = array_values($comments);
  }
  
  return $comments;
}
/**
* get NODE_ID from related video file
*/
function loo_get_related_rmv($fid) {
  $nid = db_query("SELECT entity_id FROM {field_data_field_video} WHERE field_video_fid = :fid", array(':fid' => $fid))->fetchField();
  return $nid;
}
/**
* get related videos
*/
function loo_get_related_videos($nid = NULL) {
  if (empty($nid)) return 0;
  $types = array('rich_media');
  $select = db_select('node', 'n');
  $select->leftJoin('field_data_field_category', 'c', 'c.entity_id = n.nid');
  $select->fields('n', array('nid', 'sticky', 'created', 'promote'));
  $select->condition('n.status', 1);
  $select->condition('n.promote', 1);
  $select->condition('c.field_category_target_id', $nid);
  $select->condition('n.type', $types, 'IN');
  $select->orderBy('n.created', 'DESC');
  $select->addTag('node_access');
  $nids = $select->execute()->fetchCol();
  return $nids ? $nids : array();
}
/**
* get random featured category
*/
function loo_get_featured_categories() {
  $types = array('category');
  $select = db_select('node', 'n');
  $select->fields('n', array('nid'));
  $select->condition('n.status', 1);
  $select->condition('n.promote', 0);
  $select->condition('n.type', $types, 'IN');
  $select->addTag('node_access');
  $nids = $select->execute()->fetchCol();
  return $nids ? $nids : array();  
}
/**
* get all events for timeline
*/
function loo_get_events() {
  $types = array('event');
  $select = db_select('node', 'n');
  $select->fields('n', array('nid'));
  $select->condition('n.status', 1);
  $select->condition('n.type', $types, 'IN');
  $select->addTag('node_access');
  $nids = $select->execute()->fetchCol();
  return $nids ? $nids : array();  
}
/**
* get original image from image_crop module
*/
function loo_get_original_image($node) {
  $image = array(); 
  if (empty($node->field_video_image)) return $image;
  if (isset($node->field_video_image['und'][0]['cropbox_height'])) {
    $fid = db_query("SELECT fid FROM {file_usage} WHERE module = 'imagefield_crop' AND id = :id", array(':id' => $node->field_video_image['und'][0]['fid']))->fetchField();
    if ($fid) {
      $image = (array)file_load($fid);
    } 
    else {
      $image = $node->field_video_image['und'][0];
    }
  } 
  else {
    $image = $node->field_video_image['und'][0];
  }
  return $image;
}
/**
* check if search_text find in body, tags and title RMV node
*/
function loo_represented_search_key($node) {
  $result = FALSE;
  $search_body = '';
  $search_text = arg(2);
  $search_text = strtolower($search_text);
  $search_fields[]= strtolower($node->title);
  
  if (!empty($node->body['und'])) {
    $search_fields[] =  strtolower(strip_tags($node->body['und'][0]['value']));
  }
  
  
  if  (!empty($node->field_tags['und'])) {
    foreach ($node->field_tags['und'] as $item) {
      $search_fields[] = strtolower($item['taxonomy_term']->name);
    }
  }
  
  $search_body = implode(' ', $search_fields);
  
  if (strpos($search_body, $search_text) !== FALSE) {
    $result = TRUE;
  }
  
  return $result;
  
}