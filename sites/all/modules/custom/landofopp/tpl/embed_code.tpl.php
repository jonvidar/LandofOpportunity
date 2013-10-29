<?php 
/*
* embed code template
* 
*/
?>
<?php if (!empty($node)) : ?>
<?php 
	$output = '';
	global $base_url;
	$node_url = url('node/'.$node->nid,array('absolute'=>TRUE));

	$image = loo_get_original_image($node);
	if (!empty($image)) {
		$preview = theme_image_style(array('style_name' => 'embed', 'path' => $image['uri'],'width'=>$image['metadata']['width'],'height'=>$image['metadata']['height'],'attributes'=>array('style'=>'width:100%;')));
	
		$theme_path = $base_url.'/'.drupal_get_path('theme','lando');
	
		$onclick = 'onclick="window.open(this.href, \''.$node->title.'\', \'toolbar=0,location=0,directories=0,status=0,menubar=0,scrollbars=0,resizable=0,width=1024,height=768\');return false"';
		$styles_play = 'width:50px; height:50px; text-indent:-99999px; overflow:hiddden; background:url('.$theme_path.'/images/bg-arrow-small.png); display:block; position:absolute; top:50%; left:50%; margin:-25px 0 0 -25px';
		$style_logo  = 'background: url('.$theme_path.'/images/logo.png); text-indent:-99999px; height: 48px; left: 40px; position: absolute; top: 20px; width: 191px;';

		$output = '<div style="position:relative; width:'.$width.'px; height:'.$height.'px">';
	
		$output .= $preview;
		$output .= '<a href="'.$node_url.'" '.$onclick.' style="'.$styles_play.'">play</a>';
		$output .= '<div class="logo" style="'.$style_logo.'">logo</div>';
		$output .= '</div>';
		
	}
	
	echo $output;
?>
<?php endif; ?>