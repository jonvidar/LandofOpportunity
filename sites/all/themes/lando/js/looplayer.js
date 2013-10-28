/**
 * @file
 * LandofOpportunity looplayer js file. Descripe video player functionality.
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
var CurrentHash = '';
var looplayer = (function ($) {
	var pop, config, markers = {}, comments={}, cuemap = {} , paused = true, duration = 0, videoElement, drawershowing = false, commentsshowing = false, infoshowing=false, isfullscreen=false, markercommenthover = false, markerhover = false, timelinehover = false;
	var speedIn = 500, speedOut = 500;
	var textInputType = false;
	var timelinebarclick = nextvideoclick =false;
	var timeComment = 0;
	var showTrigger = false;
	var showInfo = false;
	var iOS = ( navigator.userAgent.match(/(iPad|iPhone|iPod)/g) ? true : false );
	var openSharebox = false;
	var markerInterval = 0;
	
	function handleCanplay(){
		
		var startTime = 0;
		
		var timepoint = $('#'+config.videoId).parents('.playervideo-box').attr('data-timepoint');
		
		if (typeof timepoint != 'undefined' ) {
			startTime = parseInt(timepoint);
		}
		showTrigger = false;
		// create the timeline dynamically from page content
		resizeVideo();
		config.interval = 0;
		config.timeline = {};
	
		// grab clip duration - cant do this until video ready to play

		duration = pop.duration();

		var total = secondsToHms(duration);
		var current = secondsToHms(pop.roundTime());
		
		$('#timebar span.total').text(total);
		$('#timebar span.current').text(current);
		
		
		if (iOS) {
			hideControls();
		}
		
		pop.on( 'timeupdate', handleTimeupdate);
		
		pop.on( 'pause', handlePauseOn);
		
		pop.on( 'play', handlePlayOn);
		
		if (typeof config.nextVideo != 'undefined' && config.nextVideo != '' ) {
			$('#next-video').html(config.nextVideo);
			pop.on( 'ended', handleEnded);
		} else {
			pop.on( 'ended', handleEndedVideo);
		}
		
		
		if (!iOS) handlePlay();
		
		
		if(typeof config.markers != 'undefined'){
			var markers_data = $.parseJSON(config.markers);
			markers = {};
			if (markers_data != 'undefined') {
				$.each(markers_data, function(index, element) {
					markers[index] = element;
				});
				
				addTimelineMarkers();
				if (startTime != 0 && !iOS) {
					rescanActiveStatusOfMarkers(startTime);
				}
			}
		}
		
		if(typeof config.comments != 'undefined'){
			var comments_data = $.parseJSON(config.comments);
			comments = {};
			if (comments_data != undefined && comments_data !='') {
				$.each(comments_data, function(index, element) {
					comments[index] = element;
				});
				addTimelineComments();
				if (startTime != 0 && !iOS) {
					rescanActiveStatusOfMarkers(startTime);
				}
			}
			
		}
		
		if(typeof config.videoInfo != 'undefined' && config.videoInfo != '' ){
			$('#videoInfo').show();
			$('#videoInfo div.video-container').html(config.videoInfo);
			$('#videoInfo div.video-container').append('<span class="doted" />');
			if ($('#videoInfo').find('div.tag').get(0)) {
				$('#videoInfo').addClass('hastag');
			} else {
				$('#videoInfo').removeClass('hastag');
			}
		} else {
			$('#videoInfo').hide();
			$('#videoInfo').removeClass('hastag');
		}
		
		HoverInfo();
		var has_timebar = false;
		
		
		if(typeof config.timelineBar != 'undefined' && config.timelineBar != ''){
			$('#timeline-bar').remove();
			$('#box-controls').before('<div id="timeline-bar"><div class="inner"></div>'+config.timelineBar+'</div>');
			var timelinePos = $('#timeline-bar').find('a').attr('data-position');
			$('#timeline-bar').addClass(timelinePos);
			TimelineBarClick();
			if ( timelinePos == 'bottom') has_timebar = true;
		}
		
		if(typeof config.commentForm != 'undefined' && config.commentForm != '' && config.commentForm !=  null){
			$('#comment-area').html(config.commentForm);
			$('#box-video').addClass('has-comment');
			if (has_timebar) $('#box-video').addClass('has-timebar');
			$('#comment-area').show();
			$('#comment-area').append('<div class="message" />');
		} else {
			$('#box-video').removeClass('has-comment');
			$('#box-video').removeClass('has-timebar');
		}
		
		
		
		if(typeof config.breadcrump != 'undefined' && config.breadcrump != ''){
			var breadcrump_title = config.breadcrump;
			breadcrump_title = breadcrump_title.replace(/"/g, '&quot;');
			$('#breadcrumps').append('<a  class="hint  hint--left" data-hint="'+breadcrump_title+'" data-fid="'+config.fid+'"><span>'+config.breadcrump+'</span></a>');
			if ($('#breadcrumps a').size() > 1) {
				$('#breadcrumps a:first').addClass('first');
				$('#breadcrumps').show();
			} else $('#breadcrumps').hide();
			$('#breadcrumps a').removeClass('active');
			$('#breadcrumps a:last').addClass('active');
			initBreadcrumpsLinks();
		}
		
		
		initPlayerComments();
		initSendEmail();
		initEmbedCode();
		
		
		$('#comment-area #btn-social').on('click',function(){
			$('#social-login').fadeIn(300);
			handlePlay();
			return false;
		});
		
		$('#box-video').chardinJs();

	}
	
	function openEmailBox(){
		hideEmbedBox();
		$('#videoInfo div.email-send input.form-text').val('');
		$('#videoInfo div.email-send').stop(true,true).fadeIn(300,function(){
			$('#videoInfo a.email').addClass('open');
		});
	}
	
	function showControls(){
		$('#box-controls, #comment-area, #videoInfo').css('visibility','visible');
	}
	
	function hideControls(){
		$('#box-controls, #comment-area, #videoInfo').css('visibility','hidden');
	}
	
	function hideEmailBox(){
		$('#videoInfo div.email-send').stop(true,true).fadeOut(300);
		$('#videoInfo div.email-send div.message-box').stop(true,true).fadeOut(300,function(){
			$('#videoInfo a.email').removeClass('open');
		});
	}
	
	function initSendEmail(){
		
		$('#videoInfo a.email').on('click',function(e){
			if(/chrom(e|ium)/.test(navigator.userAgent.toLowerCase())){ 
				var url = $(this).attr("href");
				mailtoOpen(url);
				return false;
			}
			
		});
		
		$('#videoInfo div.email-send form').submit(function(){
			var $form = $(this);
			textInputType = false;
			var type = $form.attr('method');
			var url = $form.attr('action');
			var data = $form.serialize()+'&is_ajax=1&send_email=1';
			var $box_message = $form.find('div.message-box');
			$.ajax({
				type: type,
				url: url,
				data: data,
				success: function(msg){
					$box_message.html(msg);
					$box_message.show();
					setTimeout(function(){
						hideEmailBox();
						$box_message.fadeOut(300,function(){
							$('#videoInfo div.email-send input.form-text').val('');
						});
						
						
					},3000);
				}
			});
			return false;
		});
	}
	
	function mailtoOpen(url) {
		var screenX    = typeof window.screenX != 'undefined' ? window.screenX : window.screenLeft,
		screenY      = typeof window.screenY != 'undefined' ? window.screenY : window.screenTop,
		outerWidth   = typeof window.outerWidth != 'undefined' ? window.outerWidth : document.body.clientWidth,
		outerHeight  = typeof window.outerHeight != 'undefined' ? window.outerHeight : (document.body.clientHeight - 22),
		width    = 500,
		height   = 270,
		left     = parseInt(screenX + ((outerWidth - width) / 2), 10),
		top      = parseInt(screenY + ((outerHeight - height) / 2.5), 10),
		features = 'width=' + width + ',height=' + height + ',left=' + left + ',top=' + top;
		var popupWindow = window.open(url,'mailto',features);
		popupWindow.close();
	}
	
	function openEmbedBox(){
		hideEmailBox();
		$('#videoInfo div.embed-code').stop(true,true).fadeIn(300,function(){
			$('#videoInfo a.embed').addClass('open');
		});
		$('#videoInfo div.embed-code').find('textarea').focus().select();
	}
	
	function hideEmbedBox(){
		$('#videoInfo div.embed-code').stop(true,true).fadeOut(300,function(){
			$('#videoInfo a.embed').removeClass('open');
		});
	}
	
	function initEmbedCode(){
		$('#videoInfo a.embed').on('click',function(){
			if (!$(this).hasClass('open')) {
				openEmbedBox();
			} else {
				hideEmbedBox();
			}
			return false;
		});
		
		$('#videoInfo div.email-send').find('textarea').on('focus',function(){
			openSharebox = true;
		});
		
		$('#videoInfo div.email-send').find('textarea').on('blur',function(){
			openSharebox = true;
		});
	}
	
	function initPlayerComments(){
		$('#comment-area label').bind('click',function(){
			$(this).next().focus();
		});
		$('#comment-area #edit-comment-body-und-0-value').bind('focus',function(){
			$(this).prev().css('opacity',0.5);
		});
		$('#comment-area #edit-comment-body-und-0-value').bind('blur',function(){
			$(this).prev().css('opacity',1);
		});
		$('#comment-area #edit-comment-body-und-0-value').bind("keyup", function(event, ui) {
			//$('#vidbox-comments-popup div.comment-form').css('opacity',1);
			textInputType = true;
			if ( $(this).val() === '') {
				$(this).prev().show();
			} else {
				$(this).prev().hide();
			}
			
			var time = 0;
			
			if (timeComment != 0) time = timeComment; else time = pop.roundTime();
			
			var hours = parseInt( time / 3600 ) % 24;
			minutes = parseInt( time / 60 ) % 60;
			seconds = Math.round(time % 60);

			var startHMS = hours + ':' + (minutes < 10 ? '0' + minutes : minutes) + ':' + (seconds	< 10 ? '0' + seconds : seconds);
		
			$('#comment-area #edit-field-time-und-0-value').val(startHMS);
			pop.pause();
		});
		
		var submitForm = true;
		$('#comment-area #comment-form').submit(function(){
			var $form = $(this);
			textInputType = false;
			var type = $form.attr('method');
			var url = $form.attr('action');
			var data = $form.serialize()+'&is_ajax=1';
			var $box_message = $form.next();
			if (submitForm) {
				submitForm = false;
				$.ajax({
					type: type,
					url: url,
					data: data,
					dataType:"json",
					cache:"false",
					success: function(data){
						addNewComment(data.comment);
						$form.find('#edit-comment-body-und-0-value').val('');
						$form.find('#edit-comment-body-und-0-value').prev().show();
						pop.play();
						submitForm = true;
						
						//update comments
						var comments  = JSON.stringify(data.comments);
						var $videoBox = $('#'+config.videoId).parents('.playervideo-box');
						$videoBox.find('div.comments').attr('data-comments',comments);
					
					}
				});
			}
			
			return false;
		});
		
	}
	
	
	function addNewComment(comment){
		
		if ($('#vidbox-markers div.marker-comment[data-timepoint='+comment.seconds+']').get(0)) {
			var cnid = $('#vidbox-markers div.marker-comment[data-timepoint='+comment.seconds+']').attr('data-id');
			var popupID = 'comment-'+cnid;
			$('#'+popupID).append('<div class="comment-item"></div>');
			console.log(comment);
			//add body
			if(typeof comment.body != 'undefined') {
				$('#'+popupID).find('.comment-item:last').append('<p>'+comment.body+'</p>');
			}
			//add author
			if(typeof comment.author != 'undefined') {
				$('#'+popupID).find('.comment-item:last').append('<span class="author">-'+comment.author+'</span>');
			}
			
			initScrollComment();
			
			
		} else {
			destroyScrollComment();
			var popupID = 'comment-'+comment.cid;
			var popup_html = '<div id="'+popupID+'" class="comment"></div>';
			$('#vidbox-comments-popup div.comments-box').append(popup_html);
			cuemap[comment.seconds] = comment.cid;
			addComment(comment,comment.seconds);
			$('#'+popupID).append('<div class="comment-item"></div>');
			//add body
			if(typeof comment.body != 'undefined') {
				$('#'+popupID).find('.comment-item:last').append('<p>'+comment.body+'</p>');
			}
			//add author
			if(typeof comment.author != 'undefined') {
				$('#'+popupID).find('.comment-item:last').append('<span class="author">-'+comment.author+'</span>');
			}
			hoverTimelineMarkerComment();
		}
	}
	
	function showGradient(){
		$('#videoInfo').addClass('hover');
		$('#gradient-info').stop(true,true).fadeIn(speedIn,function(){
			$('#videoInfo').addClass('hover');
		});
	}
	
	function hideGradient(){
		$('#videoInfo').removeClass('hover');
		$('#gradient-info').stop(true,true).fadeOut(speedOut,function(){
			$('#videoInfo').removeClass('hover');
		});
	}
	
	
	function initBreadcrumpsLinks(){
		$('#breadcrumps a').unbind('click');
		
		$('#breadcrumps a').bind('click',function(){
			var size = $('#breadcrumps a').size();
			var index = $('#breadcrumps a').index($(this));
			if (index != size - 1) {
				if ($.browser.msie) {
					initSectionIE($(this).attr('data-fid'));
				} else {
					initSection($(this).attr('data-fid'));
				}
				
				if (index == 0) clearHashTrigger();
			}
			return false;
		});
	}
	
	function handleEnded(){
		handleEndedProgressBar();
		$('#next-video').show();
		
		$('#next-video a.video').on('click',function(){
			$('#next-video').hide();
			nextvideoclick = true;
			var url = $(this).attr('href');
			var hash_url = url.replace(Drupal.settings.basePath,'');
			changeHashUrl(hash_url);
			AjaxLoadNextVideo(url,'');
			clearInterval(counter);
			return false;
		});
		
		var count = 0;

		var counter=setInterval(timer, 1000); //1000 will  run it every 1 second

		function timer()
		{
			count++;
			$('#countdown').removeClass().addClass('section-'+count);
			if (count > 8)
			{
				clearInterval(counter);
				$('#next-video a.video').trigger('click');
				return;
			}
		}
	}
	
	function handleEndedVideo(){
		handleEndedProgressBar();
		var size = $('#breadcrumps a').size();
		
		if (size == 1) return;
		
		var fid = $('#breadcrumps a').eq(-2).attr('data-fid');
		var html = $('#box-video').find('div.videos').find('div.playervideo-box[data-fid='+fid+']').find('div.current-video').html();
		$('#previous-video').append('<div class="text">'+html+'</div>');
		$('#previous-video').show();
		
		$('#previous-video a.video').on('click',function(){
			$('#previous-video').hide();
			$('#previous-video').find('div.text').remove();
			$('#breadcrumps a').eq(-2).click();
			clearInterval(counter);
			return false;
		});
		
		var count = 0;

		var counter=setInterval(timer, 1000); //1000 will  run it every 1 second

		function timer()
		{
			count++;
			$('#countdown-video').removeClass().addClass('section-'+count);
			if (count > 8)
			{
				clearInterval(counter);
				$('#previous-video a.video').trigger('click');
				return;
			}
		}
	}
	
	function initControls(){
		
		//click info help
		$('#box-help a').bind('click',function(){
			$('#box-video').data('chardinJs').toggle();
			return false;
		});
		
		$('#box-video').on('chardinJs:start', function(){
			pop.pause();
		});
		
		$('#box-video').on('chardinJs:stop', function(){
			pop.play();
		});
		
		//click pauseplay
		$('#box-pauseplay a').bind('click',function(){
			handlePlay();
			return false;
		});
		
		// click fullscreen
		$('#box-fullscreen a').bind('click',function() {
			if (!iOS) {
				toggleFullScreen();
				$(this).toggleClass('fullscreen');
			}
			return false;
		});
		
		$('#player-logo').bind('click',function(){
			if ($('#box-video').hasClass('iframe')) {
				var url = $(this).attr('data-url');
				window.open(url);
			}
			return false;
		});
		
		$(window).resize(function(){
			resizeVideo();
			combineMarkers();
			combineComments();
		});
		
		
		
		$('#videoInfo').on('mouseleave',function(){
			if (drawershowing == false && openSharebox == false) {
				infoshowing = false;
				hideGradient();
				hideEmailBox();
				hideEmbedBox();
				$('#videoInfo div.content-body').stop(true,true).slideUp(function(){
					$('#videoInfo').removeClass('hover');
				});
			}
			
		});	
		
		if (iOS) {
			$('#videoInfo, #box-video').addClass('ios');
			$('#videoInfo').append('<a class="openInfo" href="#">Open</a>');
			$('#videoInfo a.openInfo').on('touchstart',function(e){
				if (!$('#videoInfo').hasClass('hover')) {
					hideDraweComment();
					showGradient();
					$('#videoInfo').addClass('hover');
					$('#videoInfo div.content-body').stop(true,true).slideDown(function(){
						if (iOS) {
							showInfo = true;
							resizeVideo();
						}
						
					});
				} else {
				
					hideGradient();
					$('#videoInfo div.content-body').stop(true,true).slideUp(function(){
						$('#videoInfo').removeClass('hover');
						if (iOS) {
							showInfo = false;
							resizeVideo();
						}
					});
				}
				return false;
			});
			
		}
		
		$('#vidbox-markers-popup').on('mouseleave',function(){
			
			if (!markerhover) {
				hideDrawer();
			}
			
		});
		
		$('#vidbox-comments-popup').on('mouseleave',function(){
			hideDraweComment();
			timeComment = 0;
		});
		
		$('#timeline-wrap-inner').on('touchstart',function(e){
			var xPos = e.originalEvent.touches[0].pageX;
			var width = $(this).width();
			var x = xPos - $(this).offset().left;
			var time = parseFloat((x / width) * duration).toFixed(2);

			pop.currentTime(time);
			rescanActiveStatusOfMarkers(time);
			hideDrawer();
			
			return false;
		});
		
		// click on progress bar
		$('#timeline-wrap-inner').on('click',function(e){
			var width = $(this).width();
			var x = e.pageX - $(this).offset().left;
			var time = parseFloat((x / width) * duration).toFixed(2);

			pop.currentTime(time);
			rescanActiveStatusOfMarkers(time);
			hideDrawer();
			
		});
		
		$('#vidbox-markers').append('<div class="timecode"></div>');

		// hover on progress bar
		$('#timeline-wrap-inner').on('mouseenter',function(e){
			var el = this;
			if (!markerhover) {
				timelinehover = true;
				var width = $(el).width();
				var x = e.pageX - el.offsetLeft;
				var time = parseFloat((x / width) * duration).toFixed(0);
				showTimePopup(x,time);
				
			} else {
				hideTimePopup();
			}
			
		});
		
		
		$('#timeline-wrap-inner').on('mousemove',function(e){
			var el = this;
			if (!markerhover) {
				hideDrawer();
				hideDraweComment();
				timeComment = 0;
				$('#comment-area #edit-comment-body-und-0-value').prev().text('Add a comment...');
				$('#comment-area #comment-form').show();
				$('#comment-area div.message').hide();
				
				timelinehover = true;
				var width = $(el).width();
				var x = e.pageX - el.offsetLeft;
				var time = parseFloat((x / width) * duration).toFixed(0);
				showTimePopup(x,time);
			} else {
				hideTimePopup();
			}
		});
		
		
		
		$('#timeline-wrap-inner').on('mouseleave',function(){
			timelinehover = false;
			hideTimePopup();
		});
		
		$('#social-login div.block').on('click',function(e){
			e.stopPropagation();
		});
		
		
		$('#social-login .block a.facebook-action-connect,#social-login .block a.twitter-signin-popup').on('click',function(){
			$('#social-login .block-fboauth,#social-login .block a.twitter-signin-popup').hide();
			$('#social-login div.continue').show();
		});
		
		$('#social-login div.continue a').on('click',function(){
			looplayer.getUser();
			return false;
		});
		
		
		$('#social-login').on('click',function(){
			$(this).fadeOut(300,function(){
				$('#social-login .block-fboauth,#social-login .block a.twitter-signin-popup').show();
			});
			handlePlay();
			return false;
		});
	}
	
	function HoverInfo(){
		$('#videoInfo span.doted').on('mouseenter',function(e){
			if (drawershowing == false) {
				infoshowing = true;
				setTimeout(function(){
					if (infoshowing) {
						hideDraweComment();
						showGradient();
						$('#videoInfo').addClass('hover');
						$('#videoInfo div.content-body').stop(true,true).slideDown();
					}
					
				},0);
				
			}
		});
	}
	
	
	function showTimePopup(x,seconds){
		var $timecode = $('#vidbox-markers div.timecode');
		var time =secondsToHms(seconds);
		$timecode.css({
			'left': x + 'px',
			'display' : 'inline-block'
		});
		$timecode.html(time);
	}
	
	function hideTimePopup(){
		var $timecode = $('#vidbox-markers div.timecode');
		$timecode.hide();
	}
	
	function addTimelineMarkers(){
		
		var markerspopup = $('#vidbox-markers-popup');
		for(i in markers) {
			marker = markers[i];
			var seconds = hmsToSecondsOnly(marker.time);
			var popupID = 'popup-'+marker.nid;
			var popup_html = '<div id="'+popupID+'" class="popup"></div>';
			markerspopup.append(popup_html);
			$('#'+popupID).append('<div class="text" />');
			
			//add title
			if(typeof marker.title != 'undefined') {
				$('#'+popupID).find('div.text').append('<h2>'+marker.title+'</h2>');
			}
			//add what
			if(typeof marker.what != 'undefined' && marker.what != '') {
				$('#'+popupID).find('div.text').append('<div class="item"><p>'+marker.what+'</p></div>');
			}
			
			//add why
			if(typeof marker.why != 'undefined' && marker.why != '') {
				$('#'+popupID).find('div.text').append('<div class="item"><p>'+marker.why+'</p></div>');
			}
			//add tags
			if(typeof marker.tags != 'undefined') {
				$('#'+popupID).find('div.text').append('<div class="tags" />');
				$.each(marker.tags, function(index, element) {
					$('#'+popupID).find('div.tags').append('<a href="">'+element+'</a>');
				});
			}
			//add preview
			if(typeof marker.preview != 'undefined' &&  marker.preview != '') {
				$('#'+popupID).prepend('<div class="image"><img width="400" src="'+marker.preview+'" /></div>');
			}
			
			//add video
			if(typeof marker.video != 'undefined' && marker.video != '') {
				$('#'+popupID).prepend('<a class="video media" href="'+ marker.video+'">Video</a>');
			}
			//add image
			else if(typeof marker.image != 'undefined' && marker.image != '') {
				$('#'+popupID).prepend('<a class="photo media" href="'+ marker.image+'">Image</a>');
			}
			//add image
			else if(typeof marker.flickr != 'undefined' && marker.flickr != '') {
				$('#'+popupID).prepend('<a class="flickr media" href="'+ marker.flickr+'">Image</a>');
			}
			//add url
			else if(typeof marker.url != 'undefined' && marker.url != '') {
				$('#'+popupID).prepend('<a class="url media" href="'+ marker.url+'">Url</a>');
			}
			
			//add pdf
			else if(typeof marker.pdf != 'undefined' && marker.pdf != '') {
				$('#'+popupID).prepend('<a class="pdf media" href="'+ marker.pdf+'">Pdf</a>');
			}
			
			
			//add audio
			else if(typeof marker.audio != 'undefined' && marker.audio != '') {
				$('#'+popupID).prepend('<a class="audio media" href="'+ marker.audio+'">Audio</a>');
			}
			
			if (iOS) {
				$('#'+popupID).append('<a href="" class="close-btn">close</a>')
			}
			
			
			config.timeline[i] = {};
			config.timeline[i].time = seconds;
			config.timeline[i].type = marker.type;
			cuemap[seconds] = marker.nid;
			addMarker(marker,seconds);
			
			
		}
		
		combineMarkers();
		hoverTimelineMarker();
		clickLinks();
		
	}
	
	function addTimelineComments(){
		var commentspopup = $('#vidbox-comments-popup div.comments-box');
		
		for(i in comments) {
			
			items = comments[i];
			comment = items[0];
			var seconds = hmsToSecondsOnly(comment.time);
			var popupID = 'comment-'+comment.cid;
			var popup_html = '<div id="'+popupID+'" class="comment"></div>';
			var size = items.length;
			commentspopup.append(popup_html);
			config.timeline[i] = {};
			config.timeline[i].time = seconds;
			config.timeline[i].type = 'comment';
			cuemap[seconds] = comment.cid;
			addComment(comment,seconds);
			for (j in items) {
				element = items[j];
				$('#'+popupID).append('<div class="comment-item"></div>');
				//add body
				if(typeof element.body != 'undefined') {
					$('#'+popupID).find('.comment-item:last').append('<p>'+element.body+'</p>');
				}
				//add author
				if(typeof element.author != 'undefined') {
					$('#'+popupID).find('.comment-item:last').append('<span class="author">-'+element.author+'</span>');
				}
				
			}
			
			
		}
		
		hoverTimelineMarkerComment();
		combineComments();
	}
	
	function combineMarkers(){
		var markerWidth = parseInt($('#vidbox-markers div.info-marker').width())+10;
		var timelineWidth = parseInt($('#timeline-wrap-inner').width());
		var secondWidth = parseFloat(timelineWidth / duration).toFixed(2);
		
		var interval = 10;
		
		var  markerSecond = Math.ceil(markerWidth / secondWidth);
		
		if (markerSecond > interval) interval = markerSecond;
		
		
		if (markerInterval != interval) {
			
			markerInterval = interval;
			var startTime = 0;
			var start_index = end_index = 0;
			
			var wrapedMarkers = function(start,end){
				if (start != end) {
					$('#vidbox-markers .marker').slice(start,(end+1)).wrapAll('<div class="marker-group" data-group="'+(start+1)+'-'+(end+1)+'" />');
					$('#vidbox-markers .marker:eq('+start+')').addClass('active-group');
					$('#vidbox-markers-popup .popup').slice(start,(end+1)).wrapAll('<div class="popup-group" id="group-'+(start+1)+'-'+(end+1)+'" ><div class="slide-body"></div></div>');
					
				}
			};
			
			if ($('#vidbox-markers .marker-group').get(0)) {
				$('#vidbox-markers .marker.active-group').unwrap('<div class="marker-group" />'); 
			}
			
			$('#vidbox-markers-popup .popup-group').each(function(){
				var $popup_group = $(this);
				if ($popup_group.attr('cycle-init') == 1) {
					$popup_group.find('div.slide-body').cycle('destroy');
				}
				$popup_group.find('div.pager-trigger').remove();
				$popup_group.find('.popup').unwrap('<div class="slide-body" />');
				$popup_group.find('.popup').unwrap('<div class="popup-group" />');
			});
				
			$('#vidbox-markers .marker').removeClass('active-group');
			 
			var size = $('#vidbox-markers .marker').size();
			$('#vidbox-markers .marker').each(function(i,marker){
				var currentInterval;
				var currentTime = $(marker).attr('data-timepoint');
				if (startTime == 0) {
					startTime = currentTime;
					start_index = i;
					end_index = i;
				} else {
					currentInterval = currentTime - startTime;
					if ((currentTime - startTime) <= interval ){
						end_index = i;
					} else {
						wrapedMarkers(start_index,end_index);
						startTime = currentTime;
						start_index = end_index = i;
					}
				}
				
				if ((size - 1) == i) wrapedMarkers(start_index,end_index);
			});
			
		}
	}
	
	function combineComments(){
		var markerWidth = parseInt($('#vidbox-markers div.marker-comment').width())+10;
		var timelineWidth = parseInt($('#timeline-wrap-inner').width());
		var secondWidth = parseFloat(timelineWidth / duration).toFixed(2);
		
		var interval = 10;
		
		var  markerSecond = Math.ceil(markerWidth / secondWidth);
		
		if (markerSecond > interval) interval = markerSecond;
		
		var startTime = 0;
		var start_index = end_index = 0;
		var wrapedMarkers = function(start,end){
			if (start != end) {
				$('#vidbox-markers .marker-comment').slice(start,(end+1)).wrapAll('<div class="marker-group-comment" data-group="'+(start+1)+'-'+(end+1)+'" />');
				$('#vidbox-markers .marker-comment:eq('+start+')').addClass('comment-group');
			}
		};
		
		if ($('#vidbox-markers .marker-group-comment').get(0)) {
			$('#vidbox-markers .marker-comment.comment-group').unwrap('<div class="marker-group-comment" />'); 
		}
		
		$('#vidbox-markers .marker-comment').removeClass('comment-group');
		
		var size = $('#vidbox-markers .marker-comment').size();
		$('#vidbox-markers .marker-comment').each(function(i,marker){
			var currentInterval;
			var currentTime = $(marker).attr('data-timepoint');
			if (startTime == 0) {
				startTime = currentTime;
				start_index = i;
				end_index = i;
			} else {
				currentInterval = currentTime - startTime;
				if ((currentTime - startTime) <= interval ){
					end_index = i;
				} else {
					wrapedMarkers(start_index,end_index);
					startTime = currentTime;
					start_index = end_index = i;
				}
			}
			
			if ((size - 1) == i) wrapedMarkers(start_index,end_index);
		});
		
	}
	
	function getParameterByName(name) {
		name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
		var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
		results = regex.exec(location.search);
		return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
	}
	
	function clickLinks(){
		$('#vidbox-markers-popup .popup h2, #vidbox-markers-popup .popup .image img').on('click',function(){
			$(this).parents('div.popup').find('a.media').click();
		}).css('cursor','pointer');
		
		
		
		// open photo links
		$('#vidbox-markers-popup .popup a.photo').fancybox({
			fitToView	: false,
			width		: '90%',
			height		: '90%',
			autoSize	: false,
			padding		: 30,
			closeClick	: false,
			openEffect	: 'none',
			closeEffect	: 'none',
			beforeLoad : function(){
				var popup_id = $(this.element).parents('div.popup').attr('id');
				var title = $(this.element).parents('.popup').find('h2').text();
				popup_id = popup_id.replace('popup-','');
				setHashTrigger(popup_id);
				TrackTrigger(title);
				pop.pause();
			},
			afterClose : function(){
				pop.play();
				clearHashTrigger();
			}
		});
		
		// open flickr links
		$('#vidbox-markers-popup .popup a.flickr').fancybox({
			fitToView	: false,
			type		: 'ajax',
			padding		: 30,
			width		: '840',
			height		: '510',
			autoSize	: false,
			closeClick	: false,
			openEffect	: 'none',
			closeEffect	: 'none',
			beforeLoad : function(){
				var popup_id = $(this.element).parents('div.popup').attr('id');
				var title = $(this.element).parents('.popup').find('h2').text();
				popup_id = popup_id.replace('popup-','');
				setHashTrigger(popup_id);
				TrackTrigger(title);
				pop.pause();
			},
			afterClose : function(){
				pop.play();
				clearHashTrigger();
			}
		});
		
		// open iframe and pdf links
		$('#vidbox-markers-popup .popup a.url, #vidbox-markers-popup .popup a.pdf').fancybox({
			type		: 'iframe',
			fitToView	: false,
			width		: '90%',
			height		: '90%',
			padding		: 30,
			autoSize	: false,
			closeClick	: false,
			openEffect	: 'none',
			closeEffect	: 'none',
			iframe : {
				preload: false
			},
			beforeLoad : function(){
				var popup_id = $(this.element).parents('div.popup').attr('id');
				var title = $(this.element).parents('.popup').find('h2').text();
				popup_id = popup_id.replace('popup-','');
				setHashTrigger(popup_id);
				TrackTrigger(title);
				pop.pause();
			},
			afterClose : function(){
				pop.play();
				clearHashTrigger();
			}
		});
		
		// open audio links
		$('#vidbox-markers-popup .popup a.audio').fancybox({
			type : 'ajax',
			fitToView	: false,
			width		: '640',
			height		: '166',
			padding		: 30,
			autoSize	: false,
			closeClick	: false,
			openEffect	: 'none',
			closeEffect	: 'none',
			beforeLoad : function(){
				var popup_id = $(this.element).parents('div.popup').attr('id');
				var title = $(this.element).parents('.popup').find('h2').text();
				popup_id = popup_id.replace('popup-','');
				setHashTrigger(popup_id);
				TrackTrigger(title);
				pop.pause();
			},
			afterClose : function(){
				pop.play();
				clearHashTrigger();
			}
		});
		
		// open video links
		$('#vidbox-markers-popup .popup a.video').on('click',function(){
			var url = $(this).attr('href');
			var title = $(this).parents('.popup').find('h2').text();
			var popup_id = $(this).parents('div.popup').attr('id');
			popup_id = popup_id.replace('popup-','');
			setHashTrigger(popup_id);
			TrackTrigger(title);
			hideDrawer();
			AjaxLoadNextVideo(url,title);

			return false;
		});
		
		
		$('#vidbox-markers div.marker').on('click',function(){
			
			var marker_id = $(this).attr('data-id');
			if ($(this).hasClass('active')) {
				$('#popup-'+marker_id).find('a.media').click();
			} else {
				var timepoint = $(this).attr('data-timepoint');
				pop.currentTime(timepoint);
				rescanActiveStatusOfMarkers(timepoint);
			}
			
			return false;
		});
		
		// open trigger by id
		setTimeout(function(){
			if (typeof config.trigger_id != 'undefined') {
				var timepoint = $('#marker-'+config.trigger_id).attr('data-timepoint');
				pop.currentTime(timepoint);
				rescanActiveStatusOfMarkers(timepoint);
				$('#popup-'+config.trigger_id).find('a.media').click();
			}
		},300);
		
		
		$('#vidbox-markers-popup .popup .tags a').on('click',function(){
			pop.pause();
		});
		
		$('#vidbox-markers-popup div.popup a.close-btn').on('touchstart',function(){
			hideDrawer();
			return false;
		});
		
	}
	
	function setHashTrigger(id){
		var current_hash = window.location.hash;
		current_hash = unescape(current_hash);
		var hashes = current_hash.split("#/");
		var count = hashes.length;
		if (count == 2) {
			window.location.hash = current_hash + '#/'+id;
			CurrentHash = current_hash + '#/'+id;
		}
	}
	
	function changeHashUrl(url) {
		var current_hash = '#/'+url;
		window.location.hash = current_hash;
		CurrentHash = current_hash;
	}
	
	function clearHashTrigger(){
		var sizeBreadcrumps = $('#breadcrumps a').size();
		if (sizeBreadcrumps > 1) return;
		var current_hash = window.location.hash;
		current_hash = unescape(current_hash);
		var hashes = current_hash.split("#/");
		var count = hashes.length;
		var hash = '';
		for (i=1; i<count-1; i++){
			hash = '#/' + hashes[i];
		}
		window.location.hash = hash;
		CurrentHash = hash;
		
	}
	
	function AjaxLoadNextVideo(url,title){
		var iframe_data = '';
		if ($('#box-video').hasClass('iframe')) {
			iframe_data = '&iframe_mode=1';
		}
		showTrigger = false;
		$.fancybox.showLoading();
		$.ajax({
			url : url,
			data : 'is_ajax=1&player_show=1'+iframe_data,
			success : function(msg){
				
				var $videos = $('#'+config.videoId).parents('div.videos');
				$videos.append('<div class="playervideo-box">'+msg+'</div>');
				
				//remove all triggers and content
				
				var timepoint = pop.roundTime();
				
				pop.pause();
				$('#vidbox-progress').width(0);
				pop.destroy();
				$('#'+config.videoId).parents('div.playervideo-box').attr('data-timepoint',timepoint);
				$('#'+config.videoId).parents('div.playervideo-box').hide();
				$('#vidbox-markers > div.marker-group-comment').remove();
				$('#vidbox-markers > div.marker-comment').remove();
				$('#vidbox-markers > div.marker-group').remove();
				$('#vidbox-markers > div.marker').remove();
				
				$('#vidbox-markers-popup > *').remove();
				$('#videoInfo div.video-container > *').remove();
				$('#vidbox-comments-popup div.comments-box > *').remove();
				//$('#vidbox-comments-popup div.comment-form > *').remove();
				$('#comment-area > *').remove();
				$('#comment-area').hide();
				$('#box-video').removeClass('has-comment');
				$('#box-video').removeClass('has-timebar');
				
				
				var $currentVideo = $videos.find('.playervideo-box:last')
				var videoId  =  $currentVideo.find('.video-id').attr('data-id');
				var $video = $currentVideo.find('#'+videoId);
				var fid =$video.attr('data-fid');
				$videos.find('.playervideo-box:last').attr('data-fid',fid);
				
				$video.css('visibility','hidden');
				markerInterval = 0;
				paused = true;
				config = {};
				markers = {};
				comments = {};
				cuemap = {}; 
				config.videoId = videoId;
				config.fid = fid;
				if ($currentVideo.find('div.markers').get(0)) {
					config.markers = $currentVideo.find('div.markers').attr('data-markers');
				}
				
				if ($currentVideo.find('div.video-info').get(0)) {
					config.videoInfo = $currentVideo.find('div.video-info').html();
					config.breadcrump =  $currentVideo.find('div.video-info h2').text();
				} else {
					config.breadcrump =  title;
				}
				
				if (timelinebarclick) {
					$('#breadcrumps').html('');
					config.timelineBar =  $currentVideo.find('div.timeline').html();
					timelinebarclick = false;
				}
				
				if (nextvideoclick) {
					$('#breadcrumps').html('');
					$videos.find('.playervideo-box:not(:last)').remove();
					nextvideoclick = false;
				}
				
				if ($currentVideo.find('div.comments').get(0)) {
					config.comments = $currentVideo.find('div.comments').attr('data-comments');
				}
				
				if ($currentVideo.find('div.comment-form').get(0)) {
					config.commentForm = $currentVideo.find('div.comment-form').html();
				}
				
				if ($currentVideo.find('div.next-video').get(0)) {
					config.nextVideo =  $currentVideo.find('div.next-video').html();
				}
				
				if ($currentVideo.find('div.previous-video').get(0)) {
					config.previousVideo =  $currentVideo.find('div.previous-video').html();
				}
				
				if ($('#'+videoId).hasClass('youtube')) {
					url = $('#'+videoId).attr('data-url')+'&controls=0&rel=0&showinfo=0';
					pop = Popcorn.youtube( '#'+videoId,url);
					if (!iOS) pop.play();
				} else if ($('#'+videoId).hasClass('vimeo')) {
					url = $('#'+videoId).attr('data-url');
					pop = Popcorn.vimeo( '#'+videoId,url);
					if (!iOS) pop.play();
				} else {
					pop = Popcorn( '#'+videoId);
				}
				
				if (iOS) {
					$.fancybox.hideLoading();
					hideControls();
					resizeVideo();
				}
				
				if ( $.browser.msie ) { 
					resizeVideo();
				}
				
				if (pop.duration()) {
					$.fancybox.hideLoading();
					handleCanplay();
				} else {
					pop.on('loadedmetadata', function() {
						$.fancybox.hideLoading();
						handleCanplay();
					});
				}
				
			}
		});	
	}
	
	
	function TimelineAnimate(){
		if ($('#timeline-bar').hasClass('top')) {
			var height = 69;
			var allHeight = 137;
			var top = parseInt($(window).height()) - (height + 20);
			$('#timeline-bar').css('top',(height - allHeight) +'px').removeClass();
			$('#timeline-bar').find('.inner').css('top',(allHeight - height) +'px');
			$('#timeline-bar').find('a').addClass('top').css('margin-top',(allHeight - height + 10) +'px');
			$('#timeline-bar').animate({top : top},speedIn,function(){
				$('#timeline-bar').addClass('bottom').css('top','auto');
				$('#timeline-bar').find('.inner').css('top','auto');
				$('#timeline-bar').find('a').css('margin-top','39px').removeClass('top');
			});
		} else {
			var height = 69;
			var allHeight = 137;
			var bottom = parseInt($(window).height()) - (height + 20);
			$('#timeline-bar').css('bottom',(height - allHeight + 20) +'px').removeClass();
			$('#timeline-bar').find('.inner').css('bottom',(allHeight - height) +'px');
			$('#timeline-bar').find('a').css('margin-top','39px');
			$('#timeline-bar').animate({bottom : bottom},speedIn,function(){
				$('#timeline-bar').addClass('top').css('bottom','auto');
				$('#timeline-bar').find('a').css('margin-top','10px');
				$('#timeline-bar').find('.inner').css('bottom','auto');
			});
		}
	}
	
	function TimelineBarClick(){
		timelinebarclick = false;
		$('#timeline-bar a').on('click',function(){
			var url = $(this).attr('href');
			var title = '';
			var datafid = $(this).attr('data-fid');
			timelinebarclick = true;
			var video_exist = false;
			if ($('#box-video div.videos div.playervideo-box[data-fid='+datafid+']').get(0)) {
				video_exist = true;
			}
			//pause and hide video
			pop.pause();
			$('#'+config.videoId).parents('div.playervideo-box').hide();
			
			TimelineAnimate();
			if (video_exist) {
				setTimeout(function(){
					if ($.browser.msie) {
						initSectionIE(datafid);
					} else {
						initSection(datafid);
					}
					
				},speedIn);
				
			} else {
				
				setTimeout(function(){
					AjaxLoadNextVideo(url,title);
				},speedIn);
				
			}
			
			return false;
		});
	}
	
	function initSectionIE(fid){
		
		
		$('#breadcrumps a[data-fid='+fid+']').nextAll().andSelf().remove();
		var $videos = $('#box-video').find('div.videos');
		var $videoBox = $videos.find('.playervideo-box[data-fid='+fid+']');
		var url = $videoBox.find('.node-video-id').attr('data-url');
		
		pop.pause();
		pop.destroy();
		
		var timepoint = $videoBox.attr('data-timepoint');
		
		if (timelinebarclick) {
			url = $('#timeline-bar a[data-fid='+fid+']').attr('href');
			$videoBox.nextAll().andSelf().remove();
			console.log(url);
		} else {
			$videoBox.nextAll().andSelf().remove();
		}
		
		var iframe_data = '';
		if ($('#box-video').hasClass('iframe')) {
			iframe_data = '&iframe_mode=1';
		}
		
		$.ajax({
			url : url,
			data : 'is_ajax=1&player_show=1'+iframe_data,
			success : function(msg){
				$videos.append('<div class="playervideo-box">'+msg+'</div>');
				
				//remove all triggers and content
				
				$('#vidbox-progress').width(0);
			
				$('#vidbox-markers  > div.marker-comment').remove();
				$('#vidbox-markers  > div.marker-group').remove();
				$('#vidbox-markers > div.marker-group-comment').remove();
				$('#vidbox-markers  > div.marker').remove();
				
				$('#vidbox-markers-popup > *').remove();
				$('#videoInfo div.video-container > *').remove();
				$('#vidbox-comments-popup div.comments-box > *').remove();
				$('#comment-area > *').remove();
				$('#comment-area').hide();
				$('#box-video').removeClass('has-comment');
				$('#box-video').removeClass('has-timebar');
				
				
				var $currentVideo = $videos.find('.playervideo-box:last')
				var videoId  =  $currentVideo.find('.video-id').attr('data-id');
				var $video = $currentVideo.find('#'+videoId);
				var fid =$video.attr('data-fid');
				$videos.find('.playervideo-box:last').attr('data-fid',fid);
				
				
				
				$video.css('visibility','hidden');
				
				markerInterval = 0;
				paused = true;
				config = {};
				markers = {};
				comments = {};
				cuemap = {}; 
				config.videoId = videoId;
				config.fid = fid;
				if ($currentVideo.find('div.markers').get(0)) {
					config.markers = $currentVideo.find('div.markers').attr('data-markers');
				}
				
				if ($currentVideo.find('div.video-info').get(0)) {
					config.videoInfo = $currentVideo.find('div.video-info').html();
					config.breadcrump =  $currentVideo.find('div.video-info h2').text();
				} 
				
				if (timelinebarclick) {
					//config.breadcrump = '';
					$('#breadcrumps a').remove();
					config.timelineBar =  $currentVideo.find('div.timeline').html();
					timelinebarclick = false;
				}
				
				if (nextvideoclick) {
					$('#breadcrumps').html('');
					nextvideoclick = false;
				}
				
				if ($currentVideo.find('div.comments').get(0)) {
					config.comments = $currentVideo.find('div.comments').attr('data-comments');
				}
				
				if ($currentVideo.find('div.comment-form').get(0)) {
					config.commentForm = $currentVideo.find('div.comment-form').html();
				}
				
				if ($currentVideo.find('div.previous-video').get(0)) {
					config.previousVideo =  $currentVideo.find('div.previous-video').html();
				}
				
				if ($('#'+videoId).hasClass('youtube')) {
					url = $('#'+videoId).attr('data-url')+'&controls=0&rel=0&showinfo=0';
					pop = Popcorn.youtube( '#'+videoId,url);
					if (!iOS) pop.play();
				} else if ($('#'+videoId).hasClass('vimeo')) {
					url = $('#'+videoId).attr('data-url');
					pop = Popcorn.vimeo( '#'+videoId,url);
					if (!iOS) pop.play();
				} else {
					pop = Popcorn( '#'+videoId);
				}
				
				
				
				if (timepoint != 0) {
					$currentVideo.attr('data-timepoint',timepoint);
				}
				
				
				resizeVideo();
				
				if (pop.duration()) {
					$.fancybox.hideLoading();
					handleCanplay();
				} else {
					pop.on('loadedmetadata', function() {
						handleCanplay();
					});
				}
				
			}
		});
		
	}
	
	function initSection(fid){
		$('#breadcrumps a[data-fid='+fid+']').nextAll().andSelf().remove();
		var $videos = $('#'+config.videoId).parents('div.videos');
		
		var timepoint = pop.roundTime();
		$('#'+config.videoId).parents('div.playervideo-box').attr('data-timepoint',timepoint);
		$('#vidbox-progress').width(0);
		pop.pause();
		pop.destroy();
		
		$('#'+config.videoId).parents('div.playervideo-box').find('iframe').hide();
		if (!timelinebarclick) {
			$('#'+config.videoId).parents('div.playervideo-box').remove();
		} else {
			$('#'+config.videoId).parents('div.playervideo-box').hide();
		}
		
		$('#vidbox-markers > div.marker-group-comment').remove();
		$('#vidbox-markers > div.marker-comment').remove();
		$('#vidbox-markers > div.marker-group').remove();
		$('#vidbox-markers > div.marker').remove();
		$('#vidbox-markers-popup > *').remove();
		$('#videoInfo div.video-container > *').remove();
		
		
		
		
		var $currentVideo = $videos.find('.playervideo-box[data-fid='+fid+']');
		var videoId  =  $currentVideo.find('.video-id').attr('data-id');
		var $video = $currentVideo.find('#'+videoId);
		timepoint = $currentVideo.attr('data-timepoint');
		
		$('#'+videoId).find('iframe').remove();
		$currentVideo.show();
		
		showTrigger = false;
		markerInterval = 0;
		paused = true;
		config = {};
		markers = {};
		comments={};
		cuemap = {}; 
		config.videoId = videoId;
		config.fid = fid;
		
		if ($currentVideo.find('div.markers').get(0)) {
			config.markers = $currentVideo.find('div.markers').attr('data-markers');
		}
		
		if ($currentVideo.find('div.video-info').get(0)) {
			config.videoInfo = $currentVideo.find('div.video-info').html();
			config.breadcrump =  $currentVideo.find('div.video-info h2').text();
		}
		
		
		if (timelinebarclick) {
			$('#breadcrumps a').remove();
			config.timelineBar =  $currentVideo.find('div.timeline').html();
			timelinebarclick = false;
		}
		
		if ($currentVideo.find('div.comments').get(0)) {
			config.comments = $currentVideo.find('div.comments').attr('data-comments');
		}
		
		if ($currentVideo.find('div.comment-form').get(0)) {
			config.commentForm = $currentVideo.find('div.comment-form').html();
		}
		
		if ($currentVideo.find('div.next-video').get(0)) {
			config.nextVideo =  $currentVideo.find('div.next-video').html();
		}
		
		if ($currentVideo.find('div.previous-video').get(0)) {
			config.previousVideo =  $currentVideo.find('div.previous-video').html();
		}
		
		
		
		if ($('#'+videoId).hasClass('youtube')) {
			url = $('#'+videoId).attr('data-url')+'&controls=0&rel=0&showinfo=0';
			console.log(url);
			pop = Popcorn.youtube( '#'+videoId,url);
			pop.play();
		} else if ($('#'+videoId).hasClass('vimeo')) {
			url = $('#'+videoId).attr('data-url');
			console.log(url);
			pop = Popcorn.vimeo( '#'+videoId,url);
			pop.play();
		} else {
			pop = Popcorn( '#'+videoId);
		}
		
		if (timepoint != 0 && !iOS) {
			pop.currentTime(timepoint);
		}
		
		if (iOS) {
			hideControls();
			rescanActiveStatusOfMarkers(0);
			resizeVideo();
		}
		
		if ( $.browser.msie ) { 
			resizeVideo();
		}
		
		if (pop.duration()) {
			handleCanplay();
		} else {
			pop.on('loadedmetadata', function() {
				handleCanplay();
			});
		}
		
	}
	
	function rescanActiveStatusOfMarkers(time) {
		var currentTime =  parseInt(time);
		$('#vidbox-markers .marker').each(function (i,marker) {
			var timepoint = $(marker).attr('data-timepoint');
			if(currentTime >= timepoint) {
				activateMarkerById($(marker).attr('data-id'));
			} else deactivateMarkerById($(marker).attr('data-id'));
		});
		
		$('#vidbox-markers .marker-comment').each(function (i,marker) {
			var timepoint = $(marker).attr('data-timepoint');
			if(currentTime >= timepoint) {
				activateMarkerCommentById($(marker).attr('data-id'));
			} else deactivateMarkerCommentById($(marker).attr('data-id'));
		});
	}
	
	
	function addMarker(marker,timepoint){
		var n = $('#vidbox-markers');
		var pos = parseFloat(( timepoint / duration ) * 100);
		var ststr = 'left:'+pos+'%';
		var myid = 'marker-'+marker.nid;
		n.append('<div id="'+myid+'"\
			class="marker '+marker.type+'-marker inactive"\
			data-timepoint="'+timepoint+'"\
			data-isactive="false"\
			data-id="'+marker.nid+'"\
			data-type="'+marker.type+'"\
			style="'+ststr+'">\
		</div>');
		
		
		pop.cue(timepoint, function (e,o) {
			var second = o.start;
			
			$('#vidbox-markers .info-marker[data-timepoint='+second+']').each(function(){
				var id = $(this).attr('data-id');
				var $current_marker = $('#marker-'+id);
				$current_marker.addClass('activated').animate({'paddingTop':'37px'},500,function(){
					setTimeout(function(){
						$current_marker.animate({'paddingTop':'20px'},500,function(){
							$current_marker.removeClass('activated').css({'paddingTop':'20px'});
						});
						
					},300);
					
				});
				activateMarkerById(id);
			})

		});
		
	}
	
	function addComment(comment,timepoint){
		var n = $('#vidbox-markers');
		var pos = parseFloat(( timepoint / duration ) * 100);
		var ststr = 'left:'+pos+'%;';
		var myid = 'marker-cnid-'+comment.cid;
		n.append('<div id="'+myid+'"\
			class="marker-comment inactive"\
			data-timepoint="'+timepoint+'"\
			data-isactive="false"\
			data-id="'+comment.cid+'"\
			style="'+ststr+'">\
		<span></span></div>');
		
		
		pop.cue(timepoint, function (e,o) {
			activateMarkerCommentById(cuemap[o.start]);

		});
	}
	
	function activateMarkerById(id){
		var n = $('#marker-'+id);
		n.attr('data-isactive', "true");

		n.removeClass('inactive').addClass('active');
	}
	
	function activateMarkerCommentById(id){
		var n = $('#marker-cnid-'+id);
		n.attr('data-isactive', "true");

		n.removeClass('inactive').addClass('active');
	}
	
	function deactivateMarkerById(id){
		var n = $('#marker-'+id);
		n.attr('data-isactive', "false");

		n.removeClass('active').addClass('inactive');
	}
	
	function deactivateMarkerCommentById(id){
		var n = $('#marker-cnid-'+id);
		n.attr('data-isactive', "false");

		n.removeClass('active').addClass('inactive');
	}
	
	function hoverTimelineMarker(){
		
		var markerMouseenter = function(marker){
			
			if(marker.attr('data-isactive')==='true' && !marker.hasClass('hover')) {
				markerhover = true;
				$('#vidbox-markers-popup > .popup-group').hide();
				$('#vidbox-markers-popup > .popup').hide();
				if (marker.hasClass('active-group')) {
					var groupID = marker.parent().attr('data-group');
					showMarkerGroup(groupID);
				} else showDrawer(marker.attr('data-id'));
				if (!iOS) {
					marker.stop(true,true).addClass('activated').animate({'paddingTop':'37px'},500,function(){
						marker.addClass('activated');
					});
				}
				
			}
		}
		
		$('#vidbox-markers div.marker').on('touchstart',function(){
			//alert('touchstart marker');
			var marker = $(this);
			markerMouseenter(marker);
			if(marker.attr('data-isactive')==='true') return false;
			
			
		});
		
	
	
		$('#vidbox-markers div.marker').on('mouseenter',function(){
			var marker = $(this);
			markerhover = true;
			markerMouseenter(marker);
			hideTimePopup();
		});
		
		
		
		$('#vidbox-markers div.marker').on('mouseleave',function(){
			
			var marker = $(this);
			if(marker.attr('data-isactive')==='true') {
				markerhover = false;
				marker.removeClass('hover');
				marker.stop(true,true).animate({'paddingTop':'20px'},500,function(){
					marker.removeClass('activated').css({'paddingTop':'20px'});
				});
			}
			markerhover = false;
			
		});
		
	}
	
	function hoverTimelineMarkerComment(){
		
		var markerMouseenter = function(marker){
			
			if(marker.attr('data-isactive')==='true' && !marker.hasClass('hover')) {
				marker.addClass('hover');
				markerhover = markercommenthover = true;
				$('#comment-area #edit-comment-body-und-0-value').prev().text('Response...');
				timeComment  = marker.attr('data-timepoint');
				var ids = [marker.attr('data-id')];
				if (marker.parents('.marker-group-comment').get(0)) {
					marker.parents('.marker-group-comment').find('.marker-comment').each(function(i){
						ids[i] = $(this).attr('data-id');
					});
				} 
				
				showDrawerComment(ids);
			}
		}
		
		$('#vidbox-markers div.marker-comment').on('mouseenter',function(){
			markerhover = true;
			var marker = $(this);
			markerMouseenter(marker);
			
		});
		
		$('#vidbox-markers div.marker-comment').on('touchstart',function(){
			var marker = $(this);
			if (marker.hasClass('hover')) {
				marker.removeClass('hover');
				markerhover = false;
				timeComment = 0;
				$('#comment-area #edit-comment-body-und-0-value').prev().text('Add a comment...');
				$('#comment-area #edit-comment-body-und-0-value').prev().show();
				hideDraweComment();
			} else {
				markerMouseenter(marker);
			}
			
			return false;
			
		});
		
		$('#vidbox-markers div.marker-comment').on('mouseleave',function(){
			var marker = $(this);
			if(marker.attr('data-isactive')==='true') {
				markerhover = markercommenthover = false;
				marker.removeClass('hover');
			}
			markerhover = false;
		});
	}
	
	function showDrawer(id) {

		var trigger = $('#popup-'+id);
		hideVideoTag();
		hideDraweComment();
		trigger.show();
		$('#vidbox-markers-popup').stop(true,true).fadeIn(speedIn);
		
		if (iOS) {
			showTrigger = true;
			resizeVideo();
		}
		
		drawershowing = true;
		showGradient();
		
	}
	
	function showDrawerComment(ids){
		
		
		var id = ids[0];
		hideDrawer();
		$('#marker-cnid-'+id).addClass('hover');
		
		var leftX = parseInt(parseFloat($('#marker-cnid-'+id)[0].style.left).toFixed(3)*parseInt($('#timeline-wrap-inner').width())/100);
		var left = leftX +55;
		var time = $('#marker-cnid-'+id).attr('data-timepoint');
		
		var hours = parseInt( time / 3600 ) % 24;
			minutes = parseInt( time / 60 ) % 60;
			seconds = Math.round(time % 60);
		var startHMS = hours + ':' + (minutes < 10 ? '0' + minutes : minutes) + ':' + (seconds	< 10 ? '0' + seconds : seconds);
		
		$('#vidbox-comments-popup #comment-form input#edit-field-time-und-0-value').val(startHMS);
		
		
		$('#vidbox-comments-popup .comment').hide();
		for (i in ids) {
			$('#comment-'+ids[i]).show();;
		}
		
		hideVideoTag();
		
		
		if (left < 185) {
			var bgX = left - 100 - 165;
			$('#vidbox-comments-popup').css({
				left: '185px',
				'background-position': bgX+'px 100%'
			});
		} else {
			$('#vidbox-comments-popup').css({
				left: left+'px',
				'background-position': '-80px 100%'
			});
		}
		
		$('#vidbox-comments-popup').stop(true,true).fadeIn(speedIn);
		$('#vidbox-comments-popup div.comments-box').height('180');
		
		
		initScrollComment();
		
		
		commentsshowing = true;
		showGradient();
	}
	
	function initScrollComment(){
		var element = $('#vidbox-comments-popup div.comments-box').jScrollPane();
		var api = element.data('jsp');
		var vScroll = api.getIsScrollableV();
		if (vScroll) {
			api.scrollToBottom();
		} else {
			api.destroy();
			$('#vidbox-comments-popup div.comments-box').height('auto');
		}
	}
	
	function destroyScrollComment(){
		var element = $('#vidbox-comments-popup div.comments-box').jScrollPane();
		var api = element.data('jsp');
		api.destroy();
		$('#vidbox-comments-popup div.comments-box').height('auto');
	}
	
	function hideVideoTag(){
		$('#videoInfo div.tag').css('visibility','hidden');
	}
	
	function showVideoTag(){
		$('#videoInfo div.tag').css('visibility','visible');
	}
	
	function showMarkerGroup(id){
		var trigger = $('#group-'+id);
		hideDraweComment();
		hideVideoTag();
		trigger.show();
		$('#vidbox-markers-popup').stop(true,true).fadeIn(speedIn);
		// init cycle
		if (trigger.attr('cycle-init') != 1) {
			trigger.find('div.slide-body').append('<div class="pager-trigger"><a href="" class="prev"></a><ul></ul><a href="" class="next"></a></div>')
			trigger.find('div.slide-body').cycle({
				timeout : 0,
				slides : '> div.popup',
				prev : '> div.pager-trigger > .prev',
				next : '> div.pager-trigger > .next',
				pager :  '> div.pager-trigger > ul',
				pagerTemplate : '<li><a href="">{{slideNum}}</a></li>'
			});
			trigger.attr('cycle-init',1);
		}
		if (iOS) {
			showTrigger = true;
			resizeVideo();
		}
		drawershowing = true;
		showGradient();
	}
	
	function hideDrawer(){
		drawershowing = false;
		$('#vidbox-markers-popup').fadeOut(speedOut);
		$('#vidbox-markers-popup > div.popup-group').hide();
		$('#vidbox-markers-popup > div.popup').hide();
		if (iOS) {
			showTrigger = false;
			resizeVideo();
		}
		hideGradient();
		showVideoTag();
	}
	
	function hideDraweComment(){
		var $newComment = $('#vidbox-markers div.new-comment');
		$newComment.hide();
		$('#vidbox-markers div.marker-comment').removeClass('hover');
		$('#vidbox-markers div.marker-comment span.active').stop(true,true).animate({'height':'10px'},300).removeClass('active');
		$('#vidbox-comments-popup').hide();
		$('#vidbox-comments-popup div.comments-box > div.comment').hide();
		hideGradient();
		showVideoTag();
		commentsshowing = false;
	}
	
	function resizeVideo(){
		var widthvideo, heightvideo;
		var iframe = false;
		
		if (typeof pop != 'undefined') {
			widthvideo = pop.media.width;
		}
		
		if (typeof pop != 'undefined') {
			heightvideo = pop.media.height;
		}
		
		
		
		if ($('#'+config.videoId).hasClass('youtube') || $('#'+config.videoId).hasClass('vimeo') ) {
			if ( $('#'+config.videoId).hasClass('vimeo')) {
				//widthvideo = 500;
				//heightvideo = 281;
				widthvideo = 640;
				heightvideo = 360;
				iframe = true;
			} else {
				widthvideo = 640;
				heightvideo = 360;
			}
		}
		
		
		
		var marginTop = 0;
		var toolbarHeight = 50;
		var width,height;
		var w = window,
			d = document,
			e = d.documentElement,
			g = d.getElementsByTagName('body')[0],
			x = w.innerWidth || e.clientWidth || g.clientWidth,
			y = w.innerHeight|| e.clientHeight|| g.clientHeight;
			
		
		
		if ($('#box-video').hasClass('has-comment')) {
			toolbarHeight = 90;
		}
		if (config.commentForm != 'undefined') {
			toolbarHeight = 90;
		}
		
		if (showTrigger) {
			toolbarHeight = toolbarHeight + 250;
		}
		
		if (showInfo) {
			var heightInfo = parseInt($('#videoInfo div.video-container').height()) + 30;
			toolbarHeight = toolbarHeight + heightInfo;
		}
		if (iOS) {
			widthvideo = 640;
			heightvideo = 360;
			y = y - toolbarHeight;
			x = x - 80;
			if (textInputType) return false;
		}

		var ratiox = x / widthvideo,
			ratioy = y / heightvideo,
			ratio;
		if (ratiox < ratioy) {
			width = x;
			height = parseInt(ratiox*heightvideo);
			marginTop = parseInt((y - height)/2);
		} else {
			width = parseInt(ratioy*widthvideo);
			height = y;
		}
		
		if (iframe) {
			$('#'+config.videoId).find('iframe').css({
				'width' : width +'px',
				'height' : height + 'px',
				'display' : 'block',
				'margin' : '0 auto',
				'margin-top' : marginTop+'px'
			});
			$('#'+config.videoId).css('visibility' , 'visible');
		} else {
			$('#'+config.videoId).css({
				'width' : width +'px',
				'height' : height + 'px',
				'visibility' : 'visible',
				'display' : 'block',
				'margin' : '0 auto',
				'margin-top' : marginTop+'px'
			});
		}
		
		if (x > 900) {
			$('#box-video').removeClass('small-size');
		} else {
			$('#box-video').addClass('small-size');
		}
	}
	
	function handlePlay(){
		if(paused) {
			pop.play();
			$('#box-pauseplay a').removeClass('icon-play').addClass('icon-pause');
			paused = false;
		} else {
			pop.pause();
			$('#box-pauseplay a').removeClass('icon-pause').addClass('icon-play');
			paused = true;
		}
	}
	
	function handlePlayOn(){
		$('#box-pauseplay a').removeClass('icon-play').addClass('icon-pause');
		paused = false;
	}
	
	function handlePauseOn(){
		$('#box-pauseplay a').removeClass('icon-pause').addClass('icon-play');
		paused = true;
	}
	
	
	function hmsToSecondsOnly(str) {
		if (!str) return 0;
		var p = str.split(':'),
		s = 0, m = 1;

		while (p.length > 0) {
			s += m * parseInt(p.pop(), 10);
			m *= 60;
		}

		return s;
	}
	
	function secondsToHms(d) {
		d = Number(d);
		var h = Math.floor(d / 3600);
		var m = Math.floor(d % 3600 / 60);
		var s = Math.floor(d % 3600 % 60);
		
		var time = ((h > 0 ? h + ":" : "") + (m > 0 ? (h > 0 && m < 10 ? "" : "") + m + ":" : "0:") + (s < 10 ? "0" : "") + s);

		return time;
	}
	
	function toggleFullScreen() {
		var videoElement = document.documentElement;
		if ( $.browser.msie  && typeof window.ActiveXObject!="undefined" ) {
			 // for Internet Explorer
			try {
				var wscript = new ActiveXObject("WScript.Shell");
				wscript.SendKeys("{F11}");
			} catch(e){
				alert('Your security settings are preventing full screen access please press F11 on your keyboard.');
			}
			return false;
		}
		
		
		if (!document.mozFullScreen && !document.webkitFullScreen && !document.webkitCurrentFullScreenElement) {
			if (videoElement.mozRequestFullScreen) {
				videoElement.mozRequestFullScreen();
			} else {
				if (document.webkitFullScreen) {
					videoElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
				} else {
					videoElement.webkitRequestFullScreen();
				}
				
			}
		} else {
			if (document.mozCancelFullScreen) {
				document.mozCancelFullScreen();
			} else {
				document.webkitCancelFullScreen();
			}
		}
		
		
	
	}
	
	function handleEndedProgressBar(){
		$('#vidbox-progress').css({width:'100%'});
	}
	
	function handleTimeupdate(e) {
			if (iOS) showControls();
			var progress = pop.currentTime();
			var timeprogress = pop.roundTime();
			
			var time = secondsToHms(timeprogress);
			
			if (time >= duration) time = duration;
			$('#timebar span.current').text(time);
			
			var position = (progress / duration ) * 100;

			$('#vidbox-progress').css({width:position+'%'});
			
	}
	
	function TrackVideo(){
		var label = config.breadcrump;
		if (typeof(_gaq) != 'undefined')  {
			_gaq.push(['_trackEvent', 'Rich media video', 'Open', label]);
		}
	}
	
	function TrackTrigger(trigger_title){
		var video_title = config.breadcrump;
		if (typeof(_gaq) != 'undefined') {
			_gaq.push(['_trackEvent', 'Trigger', 'Open', trigger_title + ' on ' +video_title]);
		}
		
	}
	
	return {
		init : function(conf){
			config = conf;
			
			
			var videoId = conf.videoId;
			var url;
			var loadvideo = false;
			
			resizeVideo();
			$('#'+config.videoId).css('visibility','hidden');
			
			
			config.fid = $('#'+config.videoId).attr('data-fid');
			var $videoBox = $('#'+config.videoId).parents('.playervideo-box');
			config.nid = $videoBox.find('.node-video-id').attr('data-nid');
			config.markers = $videoBox.find('div.markers').attr('data-markers');
			config.videoInfo = $videoBox.find('div.video-info').html();
			config.breadcrump = $videoBox.find('div.video-info h2').text();
			config.commentForm =  $videoBox.find('div.comment-form').html();
			config.comments =  $videoBox.find('div.comments').attr('data-comments');
			
			if ($videoBox.find('div.timeline').get(0)) {
				config.timelineBar =  $videoBox.find('div.timeline').html();
			}
			
			if ($videoBox.find('div.next-video').get(0)) {
				config.nextVideo =  $videoBox.find('div.next-video').html();
			}
			
			
			if ($('#'+videoId).hasClass('youtube')) {
				url = $('#'+videoId).attr('data-url')+'&controls=0&rel=0&showinfo=0';
				pop = Popcorn.youtube( '#'+videoId,url);
				if (!iOS) pop.play();
			} else if ($('#'+videoId).hasClass('vimeo')) {
				url = $('#'+videoId).attr('data-url');
				pop = Popcorn.vimeo( '#'+videoId,url);
				if (!iOS) pop.play();
				
			} else {
				pop = Popcorn( '#'+videoId);
			}
			
			
			initControls();
			if ($.browser.msie) { 
				resizeVideo();
			}
			
			
			if (iOS) {
				hideControls();
				resizeVideo();
			}
			
			
			if (pop.duration()) {
				loadvideo = true;
				handleCanplay();
			} else {
				pop.on('loadedmetadata', function() {
					loadvideo = true;
					handleCanplay();
				});
				
			}
			
			
			setTimeout(function(){
				if (!loadvideo) resizeVideo();
			},3000);
			
			
			TrackVideo();
			
		},
		
		destroy : function(){
			pop.pause();
			paused = true;
			config = markers = comments = cuemap = {};
			duration = 0; 
			drawershowing = commentsshowing = infoshowing = isfullscreen = markercommenthover = markerhover = timelinehover = false;
			textInputType = false;
			timelinebarclick = nextvideoclick =false;
			timeComment = 0;
			showTrigger = false;
			showInfo = false;
			openSharebox = false;
			markerInterval = 0;
		},
		
		play : function(){
			pop.play();
		},
		
		getUser : function(){
			var $videoBox = $('#'+config.videoId).parents('.playervideo-box');
			$.ajax({
				url:Drupal.settings.basePath + 'loo/'+config.nid+'/comment-form',
				success:function(msg){
					if (msg != '') {
						$videoBox.find('div.comment-form').html(msg);
						$('#comment-area').find('div.login-box').remove();
						$('#comment-area').prepend(msg);
						$('#social-login').fadeOut(300,function(){
							$('#social-login .block-fboauth,#social-login .block a.twitter-signin-popup').show();
							$('#social-login div.continue').hide();
						});
						handlePlay();
						initPlayerComments();
					} 	else {
						$('#social-login .block-fboauth,#social-login .block a.twitter-signin-popup').show();
						$('#social-login div.continue').hide();
					}
					
				}
			});
			
			
			
		}
	}
})(jQuery);
