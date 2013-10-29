<?php 
/**
 * @file
 * LandofOpportunity custom blocks.
 */
/**
 * Implements hook_block_info().
 */
function landofopp_block_info() {
  
  $blocks['search']['info'] = t('Custom Search');
  $blocks['search']['cache'] = DRUPAL_NO_CACHE;
  $blocks['top_search']['info'] = t('Top search');
  return $blocks;
}

/**
 * Implements hook_block_view().
 */
function landofopp_block_view($delta = '') {
  $block = array();
  
  switch ($delta) {
    case 'search':
      $block['content'] = landofopp_search_block();
    break;
    case 'top_search':
      $block['content'] = landofopp_top_search_block();
    break;
  
  }
  return $block;
}

/**
*  function return search form
*/

function landofopp_search_block() {
  $form = drupal_get_form('loo_search_form');
  return $form;
}
/**
*  return top search block
*/
function landofopp_top_search_block() {
  $output = '';
  $result = db_select('loo_top_search', 's')
    ->fields('s', array('keyword'))
    ->range(0, 5)
    ->orderBy('s.count', 'DESC')
    ->orderBy('s.keyword', 'ASC')
    ->execute()->fetchCol();
  
  if (!empty($result)) {
    $variables = array(
      'items' => $result,
      'title' => '',
      'type' => 'ul',
      'attributes' => array(),
    );
    $output = theme_item_list($variables);
  }
  return $output;
}
