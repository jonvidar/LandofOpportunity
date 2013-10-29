<?php
/**
 * @file
 * LandofOpportunity theme implementation to display a RMV category.
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
<?php if ($view_mode == 'teaser') : ?>
<?php // teaser mode use for diaplay category in section dig deeper ?>
  <div class="section-inner">
    <div id="node-<?php print $node->nid; ?>" class="node-category clearfix"<?php print $attributes; ?>>
      <section class="category-title section">
        <div class="question">
          <?php if(!empty($node->field_background_image)):?>
            <?php show($content['field_background_image']); ?>
            <?php print render($content['field_background_image']); ?>
          <?php endif; ?>
          <?php if(!empty($node->field_background_video_mp4)):?>
            <video class="video-bg" muted="" loop="" autoplay="" width="100%">
            <?php $video_url_mp4 = file_create_url($node->field_background_video_mp4['und'][0]['file']->uri) ?>
            <source  type="video/mp4" src="<?php echo $video_url_mp4; ?>" type='video/mp4; codecs="avc1.4D401E, mp4a.40.2"' />
            <?php if(!empty($node->field_background_video_ogv)):?>
             <?php $video_url_ogv = file_create_url($node->field_background_video_ogv['und'][0]['file']->uri) ?>
             <source  type="video/ogv" src="<?php echo $video_url_ogv; ?>" type='video/ogg; codecs="theora, vorbis"' />
            <?php endif; ?>
             <?php if(!empty($node->field_background_video_webm)):?>
             <?php $video_url_webm = file_create_url($node->field_background_video_webm['und'][0]['file']->uri) ?>
            <source  type="video/webm" src="<?php echo $video_url_webm; ?>" type='video/webm; codecs="vp8.0, vorbis"' />
            <?php endif; ?>
            </video>
          <?php endif; ?>
          <div class="text">
            <?php print render($title_prefix); ?>
              <h2<?php print $title_attributes; ?>>
                <?php print $title; ?>
              </h2>
            <?php print render($title_suffix); ?>
            <?php if(!empty($node->body['und'][0]['value'])):?>
                <h3><?php echo $node->body['und'][0]['value']; ?></h3>
            <?php endif; ?>
            <a class="arrow" href="#dig-deeper">Learn More</a>
          </div>
        </div>
      </section>
    </div>
    <?php $related_videos = landofopp_get_related_videos($node->nid); ?>
    <?php if(!empty($related_videos)):?>
      <div class="category-wrapper">
        <section class="category section">
          <div class="title">
            <h2><?php print $title; ?></h2>
          </div>
          <div class="category-inner">
             <?php
                foreach ($related_videos as $item) : 
                  $videos = node_view(node_load($item),'featured');
                  print drupal_render($videos);
                endforeach;
              ?>
          </div>
          <div class="bottom-arrow"><a class="bottom" href="#dig-deeper">go</a></div>
        </section>
       </div>
    <?php endif; ?>
  </div>
<?php elseif ($view_mode=='featured'): ?>
<?php // featured mode use for diaplay category in section featured ?>
  <section id="intro-text" class="section intro fixed">
    <div id="node-<?php print $node->nid; ?>" class="node-category clearfix"<?php print $attributes; ?>>
      <div class="question">
        <?php if(!empty($node->field_background_image)):?>
            <?php show($content['field_background_image']); ?>
            <?php print render($content['field_background_image']); ?>
        <?php endif; ?>
       <?php if(!empty($node->field_background_video_mp4)):?>
          <video class="video-bg" muted="" loop="" autoplay="" width="100%">
            <?php $video_url_mp4 = file_create_url($node->field_background_video_mp4['und'][0]['file']->uri) ?>
            <source  type="video/mp4" src="<?php echo $video_url_mp4; ?>" type='video/mp4; codecs="avc1.4D401E, mp4a.40.2"' />
            <?php if(!empty($node->field_background_video_ogv)):?>
                <?php $video_url_ogv = file_create_url($node->field_background_video_ogv['und'][0]['file']->uri) ?>
                <source  type="video/ogv" src="<?php echo $video_url_ogv; ?>" type='video/ogg; codecs="theora, vorbis"' />
            <?php endif; ?>
            <?php if(!empty($node->field_background_video_webm)):?>
                <?php $video_url_webm = file_create_url($node->field_background_video_webm['und'][0]['file']->uri) ?>
                <source  type="video/webm" src="<?php echo $video_url_webm; ?>" type='video/webm; codecs="vp8.0, vorbis"' />
            <?php endif; ?>
          </video>
        <?php endif; ?>
        <?php if(!empty($node->body['und'][0]['value'])):?>
           <div class="text">
            <h2 class="tlt"><?php echo strip_tags($node->body['und'][0]['value'],''); ?></h2>
            <a class="arrow" href="#featured">Learn More</a>
          </div>
        <?php endif; ?>
      </div>
    </div>
  </section>
  <?php $related_videos = landofopp_get_related_videos($node->nid); ?>
  <?php if(!empty($related_videos)):?>
    <section id="featured" class="section featured fixed">
        <div class="category-wrapper">
            <div class="category-inner">
            <div class="title"><h2>Featured Videos</h2></div>
               <?php
                  foreach ($related_videos as $item) : 
                    $videos = node_view(node_load($item),'featured');
                    print drupal_render($videos);
                  endforeach;
                ?>
            </div>
             <div class="bottom-arrow"><a class="bottom" href="#info">go</a></div>
        </div>
    </section>
  <?php endif; ?>
<?php else : ?>
  <?php print '<a rel="node-'.$node->nid.'" href="#dig-deeper">'.$node->title.'</a>'; ?>
<?php endif; ?>