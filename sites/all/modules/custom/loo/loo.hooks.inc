<?php 

/**
 * @file
 * LandofOpportunity hooks functions.
 */

/**
* Implements hook_node_prepare().
*/
function loo_node_prepare($node) {
  $css = drupal_get_path('module', 'loo') . '/css/admin.css';
  $js = drupal_get_path('module', 'loo') . '/js/admin.js';
  drupal_add_css($css);
  drupal_add_js($js);
}


/**
 * Implements hook_form_FORM_ID_alter().
 * Comment form
 */
function loo_form_comment_form_alter(&$form, &$form_state, $form_id) {

  $form['actions']['submit']['#value'] = t('Submit');
  
  $form['#submit'][] = 'loo_comment_form_submit';
  $form['comment_body']['und'][0]['#base_type'] = 'textfield';
  $form['comment_body']['und'][0]['#title'] = t('Add a comment...');
  
  if (!empty($form['comment_body']['und'][0]['value'])) {
    $form['comment_body']['und'][0]['value']['#title'] = t('Add a comment...');
    $form['comment_body']['und'][0]['value']['#type'] = 'textfield';
  }
  
  // HACK, stop ctools from modifying us in node_comment_form.inc
  $form_state['ctools comment alter'] = FALSE;
}

/**
* return json output from new comment and all comments from node
* function comment submit
* @param $form
* @param $form_state
* 
*/
function loo_comment_form_submit($form, &$form_state) {
  $message = t('Your comment has been submitted and is awaiting moderation');
  $item = $form_state['comment'];
  if (!empty($_POST['is_ajax'])) {
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
    
    $comment = array(
      'cid' => $item->cid,
      'seconds' => $seconds,
      'time' => $time,
      'body' => $body,
      'author' => $item->name,
    );
    
    $nid = $item->nid;
    $node = node_load($nid);
    $comments = loo_get_comment_from_richmedia($node);
    
    $results['comment'] = $comment;
    $results['comments'] = $comments;
    
    print drupal_json_output($results);
    die();
  }
  
}
/**
 * Implements hook_form_alter().
 */
function loo_form_alter(&$form, &$form_state, $form_id) {
  if ($form_id === 'user_register_form') {
    // hide autoassignrole_user
    $form['autoassignrole_user']['#access'] = FALSE;
    if (arg(0) == 'user') {
      $form['field_user_partner']['#access'] = FALSE;
    }
    $form['actions']['submit']['#suffix'] = '<p>Already have an account? ' . l(t('Login'), 'user') . '</p>';
  }
  if ($form_id === 'user_login') {
    $form['#action'] = $form['#action'] . '?destination=admin/content';
    $form['actions']['submit']['#suffix'] = '<p>Don’t have an account? ' . l(t('Create one now'), 'user/register') . '</p>';
    $form['name']['#description'] = 'Don’t have a username? ' . l(t('Create a new account'), 'user/register');
    $form['pass']['#description'] = l(t('Forgot your password?'), 'user/password');
  }
}

function ajax_feedback_submit_callback($form, &$form_state) {
  $element = $form['message_box'];
  return $element;
}
/**
* Implements hook_form_FORM_ID_alter().
* Form add/edit for category node
* 
*/
function loo_form_category_node_form_alter(&$form, &$form_state, $form_id) {
  unset($form['options']['sticky']);
}
/**
* Implements hook_form_FORM_ID_alter().
* Form add/edit for  event node
* 
*/
function loo_form_event_node_form_alter(&$form, &$form_state, $form_id) {
  unset($form['options']['sticky']);
  drupal_add_library('system', 'ui.slider');
  $js = drupal_get_path('module', 'loo') . '/js/timeline.js';
  drupal_add_js($js);
  $timeline_headers = '';
  // vocabulary ID 
  $vid = 3;
  $terms = taxonomy_get_tree($vid);
  foreach ( $terms as $term ) {
    $timeline_headers .= '<div class="sector"><h3>' . $term->name . '</h3></div>';
  }
  $form['#prefix'] = '<div class="headers">' . $timeline_headers . '</div>';

  //hide preview button
  $form['actions']['preview']['#access'] = FALSE;
}

/*
** Implements hook mail().
*/
function loo_mail($key, &$message, $params) {
  $options = array(
  'langcode' => $message['language']->language,
  );

  switch ($key) {
    case 'send_mail':
      $message['subject'] = variable_get('loo_mail_subject', '');
      $body = variable_get('loo_mail_body', '');
      $message['body'][] = t($body, $params, $options);
    break;
  }
}
/*
* 
* Implements hook_entity_info_alter().
* add new view mode "featured" and "timeline"
* 
*/
function loo_entity_info_alter(&$entity_info) {

  $entity_info['node']['view modes']['featured'] = array(
    'label' => t('Featured'),
    'custom settings' => 1
  );

  $entity_info['node']['view modes']['timeline'] = array(
    'label' => t('Timeline'),
    'custom settings' => 1
  );
  
}