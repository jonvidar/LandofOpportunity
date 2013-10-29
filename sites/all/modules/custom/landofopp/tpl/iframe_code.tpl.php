<?php 
/*
* iframe code template
* 
*/
?>
<?php if (!empty($node)) : ?>
<?php 
	$node_url = url('node/'.$node->nid,array('absolute'=>TRUE,'query'=>array('iframe_mode'=>1)));
	$output = '<iframe width="'.$width.'" height="'.$height.'" src="'.$node_url.'" allowfullscreen="true" webkitallowfullscreen="true" mozallowfullscreen="true" frameborder="0"></iframe>';
?>
<?php echo $output; ?>
<?php endif; ?>