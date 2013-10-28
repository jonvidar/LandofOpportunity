<?php
/**
* 
* @file 
*  LandofOpportunity theme implementation template php.
*/
/*
 This program is free software; you can redistribute it and/or modify it under 
 the terms of the GNU General Public License version 2 as published by the Free 
 Software Foundation.

 This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; 
 without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. 
 See the GNU General Public License for more details.

 You should have received a copy of the GNU General Public License along with this program; 
 if not, write to the Free Software Foundation, Inc., 
 59 Temple Place, Suite 330, 
 Boston, MA 02111-1307 USA

 Copyright 2013 Jolu Productions

 Developed by Uncharted Digital
 */

/**
 * Implementation of preprocess_html().
 */
function lando_preprocess_html(&$variables) {
  //print content for ajax request
  if (!empty($_REQUEST['player_show'])) {
    unset($variables['page']['content']['system_main']['#theme_wrappers']);
    print render($variables['page']['content']['system_main']);
    die();
  }
  if (!empty($_REQUEST['is_ajax'])) {
    if (!empty($variables['page']['content']['system_main']['file'])) {
      unset($variables['page']['content']['system_main']['#theme_wrappers']);
      print render($variables['page']['content']['system_main']);
    } 
    else {
      print render($variables['page']['content']);
    }
    die();
  }
  // add meta tegs for facebook and twitter
  if (!empty($_GET['video'])) {
    $node = node_load($_GET['video']);
    $title = $node->title . ' | ' . variable_get('site_name');
    $description = loo_get_field_value($node, 'body', 'value');
    $description = strip_tags($description);
    $description = check_plain($description);
    $image = loo_get_original_image($node);
    if ($image) $imgpath = image_style_url('medium', $image['uri']);
    else $imgpath = '';
    $og_image = $twitter_image = '';
    //facebook
    $og_title = array(
      '#tag' => 'meta',
      '#attributes' => array(
        'property' => 'og:title',
        'content' => $title,
      ),
    );
    $og_description = array(
      '#tag' => 'meta',
      '#attributes' => array(
        'property' => 'og:description',
        'content' => $description,
      ),
    );
    if ($imgpath) {
      $og_image = array(
        '#tag' => 'meta',
        '#attributes' => array(
          'property' => 'og:image',
          'content' => $imgpath,
        ),
      );
      $twitter_image = array(
        '#tag' => 'meta',
        '#attributes' => array(
          'property' => 'twiter:image',
          'content' => $imgpath,
        ),
      );
    }
    drupal_add_html_head($og_title, 'og_title');
    drupal_add_html_head($og_description, 'og_description');
    if ($og_image) {
      drupal_add_html_head($og_image, 'og_image');
    }
    
    //twitter
    $twitter_title  = array(
      '#tag' => 'meta',
      '#attributes' => array(
        'property' => 'twitter:title',
        'content' => $title,
      ),
    );
    $twitter_description  = array(
      '#tag' => 'meta',
      '#attributes' => array(
        'property' => 'twitter:description',
        'content' => $description,
      ),
    );
    
    drupal_add_html_head($twitter_title, 'twitter_title');
    drupal_add_html_head($twitter_description, 'twitter_description');
    if ($twitter_image) {
      drupal_add_html_head($twitter_image, 'twitter_image');
    }
  }
}

/**
 * Implementation of process_page().
 */
function lando_process_page(&$variables) {
  $variables['show_title'] = FALSE;
  if (arg(0)== 'search' && arg(1) == 'video') {
  $variables['tabs']['#access'] = FALSE;
  $variables['page']['content']['system_main']['search_form']['#access'] = FALSE;
  }
  global $user;
  $arg = arg(1);
  if (arg(0) == 'user') {
    $variables['show_title'] = TRUE;
  }
  if (arg(0) == 'user' && $arg == 'register') {
    $variables['title'] = t('Create a New Account');
  }
   if (arg(0) == 'user' && empty($arg) && $user->uid == 0) {
    $variables['title'] = t('Login');
  }
   if (arg(0) == 'user' && $arg == 'password') {
    $variables['title'] = t('Request New Password');
  }
  if (!empty($_REQUEST['send_email'])) {
    $variables['theme_hook_suggestions'][] = 'page__message';
  }
  $nid = arg(1);
  if (arg(0) == 'node' && is_numeric($nid)) {
    $node = node_load($nid);
    if ($node->type == 'rich_media') {
        $variables['theme_hook_suggestions'][] = 'page__video';
        unset($variables['page']['content']['system_main']['#theme_wrappers']);
        unset($variables['page']['content']['#theme_wrappers']);
    }
  }
}

/**
 * Implementation of preprocess_node().
 */
function lando_preprocess_node(&$variables) {
  if ($variables['view_mode'] == 'full' && node_is_page($variables['node'])) {
    $variables['classes_array'][] = 'node-full';
  }
  // form email for RMV
  if ($variables['node']->type == 'rich_media') {
    $form_send = drupal_get_form('loo_send_email', $variables['node']->nid);
    $form = render($form_send);
    $variables['form_email'] = $form;
  }
  
}

/**
 * Implementation of preprocess_block().
 */
function lando_preprocess_block(&$variables) {
  // In the header region visually hide block titles.
  if ($variables['block']->region == 'header') {
    $variables['title_attributes_array']['class'][] = 'element-invisible';
  }
}

/**
 * Implements theme_menu_tree().
 */
function lando_menu_tree($variables) {
  return '<ul class="menu clearfix">' . $variables['tree'] . '</ul>';
}

/**
* get partner from RMV
*/
function lando_get_partner_from_rmv($node) {
  $partner = '';
  $partner_node = new stdClass();
  $author = user_load($node->uid);
  if (!empty($author->field_user_partner['und'])) {
    $partner_nid = $author->field_user_partner['und'][0]['target_id'];
    $partner_node = node_load($partner_nid);
  }
  if (!empty($partner_node)) {
    $image = $link = array();
    if (!empty($partner_node->field_partner_image['und'])) {
      $image =$partner_node->field_partner_image['und'][0];
    }
    if (!empty($partner_node->field_partner_link['und'])) {
      $link =$partner_node->field_partner_link['und'][0];
    }
    if ($link) {
      $partner = '<a target="_blank" href="' . $link['url'] . '">' . $partner_node->title . '</a>';
    }
  }
  
  return $partner;
}

/**
* get next video RMV in category
*/
function lando_get_next_video($node) {
  $output = '';
  if ($node->promote == 0) return $output;
  
  $cat_nid = loo_get_field_value($node, 'field_category', 'target_id');
  
  $select = db_select('node', 'n');
  $select->leftJoin('field_data_field_category', 'c', 'c.entity_id = n.nid');
  $select->fields('n', array('nid'));
  $select->condition('n.status', 1);
  $select->condition('n.promote', 1);
  $select->condition('c.field_category_target_id', $cat_nid);
  $select->condition('n.type', 'rich_media');
  $select->condition('n.created', $node->created, '<');
  $select->orderBy('n.created', 'DESC');
  $select->range(0, 1);
  $next_nid = $select->execute()->fetchfield();
  
  $select2 = db_select('node', 'n');
  $select2->leftJoin('field_data_field_category', 'c', 'c.entity_id = n.nid');
  $select2->fields('n', array('nid'));
  $select2->condition('n.status', 1);
  $select2->condition('n.promote', 1);
  $select2->condition('c.field_category_target_id', $cat_nid);
  $select2->condition('n.type', 'rich_media');
  $select2->orderBy('n.created', 'DESC');
  $select2->range(0, 1);
  $first_nid = $select2->execute()->fetchfield();
  
  if (empty($next_nid)) $next_nid = $first_nid;
  $next_node = node_load($next_nid);
  $node_url = url('node/' . $next_nid);
  $image = loo_get_original_image($next_node); 
  $title = $next_node->title;
  $img = theme_image_style(array('style_name' => 'next-video', 'path' => $image['uri'], 'width' => $image['metadata']['width'], 'height' => $image['metadata']['height']));
  $output = '<div class="next-video">
    <div class="timer">
      <div id="countdown"></div>
      <a class="video" href="' . $node_url . '">next</a>
      <span class="label">Up Next:</span>
    </div>
    <div class="image">' . $img . '</div>
    <h3>' . $title . '</h3></div>';
  return $output;
}
/**
* get current video, used for return for breadcrumbs
*/
function lando_get_current_video($node) {
  $output = '';
  $image = loo_get_original_image($node); 
  $title = $node->title;
  if (!empty($image)) {
    $img = theme_image_style(array('style_name' => 'next-video', 'path' => $image['uri'], 'width' => $image['metadata']['width'], 'height' => $image['metadata']['height']));
  } 
  else {
    $img = '';
  }
  $output = '<div class="current-video">
    <div class="image">' . $img . '</div>
    <h3>' . $title . '</h3>
  </div>';
  return $output;
  
}
/**
* get timeline
*/
function lando_get_timeline($node) {
  $timeline = '';
  if (isset($_GET['position']) && isset($_GET['video'])) {
    $position = $_GET['position'];
    $next_nid = $_GET['video'];
    $next_video = node_load($next_nid);
    $next_fid = @$next_video->field_video['und'][0]['fid'];
    $nid = $node->nid;
    if ($position == 'top') $next_pos = 'bottom';
    if ($position == 'bottom') $next_pos = 'top';
    $url_video = url('node/' . $next_nid, array('query' => array('position' => $next_pos, 'video' => $nid)));
    $timeline = '<div class="timeline"><a class="hint  hint--' . $next_pos . '" data-hint="' . $next_video->title . '" data-fid="' . $next_fid . '" data-position="' . $position . '" href="' . $url_video . '"></a></div>';
  }
  
  return $timeline;
}