<?php 
/**
 * @file
 * LandofOpportunity implement search and email form.
 */
/*
** search form
*/
function loo_search_form($form, &$form_state) {
  
  $form['keywords'] = array(
    '#type' => 'textfield',
    '#autocomplete_path' => 'tags/autocomplete',
    '#maxlength' => 255,
  );
  
  $form['submit'] = array(
    '#type' => 'submit',
    '#value' => 'Search',
  );
  return $form;
}
/**
* return json output to search field from tags
* 
*/
function _tags_autocomplete($string) {
  $matches = array();
  $result = db_select('taxonomy_term_data', 't')
    ->fields('t', array('name'))
    ->condition('name', '%' . db_like($string) . '%', 'LIKE')
    ->execute();

  // save the query to matches
  foreach ($result as $row) {
    $keyword = check_plain(drupal_strtolower($row->name));
    $pos = strpos($keyword, $string);
    if ($pos == 0) $matches[$row->name] = $keyword;
  }

  // Return the result to the form in json
  drupal_json_output($matches);
}

/*
** send email to friend 
*/
function landofopp_send_email($form, &$form_state, $nid) {
  
  $form['email'] = array(
    '#title' => t('Enter email'),
    '#type' => 'textfield',
    '#attributes' => array('placeholder' => t('Enter email')),
  );
  $form['message_box'] = array(
    '#prefix' => '<div class="message-box">',
    '#markup' => '<div></div>',
    '#suffix' => '</div>',
  );
  $form['nid'] = array(
    '#type' => 'hidden',
    '#value' => $nid,
  );
  
  $form['submit'] = array(
    '#type' => 'submit',
    '#value' => 'Submit',
  );
  return $form;
}

/*
** send email to friend validate
*/
function landofopp_send_email_validate($form, &$form_state) {
  $values = $form_state['values'];
  if (empty($values['email'])) {
    form_set_error('email', t('Please enter email address'));
  } 
  elseif (!valid_email_address($values['email'])) {
    form_set_error('email', t('Please enter valid email address'));
  }
}
/*
** send email to friend submit
*/
function landofopp_send_email_submit($form, &$form_state) {
  $form_values = $form_state['values'];

  // Specify 'to' and 'from' addresses.
  $to = $form_values['email'];
  $from = variable_get('site_mail', 'admin@example.com');

  $params = $form_values;
  $node = node_load($form_values['nid']);
  $params['@title'] = $node->title;
  
  global $base_path;
  $node_url = url('node/' . $node->nid);
  $data_url = $node_url;
  $pos = strpos($data_url, $base_path);
  if ($pos !== FALSE) {
    $data_url = substr_replace($data_url, '' , $pos, strlen($base_path));
  }
  
  $node_url = url('<front>', array('absolute' => TRUE, 'fragment' => '/' . $data_url, 'query' => array('video' => $node->nid)));
  
  $params['@url'] = $node_url;
  
  $language = language_default();
  $send = TRUE;
  
  $result = drupal_mail('landofopp', 'send_mail', $to, $language, $params, $from, $send);
  
  if ($result['result'] == TRUE) {
    drupal_set_message(t('The email has been sent successfully'));
  }
  else {
    drupal_set_message(t('There was a problem sending your email and it was not sent.'), 'error');
  }
  
  if (!empty($_POST['is_ajax'])) {
    $messages = theme('status_messages');
    print $messages;
    die();
  }
}