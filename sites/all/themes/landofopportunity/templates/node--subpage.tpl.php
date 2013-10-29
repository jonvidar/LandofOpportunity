<?php
/**
 * @file
 * LandofOpportunity theme implementation to display a subpages.
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
<div rel="<?php print $title; ?>"  id="node-<?php print $node->nid; ?>" class="<?php print $classes; ?> clearfix item"<?php print $attributes; ?>>
  <div class="wrapper">
	  <?php print render($title_prefix); ?>
	  <?php if (!$page): ?>
	    <h2 class="title" <?php print $title_attributes; ?>>
	     <?php print $title; ?>
	    </h2>
	  <?php endif; ?>
	  <?php print render($title_suffix); ?>
	  <div class="content clearfix"<?php print $content_attributes; ?>>
		<?php if(!empty($node->field_right_column)):?>
			<div class="main-content">
				<?php hide($content['field_right_column']); ?>
				 <?php print render($content);  ?>
	  		</div>
	  		<div class="sidebar">
	  			<?php show($content['field_right_column']); ?>
				<?php print render($content['field_right_column']); ?>
	  		</div>
		<?php else: ?>
			 <?php print render($content);  ?>
		<?php endif; ?>
	  </div>
  </div>
</div>