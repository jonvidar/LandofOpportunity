<?php 
/**
 * @file
 * LandofOpportunity theme implementation to display a Timeline node.
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
<?php $classes = str_replace('contextual-links-region','',$classes); ?>
<div id="node-<?php print $node->nid; ?>" class="<?php print $classes; ?> clearfix dot-info"<?php print $attributes; ?> rel="event-<?php print $node->nid; ?>"> 
  <div class="info-top">
    <div class="video-thumb">
      <?php if(!empty($node->field_sandy_video)):?>
          <?php if(!empty($node->field_katrina_video['und'][0])):?>
            <?php $sandy_video_id = $node->field_katrina_video['und'][0]['target_id']; ?>
            <?php $sandy_video = url('node/'.$node->field_sandy_video['und'][0]['target_id'],array('query'=>array('position'=>'bottom','video'=>$sandy_video_id)))?>
           <?php else: ?>
             <?php $sandy_video = url('node/'.$node->field_sandy_video['und'][0]['target_id']); ?>
          <?php endif; ?>
          <a class="play" href="<?php echo $sandy_video; ?>">Play</a>
          <?php $sandy_video_node = node_load($node->field_sandy_video['und'][0]['target_id']); ?>
          <?php $image = landofopp_get_original_image($sandy_video_node); ?>
          <?php if(!empty($image)):?>
            <?php $preview = $image['uri']; ?>
            <?php $video_image = theme_image_style(array('style_name' => '800', 'path' => $preview,'width'=>$image['metadata']['width'],'height'=>$image['metadata']['height'])); ?>
            <?php echo $video_image; ?>
          <?php endif; ?>
      <?php else : ?>
        <?php if(!empty($node->field_sandy_image)):?>
          <?php show($content['field_sandy_image']); ?>
          <?php print render($content['field_sandy_image']); ?>
        <?php endif; ?>
        <!--<div class="no-video"></div>-->
      <?php endif; ?>
    </div>
    <div class="content-wrapper"><div class="content">
      <h2>SANDY</h2>
      <?php if(!empty($node->field_sandy_description)):?>
          <?php show($content['field_sandy_description']); ?>
          <?php print render($content['field_sandy_description']); ?>
      <?php endif; ?>
      <?php if(!empty($node->field_sandy_link)):?>
          <?php show($content['field_sandy_link']); ?>
          <?php print render($content['field_sandy_link']); ?>
      <?php endif; ?>
      <?php if(!empty($node->field_sandy_video)):?>
        <?php if(!empty($node->field_katrina_video['und'][0])):?>
           <?php $sandy_video_id = $node->field_katrina_video['und'][0]['target_id']; ?>
           <?php $sandy_video = url('node/'.$node->field_sandy_video['und'][0]['target_id'],array('query'=>array('position'=>'bottom','video'=>$sandy_video_id)))?>
        <?php else: ?>
           <?php $sandy_video = url('node/'.$node->field_sandy_video['und'][0]['target_id']); ?>
        <?php endif; ?>
        <a class="more" href="<?php echo $sandy_video; ?>">watch the video</a>
      <?php endif; ?>
    </div></div>
  </div>
  <div class="info-bottom">
    <div class="video-thumb">
       <?php if(!empty($node->field_katrina_video['und'][0]['target_id'])):?>
           <?php if(!empty($node->field_sandy_video)):?>
             <?php $katrina_video_id = $node->field_sandy_video['und'][0]['target_id']; ?>
             <?php $katrina_video = url('node/'.$node->field_katrina_video['und'][0]['target_id'],array('query'=>array('position'=>'top','video'=>$katrina_video_id)))?>
           <?php else: ?>
              <?php $katrina_video = url('node/'.$node->field_katrina_video['und'][0]['target_id']); ?>
          <?php endif; ?>
          <a class="play" href="<?php echo $katrina_video; ?>">Play</a>
          <?php $katrina_video_node = node_load($node->field_katrina_video['und'][0]['target_id']); ?>
          <?php $image = landofopp_get_original_image($katrina_video_node); ?>
          <?php $preview = $image['uri']; ?>
          <?php $video_image = theme_image_style(array('style_name' => '800', 'path' => $preview,'width'=>$image['metadata']['width'],'height'=>$image['metadata']['height'])); ?>
          <?php echo $video_image; ?>
      <?php else : ?>
        <?php if(!empty($node->field_katrina_image)):?>
          <?php show($content['field_katrina_image']); ?>
          <?php print render($content['field_katrina_image']); ?>
        <?php endif; ?>
        <!--<div class="no-video"></div>-->
      <?php endif; ?>
    </div>
    <div class="content-wrapper"><div class="content">
      <h2>Katrina</h2>
       <?php if(!empty($node->field_katrina_description)):?>
          <?php show($content['field_katrina_description']); ?>
          <?php print render($content['field_katrina_description']); ?>
      <?php endif; ?>
      <?php if(!empty($node->field_katrina_link)):?>
          <?php show($content['field_katrina_link']); ?>
          <?php print render($content['field_katrina_link']); ?>
      <?php endif; ?>
       <?php if(!empty($node->field_katrina_video['und'][0]['target_id'])):?>
        <?php if(!empty($node->field_sandy_video)):?>
           <?php $katrina_video_id = $node->field_sandy_video['und'][0]['target_id']; ?>
           <?php $katrina_video = url('node/'.$node->field_katrina_video['und'][0]['target_id'],array('query'=>array('position'=>'top','video'=>$katrina_video_id)))?>
         <?php else: ?>
           <?php $katrina_video = url('node/'.$node->field_katrina_video['und'][0]['target_id']); ?>
        <?php endif; ?>
        <a class="more" href="<?php echo $katrina_video; ?>">watch the video</a>
      <?php endif; ?>
    </div></div>
  </div>
</div>