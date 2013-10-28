<?php 
/*
* custom search page template
* 
*/
?>
<div class="search-results">
<?php if (!empty($results)): ?>
	<?php 
		$search_text = arg(2); 
		$count = count($results); 
		$result_text = ($count == 1) ? 'result' : 'results';
		$title = $count.' '.$result_text.' for '.$search_text;
	?>
	
	<h2><?php echo $title ; ?></h2>
	<div class="filter">
		<span>Sorted by</span>
		<select class="sort">
			<option selected="selected" value="score">Relevance</option>
			<option value="date">Date</option>
			<option value="comment">Popular</option>
			<option value="location">Location</option>
		</select>
	</div>
	<div class="video-results" id="search-result-sort">
	<?php foreach ($results as $item): ?>
		
		<?php $node = $item['node']; ?>
		<?php unset($item['node']); ?>
		<?php $build = node_view($node,'search_result'); ?>
		<?php echo '<div class="sort"><div class="sort-item" data-location="'.$item['city'].'" data-score="'.$count.'" data-date="'.$item['date'].'" data-comment="'.($item['comment']+1).'">'.render($build).'</div></div>'; ?>
		<?php $count--;?>
	<?php endforeach;?>
	</div>
<?php else :?>
	<h2><?php print t('Your search yielded no results');?></h2>
	<?php print search_help('search#noresults', drupal_help_arg()); ?>
<?php endif;?>
</div>