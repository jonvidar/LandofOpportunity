<?php
/**
 * @file
 * LandofOpportunity theme implementation to display a front page.
 *
 * @see template_preprocess()
 * @see template_preprocess_page()
 * @see template_process()
 * @see lando_process_page()
 * @see html.tpl.php
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
<?php global $user; ?>
<div id="page-wrapper">
	<div id="home">
		<?php include('header.tpl.php'); ?>
	</div>
	<?php //section intro ?>
	<div class="section-wrapper intro">
		<div class="section-inner">
			<?php $featured_category = module_invoke('views', 'block_view', 'featured_category-block'); ?>
			<?php if (!empty ($featured_category['content'])) : ?>
				<?php print render($featured_category['content']); ?>
			<?php endif; ?>
		</div>
	</div>
	<?php //section info ?>
	<div class="section-wrapper info">
		<div class="section-inner">
			<?php if ($page['info']): ?>
				<section id="info" class="section">
					<img class="bg" width="1024" height="1862" src="<?php echo base_path().path_to_theme(); ?>/images/img/about.jpg" alt="" />
					<div class="inner-content">
						<?php print render($page['info']); ?>
					</div>
					 <div class="bottom-arrow"><a class="bottom" href="#dig-deeper">go</a></div>
				</section>
			<?php endif; ?>
		</div>
	</div>
	<?php //section dig deeper ?>
	<div class="section-wrapper dig-deeper" id="dig-deeper">
		<?php $sticky_categories = module_invoke('views', 'block_view', 'dig_deeper-listing'); ?>
		<?php if (!empty ($sticky_categories['content'])) : ?>
			<?php print render($sticky_categories['content']); ?>
		<?php endif; ?>
	</div>
	<?php //section timeline ?>
	<?php if (in_array('client administrator', array_values($user->roles))): ?>
		<div id="compare" class="section-wrapper compare">
			<div class="section-inner">
				<?php include('timeline.php') ?>
			</div>
		</div>
	<?php endif; ?>
	<?php //section about and get involved ?>
	<div class="scroll-wrapper">
		<div id="about" class="section-wrapper about">
			<div class="section-inner">
				<?php include('about.php') ?>
			</div>
		</div>
		<div id="get-involved" class="section-wrapper get-involved">
			<div class="section-inner">
				<?php include('get-involved.php') ?>
			</div>
		</div>
		<?php //section footer ?>
		<div id="footer">
			<div class="inner-content">
				<a class="logo" href="#home">Land of Opportunity</a>
				<div class="menu menu-clearfix">
					<div class="content">
						<ul class="right-menu">
							<li><a class="feedback" href="#feedback">feedback</a></li>
							<li><a class="email" href="mailto:ludant@joluproductions.com">email</a></li>
						</ul>
					</div>
				</div>
				<div class="menu menu-clearfix">
					<div class="content">
						<ul class="footer-menu">
							<li class="first">&copy; 2013 JoLu Productions. All rights reserved</li>
							<li><a href="#">Legal Information</a></li>
							<li><a class="feedback" href="#feedback">Feedback</a></li>
						</ul>
					</div>
				</div>
				<p class="copy">Site by <a href="http://uncharteddigital.com/">Uncharted</a></p>
			</div>
			<?php $feedback_form = module_invoke('webform', 'block_view', 'client-block-58'); ?>
			<?php if (!empty ($feedback_form['content'])) : ?>
				<div id="feedback">
					<h2><?php print render($feedback_form['subject']); ?></h2>
					<?php print render($feedback_form['content']); ?>
				</div>
			<?php endif; ?>
		</div>
	</div>
</div>
<?php // social login ?>
<?php if ($page['social_login']): ?>
	<div id="social-login">
		<?php print render($page['social_login']); ?>
	</div>
<?php endif; ?>
<div id="loader">&nbsp;</div>