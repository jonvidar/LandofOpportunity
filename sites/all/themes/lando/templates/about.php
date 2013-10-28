<?php
/**
 * @file
 * LandofOpportunity theme implementation to display about template.
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
<section class="about">
	<img class="bg" width="1024" height="1862" src="<?php echo base_path() . path_to_theme(); ?>/images/img/about.jpg" alt="" />
	<div class="inner-content">
		<div class="slider">
			<?php $about_slides = module_invoke('views', 'block_view', 'about-block'); ?>
			<?php if (!empty ($about_slides['content'])) : ?>
				<?php print render($about_slides['content']); ?>
			<?php endif; ?>
		</div>
	</div>
</section>