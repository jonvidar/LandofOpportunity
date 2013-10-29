<?php

/**
 * @file media_vimeo/includes/themes/media-vimeo-video.tpl.php
 *
 * Template file for theme('media_vimeo_video').
 *
 * Variables available:
 *  $uri - The uri to the Vimeo video, such as vimeo://v/xsy7x8c9.
 *  $video_id - The unique identifier of the Vimeo video.
 *  $width - The width to render.
 *  $height - The height to render.
 *  $autoplay - If TRUE, then start the player automatically when displaying.
 *  $fullscreen - Whether to allow fullscreen playback.
 *
 * Note that we set the width & height of the outer wrapper manually so that
 * the JS will respect that when resizing later.
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

<?php if (!empty($_REQUEST['is_ajax'])) : ?>
	<?php global $rm_video_id; ?>
	<?php $urlvideo = str_replace('vimeo://v/','http://vimeo.com/',$uri); ?>
	<div class="vimeo" id="video-<?php echo $rm_video_id; ?>" data-fid="<?php echo $rm_video_id; ?>" data-url="<?php echo $urlvideo; ?>"></div>
	<div class="video-id" data-id="video-<?php echo $rm_video_id; ?>"></div>
<?php else : ?>
<div class="media-vimeo-outer-wrapper" id="media-vimeo-<?php print $id; ?>" style="width: <?php print $width; ?>px; height: <?php print $height; ?>px;">
  <div class="media-vimeo-preview-wrapper" id="<?php print $wrapper_id; ?>">
    <?php print $output; ?>
  </div>
</div>
<?php endif; ?>
