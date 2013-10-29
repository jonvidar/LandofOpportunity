<?php
/**
 * @file
 * LandofOpportunity theme implementation to display a team members.
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
<?php // teaser mode use for diaplay team members in section about, view image field?>
  <?php if(!empty($node->field_protagonist_image)):?>
    <div class="item" rel="node-<?php print $node->nid; ?>">
      <?php show($content['field_protagonist_image']); ?>
      <?php print render($content['field_protagonist_image']); ?>
      <?php $image = $node->field_protagonist_image['und'][0]; ?>
      <?php $image_path = $image['uri']; ?>
      <?php //pa($image,1); ?>
      <?php $thumb_image = theme_image_style(array('style_name' => '64x64_greyscale', 'path' => $image_path,
      'width'=>$image['metadata']['width'],
      'height'=>$image['metadata']['height'],
      'attributes'=>array('class' => 'greyscale')
      )); ?>
      <?php echo $thumb_image; ?>
      <div class="overlay"></div>
  </div>
  <?php endif; ?>
<?php else : ?>
<?php // full mode use for diaplay team members in section about, view text field ?>
  <div rel="node-<?php print $node->nid; ?>" id="node-<?php print $node->nid; ?>" class="<?php print $classes; ?> clearfix person"<?php print $attributes; ?>>
    <?php print render($title_prefix); ?>
      <h2<?php print $title_attributes; ?>>
        <?php print $title; ?>
      </h2>
    <?php print render($title_suffix); ?>
    <?php if(!empty($node->field_protagonist_subtitle['und'][0]['value'])):?>
      <h3><?php echo $node->field_protagonist_subtitle['und'][0]['value']; ?></h3>
    <?php endif; ?>
    <div class="content clearfix"<?php print $content_attributes; ?>>
      <?php if(!empty($node->field_protagonist_image)):?>
        <?php show($content['field_protagonist_image']); ?>
        <?php print render($content['field_protagonist_image']); ?>
      <?php endif; ?>
      <?php
        // We hide the comments and links now so that we can render them later.
        hide($content['comments']);
        hide($content['links']);
        print render($content);
      ?>
    </div>
  </div>
<?php endif; ?>