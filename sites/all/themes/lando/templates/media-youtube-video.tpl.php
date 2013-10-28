<?php

/**
 * @file media_youtube/includes/themes/media-youtube-video.tpl.php
 *
 * Template file for theme('media_youtube_video').
 *
 * Variables available:
 *  $uri - The media uri for the YouTube video (e.g., youtube://v/xsy7x8c9).
 *  $video_id - The unique identifier of the YouTube video (e.g., xsy7x8c9).
 *  $id - The file entity ID (fid).
 *  $url - The full url including query options for the Youtube iframe.
 *  $options - An array containing the Media Youtube formatter options.
 *  $api_id_attribute - An id attribute if the Javascript API is enabled;
 *  otherwise NULL.
 *  $width - The width value set in Media: Youtube file display options.
 *  $height - The height value set in Media: Youtube file display options.
 *  $title - The Media: YouTube file's title.
 *  $alternative_content - Text to display for browsers that don't support
 *  iframes.
 *
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
	<?php $urlvideo = str_replace('youtube://v/','http://www.youtube.com/watch?v=',$uri); ?>
	<div class="youtube" id="video-<?php echo $rm_video_id; ?>" data-fid="<?php echo $rm_video_id; ?>" data-url="<?php echo $urlvideo; ?>"></div>
	<div class="video-id" data-id="video-<?php echo $rm_video_id; ?>"></div>
<?php else : ?>
<div class="<?php print $classes; ?> media-youtube-<?php print $id; ?>">
  <iframe class="media-youtube-player" <?php print $api_id_attribute; ?>width="<?php print $width; ?>" height="<?php print $height; ?>" title="<?php print $title; ?>" src="<?php print $url; ?>" frameborder="0" allowfullscreen><?php print $alternative_content; ?></iframe>
</div>
<?php endif; ?>
