<?php 
/*
* preview video template 
* @see node--rich_media.tpl.php
*/
?>
<?php 
	global $rm_video_id;
	$rm_video_id = @$node->field_video['und'][0]['fid'];
	$title = $node->title;
	$description = $node->body['und'][0]['value'];
	$file = file_load($rm_video_id);
	if ($file->type == 'video') {
		switch ($file->filemime) {
			case 'video/archive':
				$options = array(
					'width'=>'640',
					'height'=>'362', 
					'controls'=>FALSE,
					'autoplay' => FALSE,
					'controls_hide' => FALSE,
					'loop' => FALSE,
				);
				$video = theme('media_archive_video',array('uri'=>$file->uri,'options'=>$options));
			break;
			case 'video/vimeo':
				$url = str_replace('vimeo://v/','http://vimeo.com/',$file->uri);
				$video = '<div id="video-'.$file->fid.'" data-fid="'.$rm_video_id.'" class="vimeo" data-url="'.$url.'"></div>';
			break;
			case 'video/youtube':
				$url = str_replace('youtube://v/','http://www.youtube.com/watch?v=',$file->uri);
				$video = '<div id="video-'.$file->fid.'" data-fid="'.$rm_video_id.'" class="youtube" data-url="'.$url.'"></div>';
			break;
		}
	}
?>
<div class="node-rich-media video-preview">
	<div id="box-video">
		<div id="player-logo"></div>
		<div id="breadcrumps"></div>
		<div id="next-video"></div>
		<div class="videos">
			<div class="playervideo-box" data-fid="<?php echo $rm_video_id; ?>">
				<?php if ($markers) : ?>
				<div class="markers" data-markers='<?php echo json_encode($markers); ?>'></div>
				<?php endif;?>
				<?php echo $video; ?>
				<div class="video-id" data-id="video-<?php echo $rm_video_id; ?>"></div>
				<div class="video-info">
					<div class="content-body">
						<h2><?php echo $title; ?></h2>
						<div class="description"><?php echo $description; ?></div>
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
				<div id="box-help"><a class="icon-question" href=""></a></div>
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
</div>