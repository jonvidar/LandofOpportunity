<?php
/**
 * @file
 * LandofOpportunity theme implementation to display a RMV node.
 *
 * @see template_preprocess()
 * @see template_preprocess_node()
 * @see template_process()
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
?>
<?php if ($view_mode == 'search_result') : ?>
<?php // search_result view mode  use for displays  video in search result overlay ?>
<?php $show_triggers = loo_represented_search_key($node); ?>
<?php if ($show_triggers) :  ?>
	<?php $markers = loo_get_markers_from_richmedia($node); ?>
<?php else : ?>
	<?php $key_search = arg(2); $key_search = strtolower($key_search);?>
	<?php $markers = loo_get_markers_from_richmedia($node,$key_search); ?>
<?php endif; ?>
<div id="node-<?php print $node->nid; ?>" class="video-item"<?php print $attributes; ?>>
	<?php print render($title_prefix); ?>
	<?php print render($title_suffix); ?>
	<?php $image = loo_get_original_image($node); ?>
	<?php 
		if (empty($image)) {
			$preview = file_default_scheme().'://default-image/default-image-video.png';
			$image = image_get_info($preview);
			$video_image = theme_image_style(array('style_name' => 'search-result', 'path' => $preview,'width'=>$image['width'],'height'=>$image['height']));
			$video_image_desaturate = theme_image_style(array('style_name' => 'search-result-desaturate', 'path' => $preview,'width'=>$image['width'],'height'=>$image['height'],'attributes'=>array('class'=>'desaturate')));
		} else {
			$preview = $image['uri'];
			$video_image = theme_image_style(array('style_name' => 'search-result', 'path' => $preview,'width'=>$image['metadata']['width'],'height'=>$image['metadata']['height']));
			$video_image_desaturate = theme_image_style(array('style_name' => 'search-result-desaturate', 'path' => $preview,'width'=>$image['metadata']['width'],'height'=>$image['metadata']['height'],'attributes'=>array('class'=>'desaturate')));
		}
	?>
	<div class="video-image">
		<h3 class="title"><span class="cont-vert"><span class="sub-vert"><span class="object"><?php print $title; ?></span></span></span></h3>
		<?php echo $video_image; ?>
		<?php echo $video_image_desaturate; ?>
		<div class="overlay"></div>
	</div>
	<div class="description">
		<div class="image">
			<?php echo $video_image; ?>
		</div>
		<div class="text">
			<h3><?php echo $title; ?></h3>
			<?php $body = render($content['body']); ?>
			<div class="desc">
				<a href="<?php echo $node_url; ?>" class="link">link</a>
				<?php echo $body; ?>
			</div>
			
			<?php if (!empty($markers)) : ?>
				<div class="markers">
					<?php foreach ($markers as $marker) : ?>
						<?php 
							$trigger_type = ''; 
							if (!empty($marker['video'])) $trigger_type = 'video';
							if (!empty($marker['image'])) $trigger_type = 'photo';
							if (!empty($marker['audio'])) $trigger_type = 'audio';
							if (!empty($marker['url'])) $trigger_type = 'url';
							if (!empty($marker['pdf'])) $trigger_type = 'pdf';
						?>
						<div class="item"><a href="" data-id="<?php echo $marker['nid']; ?>" class="hint  hint--bottom <?php echo $trigger_type ?>" data-hint="<?php echo $marker['title'] ?>"><span class="image"><img src="<?php echo $marker['preview'];  ?>" height="50" /></span><span class="link-overlay"></span><span class="icon"></span></a></div>
					<?php endforeach; ?>
				</div>
			<?php endif; ?>
		</div>
	</div>
</div>
<?php elseif ($view_mode == 'timeline') : ?>
	<?php // timeline view mode  use for displays  video in timeline ?>
	<?php $video = render($content); ?>
	<?php $field_video = @$node->field_video['und'][0]['file']; ?>
	<?php if ($field_video) : ?>
		<?php $video = str_replace('<div class="video-id" data-id="video-'.$field_video->fid.'"></div>','',$video); ?>
		<?php $video = str_replace(' id="video-'.$field_video->fid.'" data-fid="'.$field_video->fid.'"','',$video); ?>
	<?php endif; ?>
	<?php echo $video; ?>
<?php elseif ($view_mode == 'teaser') : ?>
	<?php // teaser mode  use for displays  video in category ?>
	<div id="node-<?php print $node->nid; ?>" class="<?php print $classes; ?> clearfix"<?php print $attributes; ?>>
		<?php print render($title_prefix); ?>
		<?php print render($title_suffix); ?>
	</div>
<?php elseif ($view_mode=='featured'): ?>
<?php // featured mode  use for displays  video in featured section ?>
<?php 
	global $base_path;
	$data_url = $node_url;
	$pos = strpos($data_url,$base_path);
	if ($pos !== false) {
		$data_url = substr_replace($data_url,'',$pos,strlen($base_path));
	}
	$data_url = str_replace('-','_',$data_url);
	$data_url = str_replace('/','-',$data_url);
?>
	<div class="video">
		<div class="text">
			<h2<?php print $title_attributes; ?>>
				<a data-url="<?php echo $data_url; ?>" href="<?php print $node_url; ?>"><span><?php print $title; ?></span></a>
			</h2>
			<?php if(!empty($node->field_tags)):?>
				<?php show($content['field_tags']); ?>
				<div class="tags"><?php print render($content['field_tags']); ?></div>
			<?php endif; ?>
		</div>
		<div class="image">
			<?php if(!empty($node->field_video_image)):?>
				<?php show($content['field_video_image']); ?>
				<?php print render($content['field_video_image']); ?>
				<div class="greyscale">
					<?php $image = $node->field_video_image['und'][0]; ?>
					<?php $greyscale_image = theme_image_style(array('style_name' => 'greyscale', 'path' => $image['uri'],'width'=>$image['metadata']['width'],'height'=>$image['metadata']['height'])); ?>
					<?php echo $greyscale_image; ?>
				</div>
			<?php endif; ?>
		</div>
		<div class="overlay"></div>
		<div class="overlay-blue"></div>
	</div>
<?php elseif ($view_mode == 'full') : ?>
<?php 
	// full mode use display video  in RMV player
	global $rm_video_id;
	$partner = lando_get_partner_from_rmv($node);
	$next_video = lando_get_next_video($node);
	$current_video = lando_get_current_video($node);
	$timeline = lando_get_timeline($node);
	
	$description = render($content['body']);
	$markers = loo_get_markers_from_richmedia($node);
	if ($node->comment == COMMENT_NODE_CLOSED) {
		$comment_form = '';
	} else {
		if (!empty($content['comments']['comment_form'])) {
			$comment_form = render($content['comments']['comment_form']);
		} else {
			$comment_form = '<div class="login-box"><p class="login">Please <a id="btn-social" href="#">login</a> to post comments</p></div>';
		}
	}
	
	
	$comments = loo_get_comment_from_richmedia($node);
	$cat_id = loo_get_field_value($node,'field_category','target_id');
?>
<?php 
	// share title and url
	global $base_path;
	$data_url = $node_url;
	$current_url = $node_url;
	$pos = strpos($data_url,$base_path);
	if ($pos !== false) {
		$data_url = substr_replace($data_url,'',$pos,strlen($base_path));
	}
	
	$node_url = url('<front>',array('absolute'=>TRUE,'fragment'=>'/'.$data_url,'query'=>array('video'=>$node->nid)));
	
	$node_url = urlencode($node_url);
	$node_title = urlencode($node->title.' | '.variable_get('site_name')); 
	
	$embed_code = theme('embed_code',array('node'=>$node,'width'=>640,'height'=>480));
	$show_embed_code = loo_get_field_value($node,'field_embed_code','value');
	
	$subject_mail = variable_get('loo_mail_subject','');
	$subject_body = variable_get('loo_mail_body','');
	$params['@title'] = $node->title;
	$params['@url'] = url('<front>',array('absolute'=>TRUE,'fragment'=>'/'.$data_url));
	$subject_body = t($subject_body,$params);
	
	$class_name = '';
	
	if (!empty($_GET['iframe_mode'])) {
		$class_name = 'iframe';
		$comments = $comment_form = ''; 
	}
?>
<?php $field_video = @$node->field_video['und'][0]['file']; ?>
<?php if ($field_video) : ?>
	<?php 
		// created video field
		$rm_video_id = $field_video->fid;
		if ($field_video->filemime == 'video/youtube') {
			$url = str_replace('youtube://v/','http://www.youtube.com/watch?v=',$field_video->uri);
			$video = '<div class="youtube" id="video-'.$rm_video_id.'" data-fid="'.$rm_video_id.'" data-url="'.$url.'"></div>';
		} elseif ($field_video->filemime == 'video/vimeo') {
			$url = str_replace('vimeo://v/','http://vimeo.com/',$field_video->uri);
			$video = '<div class="vimeo" id="video-'.$rm_video_id.'" data-fid="'.$rm_video_id.'" data-url="'.$url.'"></div>';
		} else $video = render($content['field_video']); 
	?>
<?php endif; ?>
<?php if(!empty($_REQUEST['is_ajax'])) : ?>
	<?php // print content only for video ?>
	<div class="markers" data-markers='<?php echo json_encode($markers); ?>'></div>
	<?php if ($comment_form) : ?>
	<div class="comment-form"><?php echo $comment_form; ?></div>
	<?php endif; ?>
	<?php if ($comments) : ?>
	<div class="comments" data-comments='<?php echo json_encode($comments); ?>'></div>
	<?php endif; ?>
	<?php echo $video; ?>
	<div class="video-id node-video-id" data-url="<?php echo $current_url; ?>" data-nid="<?php echo $node->nid; ?>" data-id="video-<?php echo $rm_video_id; ?>"></div>
	<?php echo $timeline; ?>
	<?php echo $next_video; ?>
	<?php echo $current_video; ?>
	<div class="video-info">
		<?php if ($partner) : ?>
		<div class="tag"><?php echo $partner; ?></div>
		<?php endif ; ?>
		<div class="content-body">
			<h2><?php echo $title; ?></h2>
			<div class="description"><?php echo $description; ?></div>
			<?php if (!empty($cat_id) && $promote) : ?>
				<ul class="nav">
					<li><a target="_blank" href="http://twitter.com/share?url=<?php echo $node_url; ?>&amp;text=<?php echo $node_title; ?>" class="twitter">twitter</a></li>
					<li><a target="_blank" href="http://www.facebook.com/sharer.php?u=<?php echo $node_url; ?>" class="facebook">facebook</a></li>
					<?php if ($show_embed_code) : ?><li><a class="embed" href="#">embed</a></li> <?php endif; ?>
					<li><a class="email" href="mailto:?subject=<?php echo $subject_mail; ?>&body=<?php echo $subject_body ?>">email</a></li>
				</ul>
				<div class="embed-code">
					<textarea><?php echo $embed_code; ?></textarea>
				</div>
				<div class="email-send">
					<?php echo $form_email; ?>
				</div>
			<?php endif; ?>
		</div>
	</div>
<?php else : ?>
<div id="node-<?php print $node->nid; ?>" class="<?php print $classes; ?> clearfix"<?php print $attributes; ?>>
	<?php // print content for full RMV player ?>
	<?php print render($title_prefix); ?>
	<?php print render($title_suffix); ?>
	<div id="box-video" <?php if ($class_name) echo 'class="' . $class_name. '"'; ?>>
		<?php if (empty($_GET['iframe_mode'])) : ?>
			<a id="btn-close" href="#">close</a>
			<div class="chardin chardin-logo" data-intro="As you navigate deeper into the story, you will always be able to dig your way out using a breadcrumb trail here. Clicking the X will close the video player." data-position="left"></div>
			<div class="chardin chardin-bar" data-intro="As you watch the video, additonal information will become available in the progress bar. Feel free to explore as you go or come back to it at the end of the clip. You can also add a comment at any point." data-position="top"></div>
			<div class="chardin chardin-info" data-intro="Find information about the current clip and links for sharing here." data-position="left"></div>
			
		<?php endif; ?>
		<div id="player-logo"  data-url="<?php echo url('<front>',array('absolute'=>TRUE)); ?>"></div>
		<div id="breadcrumps"></div>
		<div id="next-video"></div>
		<div id="previous-video">
			<div class="timer">
				<div id="countdown-video"></div>
				<a class="video" href="">next</a>
			</div>
		</div>
		<div class="videos">
			<div class="playervideo-box" data-fid="<?php echo $rm_video_id; ?>">
				<?php if ($markers) : ?>
				<div class="markers" data-markers='<?php echo json_encode($markers); ?>'></div>
				<?php endif;?>
				<div class="comment-form"><?php echo $comment_form; ?></div>
				<?php if ($comments) : ?>
				<div class="comments" data-comments='<?php echo json_encode($comments); ?>'></div>
				<?php endif; ?>
				<?php echo $video; ?>
				<div class="video-id node-video-id" data-url="<?php echo $current_url; ?>" data-nid="<?php echo $node->nid; ?>" data-id="video-<?php echo $rm_video_id; ?>"></div>
				<?php echo $timeline; ?>
				<?php echo $next_video; ?>
				<?php echo $current_video; ?>
				<div class="video-info">
					<?php if ($partner) : ?>
						<div class="tag"><?php echo $partner; ?></div>
					<?php endif ; ?>
					<div class="content-body">
						<h2><?php echo $title; ?></h2>
						<div class="description"><?php echo $description; ?></div>
						<?php if (!empty($cat_id) && $promote) : ?>
							<ul class="nav">
								<li><a target="_blank" href="http://twitter.com/share?url=<?php echo $node_url; ?>&amp;text=<?php echo $node_title; ?>" class="twitter">twitter</a></li>
								<li><a target="_blank" href="http://www.facebook.com/sharer.php?u=<?php echo $node_url; ?>" class="facebook">facebook</a></li>
								<?php if ($show_embed_code) : ?><li><a class="embed" href="#">embed</a></li> <?php endif; ?>
								<li><a class="email" href="mailto:?subject=<?php echo $subject_mail; ?>&body=<?php echo $subject_body ?>">email</a></li>
							</ul>
							<div class="embed-code">
								<textarea><?php echo $embed_code; ?></textarea>
							</div>
							<div class="email-send">
								<?php echo $form_email; ?>
							</div>
						<?php endif; ?>
					</div>
				</div>
			</div>
		</div>
		<div id="box-controls">
			<div id="left-controls">
				<div id="box-pauseplay"><a class="icon-play" href=""></a></div>
				<div id="timebar">
					<span class="current"></span> / <span class="total"></span>
				</div>
			</div>
			<div id="timeline-wrap">
				<div id="timeline-wrap-inner">
					<div id="vidbox-progress"></div>
					<div id="vidbox-markers"></div>
				</div>
			</div>
			<div id="right-constrols">
				<div id="box-fullscreen"><a class="fullscreen" href=""></a></div>
				<?php if (empty($_GET['iframe_mode'])) : ?>
					<div id="box-help" data-toggle="chardinjs"><a class="icon-question" href=""></a></div>
				<?php endif; ?>
			</div>
		</div>
		<div id="comment-area" class="comment-form"></div>
		<div id="gradient-info"></div>
		<div id="vidbox-markers-popup"></div>
		<div id="vidbox-comments-popup">
			<div class="comments-box"></div>
		</div>
		<div id="videoInfo">
			<div class="video-container">
			</div>
		</div>
	</div>
<?php endif; ?>
<?php endif; ?>

