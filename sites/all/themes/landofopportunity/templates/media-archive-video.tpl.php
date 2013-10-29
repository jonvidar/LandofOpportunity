<?php

/**
 * @file
 * media_archive/includes/themes/media-archive-video.tpl.php
 *
 * Template file for theme('media_archive_video').
 *
 * Variables available:
 *  $uri - The uri to the Archive video, such as archive://xsy7x8c9.
 *  $video_id - The unique identifier of the Archive video.
 *  $width - The width to render.
 *  $height - The height to render.
 *  $autoplay - If TRUE, then start the player automatically when displaying.
 *  $fullscreen - Whether to allow fullscreen playback.
 *
 * HTML5 options:
 *  $controls - HTML5 option to enable/disable player controls.
 *  $loop     - HTML5 option to loop the video.
 *  $poster   - HTML5 thumbnail/image.
 *  $mp4URL   - HTML5 mp4 stream.
 *  $webmURL  - HTML5 webm stream.
 *  $ogvURL   - HTML5 ogv stream.
 *  $url      - Flash embed link with added query params, used in the fallback.
 *
 * Note that we set the width & height of the outer wrapper manually so that
 * the JS will respect that when resizing later.
 *
 * HTML5 Player:
 * @see http://www.whatwg.org/specs/web-apps/current-work/multipage/the-video-element.html#video
 * @see http://www.w3schools.com/html/html5_intro.asp
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
<?php global $rm_video_id; ?>
<div class="video-id" data-id="video-<?php echo $rm_video_id; ?>"></div>
<video id="video-<?php echo $rm_video_id; ?>" data-fid="<?php echo $rm_video_id; ?>" width="<?php print $width; ?>" height="<?php print $height; ?>"<?php print $poster; ?><?php print $controls; ?><?php print $autoplay; ?>>
  <?php // Normal HTML5 output ?>
  <source src="<?php print $mp4URL; ?>" type="video/mp4" codecs="avc1.42E01E, mp4a.40.2" />
  <source src="<?php print $webmURL; ?>" type="video/webm" />
  <source src="<?php print $ogvURL; ?>" type="video/ogg" codecs="theora, vorbis" />
</video>
