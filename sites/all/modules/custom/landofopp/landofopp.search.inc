<?php 
/**
 * @file
 * LandofOpportunity custom search.
 */
/**
 * Implements hook_search_info().
 */
function landofopp_search_info() {
  return array(
    'title' => 'Rich Media Video',
    'path' => 'video',
  );
}
/**
 * Implements hook_search_page().
 */
function landofopp_search_page($results) {
  $output['#markup'] = theme('search_custom_page', array('results' => $results));
  return $output;
}


/**
 * Implements hook_search_status().
 */
function landofopp_search_status() {
  $total = db_query('SELECT COUNT(*) FROM {node}')->fetchField();
  $remaining = db_query("SELECT COUNT(*) FROM {node} n LEFT JOIN {search_dataset} d ON d.type = 'node' AND d.sid = n.nid WHERE d.sid IS NULL OR d.reindex <> 0")->fetchField();
  return array('remaining' => $remaining, 'total' => $total);
}
/**
 * Implements hook_search_reset().
 */
function landofopp_search_reset() {
  db_update('search_dataset')
    ->fields(array('reindex' => REQUEST_TIME))
    ->condition('type', 'node')
    ->execute();
}
/**
 * Implements hook_update_index().
 */
function landofopp_update_index() {
  $limit = (int) variable_get('search_cron_limit', 100);

  $result = db_query_range("SELECT n.nid FROM {node} n LEFT JOIN {search_dataset} d ON d.type = 'node' AND d.sid = n.nid WHERE d.sid IS NULL OR d.reindex <> 0 ORDER BY d.reindex ASC, n.nid ASC", 0, $limit);
  
  $types = array('rich_media');
  foreach ($result as $node) {
    $text = '';
    $node = node_load($node->nid);

    // Save the changed time of the most recent indexed node, for the search
    // results half-life calculation.
    variable_set('node_cron_last', $node->changed);
    $build = node_view($node, 'search_index');
    unset($build['#theme']);
    //$build
    $node->rendered = drupal_render($build);
    $text = '<h1>' . check_plain($node->title) . '</h1>' . $node->rendered;
    // remove comment from index for RMV
    if (!in_array($node->type, $types)) {
      $extra = module_invoke_all('node_update_index', $node);
      foreach ($extra as $t) {
        $text .= $t;
      }
    }
    

    // Update index
    search_index($node->nid, 'node', $text);
  }
}
/**
 * Implements hook_search_execute().
 */
function landofopp_search_execute($keys = NULL, $conditions = NULL) {
  //update top_search
  landofopp_top_search_update($keys);
  $cat_nids = landofopp_get_promoted_categories();
  // Build matching conditions
  $query = db_select('search_index', 'i', array('target' => 'slave'))->extend('SearchQuery')->extend('PagerDefault');
  $query->join('node', 'n', 'n.nid = i.sid');
  $query
    ->condition('n.status', 1)
    ->addTag('node_access')
    ->searchExpression($keys, 'node');

  // Insert special keywords.
  $query->setOption('type', 'n.type');
  $query->setOption('language', 'n.language');
  if ($query->setOption('term', 'ti.tid')) {
    $query->join('taxonomy_index', 'ti', 'n.nid = ti.nid');
  }
  // Only continue if the first pass query matches.
  if (!$query->executeFirstPass()) {
    return array();
  }
  $query->condition('n.type', 'rich_media');
  $query->condition('n.promote', 1);
  if ($cat_nids) {
    $query->leftJoin('field_data_field_category', 'fc', 'n.nid = fc.entity_id');
    $query->condition('fc.field_category_target_id', $cat_nids, 'in');
  }
  
  // Add the ranking expressions.
  _node_rankings($query);

  // Load results.
  $find = $query
    ->execute();
  $results = array();
  foreach ($find as $item) {
    // Render the node.
    $node = node_load($item->sid);
    $city = '';
    if (!empty($node->location['city'])) $city = $node->location['city'];
    $results[] = array(
      'date' => $node->changed,
      'city' => $city,
      'comment' => $node->comment_count,
      'score' => $item->calculated_score,
      'node' => $node,
    );

  }
  
  return $results;
}
/**
* Get promoted categories.
* 
*/
function landofopp_get_promoted_categories() {
  
  $nids = db_select('node', 'n')
    ->fields('n', array('nid'))
    ->condition('n.type', 'category')
    ->condition('n.status', 1)
    ->execute()->fetchCol();
    
  return $nids;
}
