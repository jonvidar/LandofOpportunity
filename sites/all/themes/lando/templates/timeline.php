<?php
/**
 * @file
 * LandofOpportunity theme implementation to display timeline template.
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
<section class="timeline section">
  <div class="timeline-wrapper">
    <a class="close" href="#">close</a>
    <div class="question">
      <div class="timeline-top">
        <h2>Sandy</h2>
        <img class="bg" width="1024" height="337" src="<?php echo base_path() . path_to_theme(); ?>/images/img/timeline-top.jpg" alt="" />
      </div>
      <div class="timeline-bottom">
        <h2>Katrina</h2>
        <img class="bg" width="1024" height="337" src="<?php echo base_path() . path_to_theme(); ?>/images/img/timeline-bottom.jpg" alt="" />
      </div>
      <div class="text-wrapper">
        <div class="text">
          <h2>What if we could use our past to predict our future</h2>
          <a class="arrow" href="#predict">Learn More</a>
        </div>
      </div>
    </div>
    <div class="timeline">
      <div class="timeline-inner">
        <?php
          $vid = 3;
          $terms = taxonomy_get_tree($vid);
          foreach ($terms as $term) {
            print '<div class="sector"><h3> ' . $term->name . '</h3></div>';
          } 
        ?>        
        <?php $event_dots = loo_get_events(); ?>
        <?php if (!empty($event_dots)) :?>
          <div class="dots">
            <?php
              foreach ($event_dots as $item) {
                $event_item = node_load($item);
                $event_position = $event_item->field_event_position['und'][0]['value'];
                print '<a class="dot" href="#" rel="event-' . $event_item->nid . '" style="left:' . $event_position . '%;">' . $event_item->title . '</a>';
              }
            ?>
          </div>
        <?php endif; ?>
      </div>
    </div>
    <div class="dot-info-wrapper">
      <?php $timeline_events = module_invoke('views', 'block_view', 'events-block'); ?>
      <?php if (!empty ($timeline_events['content'])) : ?>
        <?php print render($timeline_events['content']); ?>
      <?php endif; ?>
    </div>
  </div>
</section>