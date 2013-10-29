<?php 
/*
* timeline template for frontend sections
* 
*/
?>
	<div id="compare" class="section-wrapper compare">
		<div class="section-inner">
			<section class="timeline section">
				<div class="timeline-wrapper">
					<a class="close" href="#">close</a>
					<div class="question">
						<div class="timeline-top">
							<h2>Sandy</h2>
							
							<img class="bg" width="1024" height="337" src="<?php echo drupal_get_path('theme', 'landofopportunity'); ?>/images/img/timeline-top.jpg" alt="" />
						</div>
						<div class="timeline-bottom">
							<h2>Katrina</h2>
							<img class="bg" width="1024" height="337" src="<?php echo drupal_get_path('theme', 'landofopportunity'); ?>/images/img/timeline-bottom.jpg" alt="" />
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
							  	foreach ( $terms as $term ) {
							 	  	print '<div class="sector"><h3>'.$term->name.'</h3></div>';
							   	} 
							?>				
							<?php $event_dots = landofopp_get_events(); ?>
							<?php if(!empty($event_dots)):?>
						    	<div class="dots">
						             <?php
						                foreach ($event_dots as $item) : 
						                  $event_item = node_load($item);
						              	  $event_position = $event_item->field_event_position['und'][0]['value'];
						                  print '<a class="dot" href="#" rel="event-'.$event_item->nid.'" style="left:'.$event_position.'%;">'.$event_item->title.'</a>';
						                endforeach;
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
		</div>
	</div>