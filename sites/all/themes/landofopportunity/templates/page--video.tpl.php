<?php
/**
 * @file
 * LandofOpportunity theme implementation to display a video RMV.
 *
 * @see template_preprocess()
 * @see template_preprocess_page()
 * @see template_process()
 * @see landofopportunity_process_page()
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
<div id="page">
  <?php print render($page['content']); ?>
  <?php if ($page['social_login']): ?>
      <div id="social-login">
        <?php print render($page['social_login']); ?>
      </div> <!-- /#footer -->
    <?php endif; ?>
</div> <!-- /#page, /#page-wrapper -->
