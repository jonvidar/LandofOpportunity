<?php
/**
 * @file
 * LandofOpportunity theme implementation to display get involved template.
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
<section class="get-involved">
  <?php if ($page['front_donate']): ?>
    <div class="donate">
      <img class="bg" width="1024" height="633" src="<?php echo base_path() . path_to_theme(); ?>/images/img/donate.jpg" alt="" />
      <div class="inner-content">
        <?php print render($page['front_donate']); ?>
      </div>
    </div>
  <?php endif; ?>
  <?php if ($page['front_partners']): ?>
    <div class="partners">
      <div class="partners-inner">
        <img class="bg" width="1024" height="990" src="<?php echo base_path() . path_to_theme(); ?>/images/img/partners.jpg" alt="" />
        <div class="inner-content">
          <?php print render($page['front_partners']); ?>
          <div class="clearfix"></div>
          <?php $partners = module_invoke('views', 'block_view', 'partners-block'); ?>
          <?php if (!empty ($partners['content'])) : ?>
            <h2 class="partners">Current Partners / Funders</h2>
            <?php print render($partners['content']); ?>
          <?php endif; ?>
       </div>
      </div>
    </div>
  <?php endif; ?>  
</section>