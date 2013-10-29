<?php
/**
 * @file
 * LandofOpportunity theme implementation to display header template.
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
<header id="header">
	<div id="logo"><a href="#home" data-menu-top="0">Land of Opportunity</a><span class="beta"></span></div>
	<div class="menu menu-clearfix">
		<div class="content">
			<ul class="menu menu-clearfix">
				<li class="dig-deeper expanded">
					<a class="dig-deeper expanded" href="#dig-deeper" rel="#/dig-deeper">Dig Deeper</a>
					<?php $featured_categories = module_invoke('views', 'block_view', 'dig_deeper-menu'); ?>
					<?php if(!empty($featured_categories['content'])):?>
						<div class="drop">
							<?php print render($featured_categories['content']); ?>
							<a class="close" href="#">close</a>
						</div>
					<?php endif; ?>
				</li>
				<?php if (in_array('client administrator', array_values($user->roles))): ?>
					<li><a class="compare" href="#compare" rel="#/compare">Compare</a></li>
				<?php endif; ?>
				<li class="about expanded">
					<a class="about expanded" href="#about" rel="#/about">About</a>
					<div class="drop">
						<ul>&nbsp;</ul>
						<a class="close" href="#">close</a>
					</div>
				</li>
				<li><a class="get-involved" href="#get-involved" rel="#/get-involved">Get Involved</a></li>
			</ul>
		</div>
	</div>
	<div class="social-links menu-clearfix">
		<div class="content">
			<ul>
				<li><a class="twitter" href="http://twitter.com/LandofOpp">twitter</a></li>
				<li><a class="facebook" href="http://www.facebook.com/landofopportunity">facebook</a></li>
				<li><a id="search_button" class="search" href="#">search</a></li>
			</ul>
		</div>
	</div>
	<div class="shadow"></div>
</header>
<div id="type_to_search" class="hide">
	<a class="close" href="">close</a>
	<div class="container">
		<?php $block_search = module_invoke('landofopp', 'block_view', 'search'); ?>
		<?php $block_top_search = module_invoke('landofopp', 'block_view', 'top_search'); ?>
		<?php $block_top_search_content = render($block_top_search['content']); ?>
		<?php print render($block_search['content']); ?>
		<?php if ($block_top_search_content) : ?>
		<div class="related-search"></div>
		<div class="top-search">
			<h2>Top Searches:</h2>
			<?php print $block_top_search_content; ?>
		</div>
		<?php endif; ?>
	</div>
</div>