/**
 * @file
 * LandofOpportunity main js file. Descripe parallax section, search, functionality.
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
(function($){ 

$.fn.spin = function(opts) {
	this.each(function() {
	  var $this = $(this),
	      data = $this.data();

	  if (data.spinner) {
	    data.spinner.stop();
	    delete data.spinner;
	  }
	  if (opts !== false) {
	    data.spinner = new Spinner($.extend({color: $this.css('color')}, opts)).spin(this);
	  }
	});
	return this;
};

function update() {
	var opts = {
	  lines: 13, // The number of lines to draw
	  length: 15, // The length of each line
	  width: 5, // The line thickness
	  radius: 30, // The radius of the inner circle
	  corners: 1, // Corner roundness (0..1)
	  rotate: 90, // The rotation offset
	  color: '#fff', // #rgb or #rrggbb
	  speed: 1, // Rounds per second
	  trail: 60, // Afterglow percentage
	  shadow: true, // Whether to render a shadow
	  hwaccel: false, // Whether to use hardware acceleration
	  className: 'spinner', // The CSS class to assign to the spinner
	  zIndex: 2e9, // The z-index (defaults to 2000000000)
	  top: 'auto', // Top position relative to parent in px
	  left: 'auto' // Left position relative to parent in px
	};
	$('#loader').spin(opts);
}

$(function() {
	update();
});

function viewport(){
    var e = window, a = 'inner';
    if (!('innerWidth' in window )){
        a = 'client';
        e = document.documentElement || document.body;
    }
    return{ width : e[ a+'Width' ] , height : e[ a+'Height' ] };
}

function _fullscreenEnabled() {
    // FF provides nice flag, maybe others will add support for this later on?
    if(window['fullScreen'] !== undefined) {
      return window.fullScreen;
    }
    // 5px height margin, just in case (needed by e.g. IE)
    var heightMargin = 5;
    if($.browser.webkit && /Apple Computer/.test(navigator.vendor)) {
      // Safari in full screen mode shows the navigation bar, 
      // which is 40px  
      heightMargin = 42;
    }
    return screen.width == window.innerWidth &&
        Math.abs(screen.height - window.innerHeight) < heightMargin;
}

$.fn.removeAttributes = function(only, except) {
    if (only) {
        only = $.map(only, function(item) {
            return item.toString().toLowerCase();
        });
    };
    if (except) {
        except = $.map(except, function(item) {
            return item.toString().toLowerCase();
        });
        if (only) {
            only = $.grep(only, function(item, index) {
                return $.inArray(item, except) == -1;
            });
        };
    };
    return this.each(function() {
        var attributes;
        if(!only){
            attributes = $.map(this.attributes, function(item) {
                return item.name.toString().toLowerCase();
            });
             if (except) {
                attributes = $.grep(attributes, function(item, index) {
                    return $.inArray(item, except) == -1;
                });
            };
        } else {
            attributes = only;
        }     
        var handle = $(this);
        $.each(attributes, function(index, item) {
            handle.removeAttr(item);
        });
    });
};

var WindowWidth = viewport().width;
var WindowHeight = viewport().height;
var fullscreen = current_fullscreen = _fullscreenEnabled();
var resizeTimer = '';
var inMotion = false;
var s = hash_resize = '';
var scrolling = true;

$(document).ready(function(){
	$('#page-wrapper').css('visibility','visible');
	initSlider();
	initProtagonists();
	initSectionsResize();
	initSections();
	initHovers();
	initBackgroundVideo();
	initExternalLinks();
	initTypeToSearch();
	initFeedback();
	initPlayer();
	if ($.browser.msie) $('body').addClass('ie-browser');
});

$(window).load(function(){
	$('#loader').fadeOut('fast');
	$('#loader .spinner').remove();
	initSkrollr();
	initTextAnimation();
	initActiveSection();
	setInterval(function() {
		fullscreen = _fullscreenEnabled();
		if(fullscreen !== current_fullscreen && inMotion == false){
			inMotion = true;
			clearTimeout(resizeTimer);
			resizeTimer = setTimeout(initResize,1000);
		}
	}, 200);
});

function initResize() {
	current_fullscreen = _fullscreenEnabled();
	var CurrentWidth = viewport().width;
	var CurrentHeight = viewport().height;
	WindowWidth = CurrentWidth;
	WindowHeight = CurrentHeight;
	initBackgroundVideo();
	initSectionsResize();
	initSections();
	s.refresh();
};

$(window).resize(function(){
	hash_resize = window.location.hash;
	clearTimeout(resizeTimer);
	resizeTimer = setTimeout(initResize, 200);
});

function initExternalLinks(){
	$('a[rel="external"]').addClass('externalLink').attr('target', '_blank');
	$("a[href*='http://']:not([href*='"+location.hostname.replace("www.","")+"']), a[href*='https://']:not([href*='"+location.hostname.replace("www.","")+"'])").each(function(){
			$(this).addClass('externalLink').attr('target', '_blank');
		}
	);
}

function initSkrollr(){
	
	s = skrollr.init({
		mobileDeceleration : 0.01
	});

	skrollr.menu.init(s, {
	    animate: true, //skrollr will smoothly animate to the new position using `animateTo`.
	    duration: 1000, //How long the animation should take in ms.
	    easing: 'linear' //The easing function to use.
	});
}

function initSectionsResize(){

	// All Sections
	var section_start = section_end = section_height = text_offset = text_margin = 0;
	var scroll_offset = 500;
	var window_offset = parseInt(WindowHeight);
	var content_offset = parseInt(window_offset/2);
	$('#page-wrapper .section').each(function(index){
		if($(this).hasClass('intro') || $('body').hasClass('page-timeline')){
			$(this).height(WindowHeight);
		}
		else{
			$(this).height(WindowHeight-74);
		}
	});

	// Intro Section
	if($('#page-wrapper div.section-wrapper.intro').get(0)){
		$('#page-wrapper div.section-wrapper.intro').height(WindowHeight);
		var intro_height = parseInt(WindowHeight);
		var intro_text_margin = (intro_height - 74 - parseInt($('#intro-text div.text').height()))/2;
		if(intro_text_margin < 0){ intro_text_margin = 0; }
		$('#intro-text div.text').css('margin-top',intro_text_margin);
		$('#intro-text div.text').height($('#intro-text div.text').height());
		$('#page-wrapper div.section-wrapper.intro div.text a.arrow').attr('data-menu-top',parseInt(WindowHeight+50));
		$('#featured div.bottom-arrow a.bottom').attr('data-menu-top',parseInt(WindowHeight*2));
		$('#page-wrapper div.section-wrapper.intro .section').each(function(index){
			if ($(this).find('div.slide').get(0)){
				$(this).find('div.slide').each(function(index){
					var video_count = $(this).find('div.video').size();
					$(this).find('div.video').each(function(index){
						$(this).height(WindowHeight-74).width(100/video_count+'%');
						var container_width = parseInt(WindowWidth/video_count);
						var container_height = $(this).height();
						var container_ratio = container_width/container_height;
						var image_ratio = 1/2;
						if(container_ratio < image_ratio){
							$(this).find('img').width('auto').height(WindowHeight-74);
						}
						else{
							$(this).find('img').width('100%').height('auto');
						}
					});
				});
			}
			else{
				var video_count = $(this).find('div.video').size();
				$(this).find('div.video').each(function(index){
					$(this).height(WindowHeight-74).width(100/video_count+'%');
					var container_width = parseInt(WindowWidth/video_count);
					var container_height = $(this).height();
					var container_ratio = container_width/container_height;
					var image_ratio = 1/2;
					if(container_ratio < image_ratio){
						$(this).find('img').width('auto').height(WindowHeight-74);
					}
					else{
						$(this).find('img').width('100%').height('auto');
					}
				});
			}
		});
	}

	// Info Section
	if($('#page-wrapper div.section-wrapper.info').get(0)){
		$('#page-wrapper div.section-wrapper.info').height(WindowHeight+500);
		$('#page-wrapper div.section-wrapper.info div.bottom-arrow a.bottom').attr('data-menu-top',parseInt((WindowHeight + scroll_offset)*2 + WindowHeight));
		var info_img_height = $('#info .inner-content img').height();
		var content_height = $('#info .inner-content').height();
		if(WindowHeight - 100 < content_height){
			var remainer = content_height - info_img_height;
			var new_info_img_height = WindowHeight - 100 - remainer;
			$('#info .inner-content img').height(new_info_img_height).width('auto');
		}
		else{
			$('#info .inner-content img').height('auto').width('100%');
		}
	}

	// Dig Deeper Section 
	if($('#dig-deeper').get(0)){
		$('#header div.menu div.content ul li a.dig-deeper').attr('data-menu-top',parseInt((WindowHeight + scroll_offset)*2 + WindowHeight));
		var dig_deeper_section_count = $('#page-wrapper div.section-wrapper.dig-deeper').find('.section').size();
		$('#page-wrapper div.section-wrapper.dig-deeper').height((WindowHeight-74+scroll_offset)*dig_deeper_section_count+WindowHeight*2);
		$('#page-wrapper div.section-wrapper.dig-deeper .section').each(function(index){
			var offset = $(this).parents('.section-wrapper').offset();
			section_start = offset.top+$(this).height()*index+scroll_offset*(index+1);
			section_end = section_start+$(this).height();
			section_height = $(this).height();
			if($(this).hasClass('category-title')){
				$(this).find('div.text').css('padding-top','0');
				var text_height = $(this).find('div.text').height();
				text_margin = (section_height - text_height)/2;
				text_offset = parseInt(section_height)+'px';
				$(this).find('div.text').css('padding-top',text_margin);
				$(this).parents('.section-inner').find('.title').css('padding-top',text_margin)
				if(!$(this).parents('.views-row').find('.category-wrapper').get(0) && $(this).parents('.views-row').hasClass('views-row-last')){
					if($(this).parents('.section-wrapper').next('.section-wrapper').hasClass('compare')){
						$(this).find('div.text a.arrow').attr('data-menu-top',parseInt(section_start+WindowHeight*2+scroll_offset*2));
					}
					else{
						var next_section_offset= $('#about').offset();
						var next_section_start = next_section_offset.top;
						var about_start = parseInt($('.section-wrapper.intro').height()+$('.section-wrapper.info').height()+$('.section-wrapper.dig-deeper').height()+$('.section-wrapper.compare').height()-500);
						$(this).find('div.text a.arrow').attr('data-menu-top',about_start);
					}
				}
				else{
					$(this).find('div.text a.arrow').attr('data-menu-top',parseInt(section_start+WindowHeight*2+scroll_offset));
				}
				var category_id = $(this).parents('.node-category').attr('id');
				$('#header div.menu div.content > ul > li.dig-deeper ul li a').each(function(index){
					if($(this).attr('rel') == category_id){
						$(this).attr('data-menu-top',parseInt(section_start+WindowHeight));
					}
				});
			}
			else{
				if(!$(this).parents('.views-row').hasClass('views-row-last')){
					$(this).parent('.category-wrapper').find('div.bottom-arrow a.bottom').attr('data-menu-top',parseInt(section_start+WindowHeight*2+scroll_offset));
				}
				else{
					$(this).parent('.category-wrapper').find('div.bottom-arrow a.bottom').attr('data-menu-top',parseInt(section_start+WindowHeight*2+scroll_offset));
				}
			}
			if ($(this).find('div.slide').get(0)){
				$(this).find('div.slide').each(function(index){
					var video_count = $(this).find('div.video').size();
					$(this).find('div.video').each(function(index){
						$(this).height(WindowHeight-74).width(100/video_count+'%');
						var container_width = parseInt(WindowWidth/video_count);
						var container_height = $(this).height();
						var container_ratio = container_width/container_height;
						var image_ratio = 1/2;
						if(container_ratio < image_ratio){
							$(this).find('img').width('auto').height(WindowHeight-74);
						}
						else{
							$(this).find('img').width('100%').height('auto');
						}
					});
				});
			}
			else{
				var video_count = $(this).find('div.video').size();
				$(this).find('div.video').each(function(index){
					$(this).height(WindowHeight-74).width(100/video_count+'%');
					var container_width = parseInt(WindowWidth/video_count);
					var container_height = $(this).height();
					var container_ratio = container_width/container_height;
					var image_ratio = 1/2;
					if(container_ratio < image_ratio){
						$(this).find('img').width('auto').height(WindowHeight-74);
					}
					else{
						$(this).find('img').width('100%').height('auto');
					}
				});
			}
		});
	}

	// Predict Section 
	if($('#compare').get(0)){
		if(!$('body').hasClass('page-timeline')){
			var predict_start = parseInt($('#dig-deeper').height()+(WindowHeight+scroll_offset));
			var predict_end = predict_start + (WindowHeight+scroll_offset)*2;
			$('#header div.menu div.content ul li a.compare').attr('data-menu-top',predict_start+window_offset);
			$('#page-wrapper div.section-wrapper.compare').height((WindowHeight+scroll_offset)*2);
			$('#page-wrapper div.section-wrapper.compare .section').each(function(index){
				section_start = predict_start;
				section_end = parseInt(section_start+$(this).height());
				section_height = parseInt($(this).height());
				var timeline_start = section_end + scroll_offset;
				var timeline_end = timeline_start + section_height;
				var predict_text_margin = (section_height - parseInt($(this).find('div.text-wrapper div.text').height()))/2;
				if(predict_text_margin < 0){ predict_text_margin = 0; }
				$(this).find('div.text-wrapper div.text').css('padding-top',predict_text_margin);
				$(this).find('div.text-wrapper div.text').height($(this).find('div.text-wrapper div.text').height());
				$(this).find('.timeline-top,.timeline-bottom').height(section_height/2);
				text_margin = (section_height - $(this).find('div.text').height())/2;
				$(this).find('div.text').css('margin-top',text_margin);
				var info_height = section_height/2;
				var info_top_margin = (info_height - parseInt($(this).find('div.info-top div.content').height()))/2-30;
				$(this).find('div.info-top div.content').css('margin-top',info_top_margin);
				var info_bottom_margin = (info_height - parseInt($(this).find('div.info-bottom div.content').height()))/2+30;
				$(this).find('div.info-bottom div.content').css('margin-top',info_bottom_margin);
				$(this).find('div.text a.arrow').attr('data-menu-top',timeline_end);
			});
		}
		else{
			var predict_start = 0;
			$('#page-wrapper div.section-wrapper.compare').height(WindowHeight);
			$('#page-wrapper div.section-wrapper.compare .section').each(function(index){
				section_start = predict_start;
				section_end = parseInt(section_start+$(this).height());
				section_height = parseInt($(this).height());
				var timeline_start = section_end + scroll_offset;
				var timeline_end = timeline_start + section_height;
				var predict_text_margin = (section_height - parseInt($(this).find('div.text-wrapper div.text').height()))/2;
				if(predict_text_margin < 0){ predict_text_margin = 0; }
				$(this).find('div.text-wrapper div.text').css('padding-top',predict_text_margin);
				$(this).find('div.text-wrapper div.text').height($(this).find('div.text-wrapper div.text').height());
				$(this).find('.timeline-top,.timeline-bottom').height(section_height/2);
				text_margin = (section_height - $(this).find('div.text').height())/2;
				//$(this).find('div.text').css('margin-top',text_margin);
				var info_height = section_height/2;
				var info_top_margin = (info_height - parseInt($(this).find('div.info-top div.content').height()))/2-30;
				$(this).find('div.info-top div.content').css('margin-top',info_top_margin);
				var info_bottom_margin = (info_height - parseInt($(this).find('div.info-bottom div.content').height()))/2+30;
				$(this).find('div.info-bottom div.content').css('margin-top',info_bottom_margin);
				$(this).find('div.text a.arrow').attr('data-menu-top',timeline_end);
			});
		}
		
	}

	// About 
	if($('#about').get(0)){
		var about_start = parseInt($('.section-wrapper.intro').height()+$('.section-wrapper.info').height()+$('.section-wrapper.dig-deeper').height()+$('.section-wrapper.compare').height()-500);
		$('#header div.menu div.content ul li.about a').attr('data-menu-top',about_start);

	}
	
	// Get Involved 
	if($('#get-involved').get(0)){
		var get_involved_start = about_start + parseInt($('#about .views-row.cycle-slide-active').height() + WindowHeight + 100);
		$('#header div.menu div.content ul li a.get-involved').attr('data-menu-top',get_involved_start);
	}
	
	if(!$('html').hasClass('skrollr-mobile') && hash_resize !='' ){
		var hash = unescape(hash_resize);
		var hashes = hash.split("#/");
		var current_section = '';
		
		var section_hash = hashes[1];
		var scroll_start;

		if (section_hash == 'dig-deeper'){
			
			current_section = $('#header div.menu div.content ul li.dig-deeper .drop a.active').attr('data-menu-top');
		}
		
		if (section_hash == 'info'){
			current_section = $('#featured .bottom-arrow a').attr('data-menu-top');
		}
		
		if (section_hash == 'featured'){
			current_section = $('#intro-text a.arrow').attr('data-menu-top');
		}
		
		if (section_hash == 'home'){
			current_section = 0;
		}
		
		if (section_hash == 'about/'){
			current_section = parseInt($('#header div.menu div.content ul li.about a.about').attr('data-menu-top'));
			//scroll_start = parseInt($('.section-wrapper.intro').height()+$('.section-wrapper.info').height()+$('.section-wrapper.dig-deeper').height()+$('.section-wrapper.compare').height()-500);
		}
		
		if (section_hash == 'get-involved'){
			current_section = $('#header div.menu div.content ul li a.get-involved').attr('data-menu-top');
		}
		
		if (section_hash == 'compare'){
			current_section = $('#header div.menu div.content ul li a.compare').attr('data-menu-top');
		}
		
		if(current_section !== ''){
			$.scrollTo(current_section, 100);
			//scrolling = true;
		}
	}
}


function initSections(){
	
	var section_start = section_end = section_height = text_offset = text_margin = 0;
	var scroll_offset = 500;
	var window_offset = parseInt(WindowHeight);
	var content_offset = parseInt(window_offset/2);
	
	$('#header').removeAttributes(null, ['id','class','style']);  // remove data attributes
	$('#header').attr('data-0','margin-top:-74px; top:100%;').attr('data-'+window_offset,'margin-top:0; top:0;');
	
	$('#page-wrapper .section').each(function(index){
		var video_count = $(this).find('div.video').size();
		if(video_count > 5){
			var size = 3;
			var remainer = video_count % size;
			if (remainer > 0 && remainer < 3){
				size = size + 1;
				remainer = video_count % size;
			}
			if (remainer > 0 && remainer < 3){
				size = size + 1;
				remainer = video_count % size;
			}
			$(this).find('div.video').each(function(index){
				if( index % size == 0 ) {
			        $(this).nextAll().andSelf().slice(0,size).wrapAll('<div class="slide"></div>');
			    }
			});
			if($(this).find('div.slide').size() > 1){
				$(this).find('.category-inner').prepend('<a href="#" class="cycle-prev">prev</a><a href="#" class="cycle-next">next</a>');
				$(this).find('.category-inner').cycle({
					timeout : 0,
					slides : '> div.slide',
					prev : '> a.cycle-prev',
					next : '> a.cycle-next',
					fx: 'scrollHorz'
				});
			}
		}
	});
	
	// Intro Section
	if($('#page-wrapper div.section-wrapper.intro').get(0)){
		var intro_end = parseInt(WindowHeight + scroll_offset/2);
		var intro_end_offset = intro_end + scroll_offset/2;
		var intro_height = parseInt(WindowHeight);
		$('#page-wrapper #intro-text').removeAttributes(null, ['id','class','style']);  // remove data attributes
		$('#page-wrapper div.section-wrapper.intro').removeAttributes(null, ['id','class','style']);  // remove data attributes
		$('#page-wrapper div.section-wrapper.intro').attr('data-'+intro_end,'opacity:1;visibility:visible').attr('data-'+intro_end_offset,'opacity:0;visibility:hidden;');
		$('#intro-text').attr('data-0','height:'+WindowHeight+'px;display:block;').attr('data-'+intro_height,'height:0px;display:none;');
		$('#intro-text div.text').removeAttributes(null, ['id','class','style']);  // remove data attributes
		$('#intro-text div.text').attr('data-0','opacity:1;').attr('data-'+intro_height,'opacity:0;');
		$('#page-wrapper #featured').removeAttributes(null, ['id','class','style']);  // remove data attributes
		$('#featured').attr('data-0','height:0px;opacity:0;').attr('data-'+intro_height,'height:'+WindowHeight+'px;opacity:1;');
	}

	// Info Section
	var info_start = intro_end + scroll_offset/2;
	var info_end = info_start + scroll_offset/2;
	var info_start_offset = info_end;
	var info_end_offset = info_start_offset + scroll_offset;
	$('#page-wrapper div.section-wrapper.info').removeAttributes(null, ['id','class','style']);  // remove data attributes
	$('#page-wrapper #info').removeAttributes(null, ['id','class','style']);  // remove data attributes
	$('#page-wrapper div.section-wrapper.info .section-inner').removeAttributes(null, ['id','class','style']);  // remove data attributes
	$('#page-wrapper div.section-wrapper.info').attr('data-0','visibility:hidden;').attr('data-'+info_start,'visibility:visible;');
	$('#page-wrapper div.section-wrapper.info .section-inner').attr('data-'+info_start_offset,'visibility:visible;').attr('data-'+info_end_offset,'visibility:hidden;');
	$('#info').attr('data-'+info_start,'opacity:0;').attr('data-'+info_end,'opacity:1;');
	
	// Dig Deeper Section 
	if($('#dig-deeper').get(0)){
		var dig_deeper_start = parseInt((WindowHeight + scroll_offset)*2);
		var dig_deeper_section_count = $('#page-wrapper div.section-wrapper.dig-deeper').find('.section').size();
		$('#page-wrapper #dig-deeper').removeAttributes(null, ['id','class','style']);  // remove data attributes
		$('#page-wrapper div.section-wrapper.dig-deeper').attr('data-0','visibility:hidden;').attr('data-'+dig_deeper_start,'visibility:visible;');
		$('#page-wrapper div.section-wrapper.dig-deeper .section').each(function(index){
			var offset = $(this).parents('.section-wrapper').offset();
			section_start = offset.top+$(this).height()*index+scroll_offset*(index+1);
			section_end = section_start+$(this).height();
			section_height = $(this).height();
			$(this).parents('.section-inner').removeAttributes(null, ['id','class','style']);  // remove data attributes
			if($(this).parents('.views-row').hasClass('views-row-first')){
				$(this).parents('.section-inner').attr('data-0','visibility:hidden;').attr('data-'+dig_deeper_start,'visibility:visible;');
			}
			else{
				if ($(this).hasClass('category-title')) {
					$(this).parents('.section-inner').attr('data-0','visibility:hidden;').attr('data-'+section_start,'visibility:visible;');
				}
				
			}
			//$(this).parents('.section-inner').attr('data-0','visibility:hidden;').attr('data-'+section_start,'visibility:visible;');
			if($(this).hasClass('category-title')){
				$(this).removeAttributes(null, ['id','class','style']);  // remove data attributes
				$(this).attr('data-0','visibility:hidden;');
				$(this).attr('data-'+section_start,'opacity:0;visibility:visible;');
				$(this).attr('data-'+section_end,'opacity:1;');
				$(this).find('div.text').removeAttributes(null, ['id','class','style']);  // remove data attributes
				$(this).find('div.text').attr('data-'+section_start,'margin-top:'+text_offset+';');
				$(this).find('div.text').attr('data-'+section_end,'margin-top:0;');
				if(!$(this).parents('.views-row').find('.category-wrapper').get(0)){
					var wrapper_start = section_start + section_height + scroll_offset/2;
					var wrapper_end = wrapper_start + scroll_offset/2;
					$(this).parents('.views-row').removeAttributes(null, ['id','class','style']);  // remove data attributes
					$(this).parents('.views-row').attr('data-'+wrapper_start,'opacity:1;').attr('data-'+wrapper_end,'opacity:0;');
				}
			}
			else{
				$(this).parent('.category-wrapper').removeAttributes(null, ['id','class','style']);  // remove data attributes
				$(this).parent('.category-wrapper').attr('data-0','display:none;').attr('data-'+section_start,'display:block;');
				$(this).removeAttributes(null, ['id','class','style']);  // remove data attributes
				$(this).attr('data-'+section_start,'opacity:0;');
				$(this).attr('data-'+section_end,'opacity:1');
				var wrapper_start = section_start + section_height + scroll_offset/2;
				var wrapper_end = wrapper_start + scroll_offset/2;
				$(this).parents('.views-row').removeAttributes(null, ['id','class','style']);  // remove data attributes
				$(this).parents('.views-row').attr('data-'+wrapper_start,'opacity:1;').attr('data-'+wrapper_end,'opacity:0;');
			}
		});
	}
	
	// Predict Section 
	if($('#compare').get(0)){
		if(!$('body').hasClass('page-timeline')){
			var predict_start = parseInt($('#dig-deeper').height()+(WindowHeight+scroll_offset));
			var predict_end = predict_start + (WindowHeight+scroll_offset)*2;
			$('#page-wrapper #compare').removeAttributes(null, ['id','class','style']);  // remove data attributes
			$('#page-wrapper div.section-wrapper.compare').attr('data-0','visibility:hidden;').attr('data-'+predict_start,'visibility:visible;');
			$('#page-wrapper div.section-wrapper.compare').attr('data-'+predict_end,'visibility:hidden;');
			$('#page-wrapper div.section-wrapper.compare').height((WindowHeight+scroll_offset)*2);
			$('#page-wrapper div.section-wrapper.compare .section').each(function(index){
				section_start = predict_start;
				section_end = parseInt(section_start+$(this).height());
				section_height = parseInt($(this).height());
				$(this).parent('.section-inner').removeAttributes(null, ['id','class','style']);  // remove data attributes
				$(this).parent('.section-inner').attr('data-0','display:none;').attr('data-'+section_start,'display:block;');
				$(this).removeAttributes(null, ['id','class','style']);  // remove data attributes
				$(this).attr('data-'+section_start,'opacity:0;');
				$(this).attr('data-'+section_end,'opacity:1');
				var timeline_wrapper_start = section_start + (section_height+scroll_offset)*2 - scroll_offset/2;
				var timeline_wrapper_end = timeline_wrapper_start + scroll_offset/2;
				$(this).find('div.timeline-wrapper').removeAttributes(null, ['id','class','style']);  // remove data attributes
				$(this).find('div.timeline-wrapper').attr('data-'+timeline_wrapper_start,'opacity:1').attr('data-'+timeline_wrapper_end,'opacity:0');
				$(this).find('div.text').removeAttributes(null, ['id','class','style']);  // remove data attributes
				$(this).find('div.text').attr('data-'+section_start,'margin-top:'+text_offset+';');
				$(this).find('div.text').attr('data-'+section_end,'margin-top:0;');
				var sub_title_top_margin = -parseInt(section_height)+'px';
				var sub_title_bottom_margin = parseInt(section_height)+'px';
				var sub_title_top_offset = parseInt((section_height/2-130)/2-15)+'px';
				var sub_title_bottom_offset = parseInt((section_height/2-130)/2+20)+'px';
				var timeline_start = section_end + scroll_offset;
				var timeline_end = timeline_start + section_height;
				var timeline_wrapper_end = timeline_start + section_height - 50;
				$(this).find('div.dot-info-wrapper').removeAttributes(null, ['id','class','style']);  // remove data attributes
				$(this).find('div.timeline-top h2').removeAttributes(null, ['id','class','style']);  // remove data attributes
				$(this).find('div.timeline-bottom h2').removeAttributes(null, ['id','class','style']);  // remove data attributes
				$(this).find('div.timeline-inner').removeAttributes(null, ['id','class','style']);  // remove data attributes
				$(this).find('div.timeline').removeAttributes(null, ['id','class','style']);  // remove data attributes
				$(this).find('div.text-wrapper').removeAttributes(null, ['id','class','style']);  // remove data attributes
				$(this).find('div.dot-info-wrapper').attr('data-'+timeline_start,'opacity:0; display:none;');
				$(this).find('div.dot-info-wrapper').attr('data-'+timeline_wrapper_end,'opacity:1; display:block;');
				$(this).find('div.timeline-top h2').attr('data-'+timeline_start,'margin-top:'+sub_title_top_margin+';opacity:0;');
				$(this).find('div.timeline-top h2').attr('data-'+timeline_end,'margin-top:'+sub_title_top_offset+';opacity:1;');
				$(this).find('div.timeline-bottom h2').attr('data-'+timeline_start,'margin-top:'+sub_title_bottom_margin+';opacity:0;');
				$(this).find('div.timeline-bottom h2').attr('data-'+timeline_end,'margin-top:'+sub_title_bottom_offset+';opacity:1;');
				$(this).find('div.timeline-inner').attr('data-'+timeline_start,'opacity:0;');
				$(this).find('div.timeline-inner').attr('data-'+timeline_end,'opacity:1;');
				$(this).find('div.timeline').attr('data-'+timeline_start,'z-index:1;');
				$(this).find('div.timeline').attr('data-'+timeline_end,'z-index:20;');
				$(this).find('div.text-wrapper').attr('data-'+timeline_start,'opacity:1;display:block;');
				$(this).find('div.text-wrapper').attr('data-'+timeline_end,'opacity:0;display:none;');
			});
		}
		else{
			$('#page-wrapper #compare').removeAttributes(null, ['id','class','style']);  // remove data attributes
			$('#page-wrapper div.section-wrapper.compare').height(WindowHeight);
			$('#page-wrapper div.section-wrapper.compare .section').each(function(index){
				section_start = 0;
				section_end = 0;
				section_height = parseInt($(this).height());

				$(this).find('div.text').removeAttributes(null, ['id','class','style']);  // remove data attributes
				$(this).find('div.text').attr('data-'+section_start,'margin-top:'+text_offset+';');
				$(this).find('div.text').attr('data-'+section_end,'margin-top:0;');

				var sub_title_top_margin = -parseInt(section_height)+'px';
				var sub_title_bottom_margin = parseInt(section_height)+'px';
				var sub_title_top_offset = parseInt((section_height/2-130)/2-15)+'px';
				var sub_title_bottom_offset = parseInt((section_height/2-130)/2+20)+'px';
				
				var timeline_start = 0;
				var timeline_end = parseInt(timeline_start + section_height);
				var timeline_wrapper_end = timeline_start + section_height - 50;

				$(this).find('div.dot-info-wrapper').removeAttributes(null, ['id','class','style']);  // remove data attributes
				$(this).find('div.timeline-top h2').removeAttributes(null, ['id','class','style']);  // remove data attributes
				$(this).find('div.timeline-bottom h2').removeAttributes(null, ['id','class','style']);  // remove data attributes
				$(this).find('div.timeline-inner').removeAttributes(null, ['id','class','style']);  // remove data attributes
				$(this).find('div.timeline').removeAttributes(null, ['id','class','style']);  // remove data attributes
				$(this).find('div.text-wrapper').removeAttributes(null, ['id','class','style']);  // remove data attributes

				$(this).find('div.dot-info-wrapper').attr('data-'+timeline_start,'opacity:0; display:none;');
				$(this).find('div.dot-info-wrapper').attr('data-'+timeline_wrapper_end,'opacity:1; display:block;');

				$(this).find('div.timeline-top h2').attr('data-'+timeline_start,'margin-top:'+sub_title_top_margin+';opacity:0;');
				$(this).find('div.timeline-top h2').attr('data-'+timeline_end,'margin-top:'+sub_title_top_offset+';opacity:1;');

				$(this).find('div.timeline-bottom h2').attr('data-'+timeline_start,'margin-top:'+sub_title_bottom_margin+';opacity:0;');
				$(this).find('div.timeline-bottom h2').attr('data-'+timeline_end,'margin-top:'+sub_title_bottom_offset+';opacity:1;');

				$(this).find('div.timeline-inner').attr('data-'+timeline_start,'opacity:0;');
				$(this).find('div.timeline-inner').attr('data-'+timeline_end,'opacity:1;');

				$(this).find('div.timeline').attr('data-'+timeline_start,'z-index:1;');
				$(this).find('div.timeline').attr('data-'+timeline_end,'z-index:20;');

				$(this).find('div.text-wrapper').attr('data-'+timeline_start,'opacity:1;display:block;');
				$(this).find('div.text-wrapper').attr('data-'+timeline_end,'opacity:0;display:none;');
			});
		}
		
	}
	
	// About 
	if($('.scroll-wrapper').get(0)){
		var about_start = parseInt($('.section-wrapper.intro').height()+ $('.section-wrapper.info').height()+$('.section-wrapper.dig-deeper').height()+$('.section-wrapper.compare').height()-1000);
		var about_start_offset = about_start + 500;
		$('#about').removeAttributes(null, ['id','class','style']);  // remove data attributes
		$('#about div.section-inner').removeAttributes(null, ['id','class','style']);  // remove data attributes
		$('#about div.section-inner').attr('data-0','visibility:hidden;');
		$('#about div.section-inner').attr('data-'+about_start,'visibility:visible;');
		$('#about').attr('data-'+about_start,'opacity:0;');
		$('#about').attr('data-'+about_start_offset,'opacity:1;');
		$('#get-involved').attr('data-'+about_start,'opacity:0;');
		$('#get-involved').attr('data-'+about_start_offset,'opacity:1;');
		var imgHeight = parseInt($('#get-involved div.donate').find('img.bg').height());
		if (imgHeight < WindowHeight && imgHeight !=0) WindowHeight = imgHeight;
		$('#get-involved div.donate').css('min-height',WindowHeight);
		var donate_padding = parseInt((WindowHeight - $('#get-involved div.donate div.partners-bottom').height())/2);
		$('#get-involved div.donate div.inner-content').css('padding-top',donate_padding+'px');
		
		/*var scroll_start = about_start + 750;
		var slider_height = $('#about .views-row-first').height() + 205;
		var scroll_height = parseInt(slider_height + $('#get-involved').height()+$('#footer').height());
		var scroll_height_offset = - (scroll_height - WindowHeight)+'px';
		var scroll_end = scroll_start + scroll_height;
		$('.scroll-wrapper').removeAttributes(null, ['id','class','style']);  // remove data attributes
		$('.scroll-wrapper').height(scroll_height);
		$('.scroll-wrapper').attr('data-'+scroll_start,'margin-top:0px;');
		$('.scroll-wrapper').attr('data-'+scroll_end,'margin-top:'+scroll_height_offset);
		$('.scroll-wrapper').css('min-height',WindowHeight);*/

		var scroll_start = parseInt($('.section-wrapper.intro').height()+$('.section-wrapper.info').height()+$('.section-wrapper.dig-deeper').height()+$('.section-wrapper.compare').height()-500);
		var slider_height = $('#about .view-about > .view-content > .cycle-slide-active').height() + 205;
		var scroll_height = parseInt(slider_height + $('#get-involved').height()+$('#footer').height());
		var scroll_height_offset = - (scroll_height - WindowHeight)+'px';
		var scroll_end = scroll_start + scroll_height;
		$('.scroll-wrapper').removeAttributes(null, ['id','class','style']);  // remove data attributes
		$('.scroll-wrapper').height(scroll_height);
		$('.scroll-wrapper').attr('data-'+scroll_start,'margin-top:0px;z-index:1;');
		$('.scroll-wrapper').attr('data-'+scroll_end,'margin-top:'+scroll_height_offset+'px; z-index:2;');
		$('.scroll-wrapper').attr('data-0','z-index:0;');
		var pre_scroll_start = scroll_start - 1000;
		$('.scroll-wrapper').attr('data-'+pre_scroll_start,'z-index:0;');
		//$('.scroll-wrapper').attr('data-'+(scroll_start-100),'z-index:0;');
		var get_involved_start = scroll_start+slider_height+500+100-205;
		$('#header div.menu div.content ul li a.get-involved').attr('data-menu-top',get_involved_start);
	}
}

function initActiveSection(){
	if(!$('html').hasClass('skrollr-mobile') && !$('body').hasClass('page-timeline')){
		var section = window.location.hash;
		var current_section = 0;
		var scroll_offset = 500;
	
		$('#header div.menu div.content > ul.menu > li > a').each(function(index){
			$(this).parent().find('div.drop ul li a:first').addClass('active');
			if($(this).attr('rel') == section){
				if($(this).hasClass('dig-deeper')){
					current_section = parseInt((WindowHeight + scroll_offset)*2 + WindowHeight);
				}
				if($(this).hasClass('compare')){
					current_section = parseInt($('#dig-deeper').height()+ WindowHeight*2 + scroll_offset);
				}
				if($(this).hasClass('about')){
					current_section = parseInt($('.section-wrapper.intro').height()+$('.section-wrapper.info').height()+$('.section-wrapper.dig-deeper').height()+$('.section-wrapper.compare').height()+500);
				}
				if($(this).hasClass('get-involved')){
					current_section = parseInt($('.section-wrapper.intro').height()+$('.section-wrapper.info').height()+$('.section-wrapper.dig-deeper').height()+$('.section-wrapper.compare').height()+$('#about .views-row.cycle-slide-active').height() + 500 - 100);
				}
				$(this).addClass('active');
				$.scrollTo(current_section, 500);
			}
			else{
				if(section == '#/featured'){
					//current_section = section.replace('/','');
					current_section = parseInt(WindowHeight+50);
					$.scrollTo(current_section, 500);
				}
				if(section == '#/info'){
					//current_section = section.replace('/','');
					current_section = parseInt(WindowHeight*2);
					$.scrollTo(current_section, 500);
				}
			}
		});
		$('#header #logo a,#footer a.logo, #page-wrapper div.section-wrapper.info div.bottom-arrow a.bottom, #header div.menu div.content > ul > li.dig-deeper ul li a, #page-wrapper div.section-wrapper.dig-deeper div.text a.arrow,#page-wrapper div.section-wrapper.compare div.text a.arrow, #page-wrapper div.bottom-arrow a.bottom,#page-wrapper div.section-wrapper.intro div.question a.arrow').click(function(){
			scrolling = false;
			setTimeout(function() {
				scrolling = true;
			}, 1000);
			if ($.browser.msie && $.browser.version <= 9.0) {
				scrolling = true;
				var top = $(this).attr('data-menu-top');
				if (top == 0) scrolling = false;
				$.scrollTo(top, 500,function(){
					if (top == 0) {
						window.location.hash = '#/home';
					}
				});
			}
			
		});
		if(window.pageYOffset < WindowHeight + 500){
			$('#header div.menu div.content > ul.menu > li > a').removeClass('active');
			$('#page-wrapper #intro-text video.video-bg').show();
		}
		else{
			$('#page-wrapper #intro-text video.video-bg').hide();
		}
		$(window).scroll(function(){
			if (scrolling == true){
				if(window.pageYOffset == 0){
					window.location.hash = '#/home';
				}
				if(window.pageYOffset < WindowHeight + 500){
					$('#header div.menu div.content > ul.menu > li > a').removeClass('active');
					$('#page-wrapper #intro-text video.video-bg').show();
				}
				else{
					$('#page-wrapper #intro-text video.video-bg').hide();
				}
				var hash = active_section_id = '';

				var dig_deeper_start = parseInt((WindowHeight + scroll_offset)*2 + WindowHeight - 50);
				var compare_start = parseInt($('#dig-deeper').height()+ WindowHeight + scroll_offset*2 -50);
				
				var timeline_start = timeline_end = 0;
				if ($('#compare').get(0)){
					var compare_data = $('#compare').data();
					var timeline_data = $('#compare div.dot-info-wrapper').data();
					
					for(var i in compare_data) {
						if (timeline_end < i || timeline_end == 0) timeline_end = i;
					}
					
					for(var i in timeline_data) {
						if (timeline_start > i || timeline_start == 0) timeline_start = i;
					}
					
					//timeline_start = parseInt(timeline_start) - 300;
					//timeline_end = parseInt(timeline_end) + 300;
				}
				
				
				var about_start = parseInt($('.section-wrapper.intro').height()+$('.section-wrapper.info').height()+$('.section-wrapper.dig-deeper').height()+$('.section-wrapper.compare').height()-500-50);
				var get_involved_start = parseInt($('.section-wrapper.intro').height()+$('.section-wrapper.info').height()+$('.section-wrapper.dig-deeper').height()+$('.section-wrapper.compare').height()+$('#about .views-row.cycle-slide-active').height());

				if(window.pageYOffset < WindowHeight){
					hash = '#/home';
				}

				if(window.pageYOffset > WindowHeight){
					hash = '#/featured';
				}

				if(window.pageYOffset > WindowHeight + scroll_offset/2 - 100){
					hash = '#/info';
				}

				if(window.pageYOffset > dig_deeper_start){
					active_section_id = 'dig-deeper';
					$('#header div.menu div.content > ul.menu > li > a').each(function(index){
						if($(this).attr('href') == '#'+active_section_id){
							$('#header div.menu div.content > ul.menu > li > a').removeClass('active');
							$(this).addClass('active');
							hash = '#/'+active_section_id;
							var dig_deeper_start = WindowHeight + 500 + WindowHeight - 74;
							var dig_deeper_section_height = (WindowHeight-74+500)*2;
							var sub_sections_count = $(this).parent().find('div.drop ul li a').size();
							var position_offset = parseInt((window.pageYOffset - dig_deeper_start)/dig_deeper_section_height);
							$(this).parent().find('div.drop ul li a').each(function(index){
								$(this).removeClass('active');
								if(position_offset == index){
									$(this).addClass('active');
								}
							});
							if(!$(this).parent().find('div.drop ul li a').hasClass('active')){
								$(this).parent().find('div.drop ul li a:first').addClass('active');
							}
						}
					});
				}

				if(window.pageYOffset > compare_start){
					active_section_id = 'compare';
					$('#header div.menu div.content ul.menu > li > a').each(function(index){
						if($(this).attr('href') == '#'+active_section_id){				
							$('#header div.menu div.content > ul.menu > li > a').removeClass('active');
							$(this).addClass('active');
							hash = '#/'+active_section_id;
						}
					});
				}
				

				if(window.pageYOffset > about_start){
					active_section_id = 'about';
					$('#header div.menu div.content ul.menu > li > a').each(function(index){
						if($(this).attr('href') == '#'+active_section_id){				
							$('#header div.menu div.content > ul.menu > li > a').removeClass('active');
							$(this).addClass('active');
							//hash = '#/'+active_section_id+'#';
							hash = $('#header div.menu div.content > ul.menu > li.about ul li.cycle-pager-active a').attr('rel');
						}
					});
				}

				if(window.pageYOffset > get_involved_start){
					active_section_id = 'get-involved';
					$('#header div.menu div.content ul.menu > li > a').each(function(index){
						if($(this).attr('href') == '#'+active_section_id){				
							$('#header div.menu div.content > ul.menu > li > a').removeClass('active');
							$(this).addClass('active');
							hash = '#/'+active_section_id;
						}
					});
				}

				if(window.location.hash !== hash){
					window.location.hash = hash;
				}
					
				if((window.pageYOffset < timeline_start && window.pageYOffset < timeline_end) || ( window.pageYOffset > timeline_end)) {
					if ($('#compare a.close').get(0)) {
						$('#compare a.close').click();
					}
					
				}
			}
		});

		var hash = window.location.hash;
		hash = unescape(hash);
		var hashes = hash.split("#/");
		var current_hash = hashes[1];
		if (current_hash == undefined) return;
		if(typeof(hashes[2]) != "undefined"){
			$('#header div.menu div.content ul li.about ul li a').each(function(index){
				if($(this).attr('rel') == hash){
					$('#about div.slider > .view-about > .view-content').cycle('goto', index);
				}
			});
		}

	}
	
}


function initSlider(){
	if($('#get-involved div.partners div.film div.slider div.item').size() > 1){
		$('#get-involved div.partners div.film div.slider').prepend('<div class="pager"><a href="#" class="prev">prev</a><a href="#" class="next">next</a></div>')
		$('#get-involved div.partners div.film div.slider').cycle({
			timeout : 0,
			slides : '> div.item',
			prev : '> div.pager > a.prev',
			next : '> div.pager > a.next'
		});
	}

	if($('#about div.slider div.item').size() > 1){
		var window_offset = parseInt(WindowHeight);
		var content_offset = parseInt(window_offset/2);
		$('#about section.about').prepend('<a href="#/about" class="cycle-prev">prev</a><a href="#/about" class="cycle-next">next</a>');
		$('#about div.slider > .view-about > .view-content > .views-row').each(function(index){
			var pager_text = $(this).find('div.item').attr('rel');
			var pager_title = pager_text.toLowerCase().replace(/ /g, '-');
			$(this).attr('data-cycle-pager-template','<li><a rel="#/about/#/'+pager_title+'" href="#about">'+pager_text+'</a></li>');
		});
		$('#about div.slider > .view-about > .view-content').cycle({
			timeout : 0,
			slides : '> div.views-row',
			prev : '#about section.about a.cycle-prev',
			next : '#about section.about a.cycle-next',
			autoHeight : 'container',
			pager: '#header div.menu div.content ul li.about ul'
		});
		$('#about div.slider > .view-about > .view-content').on('cycle-after', function( event, opts ) {	
		    // your event handler code here
		    // argument opts is the slideshow's option hash
		    var scroll_start = parseInt($('.section-wrapper.intro').height()+$('.section-wrapper.info').height()+$('.section-wrapper.dig-deeper').height()+$('.section-wrapper.compare').height()-500);
			var slider_height = $('#about .view-about > .view-content').height() + 205;
			var scroll_height = parseInt(slider_height + $('#get-involved').height()+$('#footer').height());
			var scroll_height_offset = - (scroll_height - WindowHeight)+'px';
			var scroll_end = scroll_start + scroll_height;
			$('.scroll-wrapper').removeAttributes(null, ['id','class','style']);  // remove data attributes
			$('.scroll-wrapper').height(scroll_height);
			$('.scroll-wrapper').attr('data-'+scroll_start,'margin-top:0px; z-index:1');
			$('.scroll-wrapper').attr('data-'+scroll_end,'margin-top:'+scroll_height_offset+'px; z-index:1;');
			$('.scroll-wrapper').attr('data-0','z-index:0');
			var get_involved_start = scroll_start+parseInt($('#about .view-about > .view-content').height()+500+100);
			$('#header div.menu div.content ul li a.get-involved').attr('data-menu-top',get_involved_start);
			s.refresh();
			if(!$('html').hasClass('skrollr-mobile')){
				$.scrollTo(scroll_start , 0);
			}
		});
		$('#header div.menu div.content ul li.about ul li > a').click(function(index){
			$('#header div.menu div.content ul li.about ul li > a').removeClass('active');
			$(this).addClass('active');
			if(!$('html').hasClass('skrollr-mobile')){
				if($(this).parent('li').hasClass('cycle-pager-active')){
					var scroll_start = parseInt($('.section-wrapper.intro').height()+$('.section-wrapper.info').height()+$('.section-wrapper.dig-deeper').height()+$('.section-wrapper.compare').height()-500);
					$.scrollTo(scroll_start , 500);
				}
			}
			
		});
	}
}

function initProtagonists(){
	$('#about div.wrapper').each(function(index){
		$(this).find('div.person-thumbs div.views-row-first div.item').addClass('active');
		$(this).find('div.views-row-first div.person').show();
	});
	$('#about div.wrapper div.person-thumbs div.item').each(function(index){
		$(this).hover(
			function(){
				$(this).find('div.overlay').fadeIn(300);
				$(this).addClass('hover');
			}, 
			function(){
				if(!($(this).hasClass('active'))){
					$(this).find('div.overlay').fadeOut(300);
					$(this).removeClass('hover');
				}
			}
		);
		var person_info = '';
		
		$(this).click(function(){
			person_info = $(this).attr('rel');
			$(this).parents('div.person-thumbs').find('div.item').removeClass('active').removeClass('hover');
			$(this).parents('div.person-thumbs').find('div.item div.overlay').hide();
			$(this).addClass('active');
			$(this).find('div.overlay').show();
			$(this).parents('.protagonists').find('div.person').each(function(index){
				if($(this).attr('rel') == person_info){
					$(this).parents('.protagonists').find('div.person').hide();
					$(this).fadeIn(500);
					if($(this).parents('.protagonists').hasClass('full-width')){
						var new_block_height = $(this).parents('.protagonists').height();
						$('#about div.slider > div.view-about > div.view-content').height(initial_about_height-initial_block_height+new_block_height);
					}
					var initial_about_height = parseInt(parseInt($(this).parents('.wrapper').height())+150+55)+'px';
					var initial_block_height = parseInt(parseInt($(this).parents('.wrapper').height())+55)+'px';
					$('#about').height(initial_about_height);
					$('#about .view-about > .view-content').height(initial_block_height);
				}
			});
		});
	});
}

function initHovers(){
	$('#page-wrapper .section div.video').on('touchend', function(){
		$('#page-wrapper .section div.video').find('div.overlay').fadeIn(300);
		$('#page-wrapper .section div.video').find('div.text,div.overlay-blue').fadeOut(300);
		$('#page-wrapper .section div.video').removeClass('hover');
		$(this).find('div.text,div.overlay-blue').fadeIn(300);
		$(this).find('div.overlay').fadeOut(300);
		$(this).addClass('hover');
	});
	$('#page-wrapper .section div.video').each(function(index){
		$(this).find('div.text').show();
		var link_height = $(this).find('div.text h2 a').height();
		var link_padding_top = link_padding_bottom = tags_padding = 0;
		//if($(this).parents('.section').hasClass('featured')){
			link_padding_top = link_padding_bottom = parseInt(($(this).height()-link_height)/2)+'px';
			tags_padding = parseInt(link_padding_bottom) - 75 +'px';
			$(this).find('div.text h2 a').css('padding-top',link_padding_top);
			$(this).find('div.text h2 a').css('padding-bottom',link_padding_bottom);
			$(this).find('div.tags').css('bottom',tags_padding);
	/*	}
		else{
			link_padding_top = parseInt(($(this).height()-link_height)/2+75)+'px';
			link_padding_bottom = parseInt(($(this).height()-link_height)/2-75)+'px';
			tags_padding = parseInt(link_padding_bottom) - 75 +'px';
			$(this).find('div.text h2 a').css('padding-top',link_padding_top);
			$(this).find('div.text h2 a').css('padding-bottom',link_padding_bottom);
			$(this).find('div.tags').css('bottom',tags_padding);
		}*/
		$(this).find('div.text').hide();
		$(this).hover(
			function(){
				$(this).find('div.text,div.overlay-blue').fadeIn(300);
				$(this).find('div.overlay').fadeOut(300);
				$(this).addClass('hover');
			}, 
			function(){
				$(this).find('div.overlay').fadeIn(300);
				$(this).find('div.text,div.overlay-blue').fadeOut(300);
				$(this).removeClass('hover');
			}
		);
	});
	var sectors_count = $('#page-wrapper .section div.timeline-inner div.sector').size();
    var sectors_width = parseInt(100/sectors_count)+'%';
    $('#page-wrapper .section div.timeline-inner div.sector').width(sectors_width);
	$('#page-wrapper .timeline div.timeline-inner a.dot').each(function(index){
		var dot_info = '';
		$(this).hover(
			function(){
				var current_dot_rel,$current_dot;
				var next_dot_rel = $(this).attr('rel');
				var $next_dot = $("#page-wrapper .section .dot-info[rel='"+next_dot_rel+"']");
				if ($('#page-wrapper .section div.timeline-inner a.dot.hover').get(0)) {
					current_dot_rel = $('#page-wrapper .section div.timeline-inner a.dot.hover').attr('rel');
					$current_dot = $("#page-wrapper .section .dot-info[rel='"+current_dot_rel+"']");
				}
				$('#page-wrapper .timeline-wrapper a.close').show();
				$('#page-wrapper .section div.timeline-inner a.dot').removeClass('hover');
				$(this).addClass('hover');
				
				$('#page-wrapper .section .timeline-top h2,#page-wrapper .section .timeline-bottom h2').fadeOut(500);
				
				
				if (current_dot_rel == next_dot_rel ) return false;
				
				if (current_dot_rel) {
					$next_dot.css({ visibility : 'visible' });
					$next_dot.animate({opacity: 1}, 500);
					$current_dot.animate({opacity : 0},500,function(){
						$current_dot.css({ visibility : 'hidden' });
					});
					
				} else {
					$('#page-wrapper .section .dot-info').css({'opacity':0, visibility : 'hidden'});
					$next_dot.css({ visibility : 'visible' });
					$next_dot.animate({opacity: 1}, 500, function() {});
				}
				
				
			}, 
			function(){}
		);
		$(this).on('touchstart', function(){
				var current_dot_rel,$current_dot;
				var next_dot_rel = $(this).attr('rel');
				var $next_dot = $("#page-wrapper .section .dot-info[rel='"+next_dot_rel+"']");
				if ($('#page-wrapper .section div.timeline-inner a.dot.hover').get(0)) {
					current_dot_rel = $('#page-wrapper .section div.timeline-inner a.dot.hover').attr('rel');
					$current_dot = $("#page-wrapper .section .dot-info[rel='"+current_dot_rel+"']");
				}
				$('#page-wrapper .timeline-wrapper a.close').show();
				$('#page-wrapper .section div.timeline-inner a.dot').removeClass('hover');
				$(this).addClass('hover');
				
				$('#page-wrapper .section .timeline-top h2,#page-wrapper .section .timeline-bottom h2').fadeOut(500);
				
				
				if (current_dot_rel == next_dot_rel ) return false;
				
				if (current_dot_rel) {
					$next_dot.css({ visibility : 'visible' });
					$next_dot.animate({opacity: 1}, 500);
					$current_dot.animate({opacity : 0},500,function(){
						$current_dot.css({ visibility : 'hidden' });
					});
					
				} else {
					$('#page-wrapper .section .dot-info').css({'opacity':0, visibility : 'hidden'});
					$next_dot.css({ visibility : 'visible' });
					$next_dot.animate({opacity: 1}, 500, function() {});
				}
			}
		);
		$(this).click(function(){
			return false;
		});
		$('#page-wrapper .timeline-wrapper a.close').on('touchstart', function(){
			$(this).hide();
			$('#page-wrapper .section .timeline-top h2,#page-wrapper .section .timeline-bottom h2').fadeIn(500);
			$('#page-wrapper .section div.timeline-inner a.dot').removeClass('hover');
			$('#page-wrapper .section .dot-info').css('visibility','hidden');
		});
		$('#page-wrapper .timeline-wrapper a.close').click(function(){
			$(this).hide();
			$('#page-wrapper .section .timeline-top h2,#page-wrapper .section .timeline-bottom h2').fadeIn(500);
			$('#page-wrapper .section div.timeline-inner a.dot').removeClass('hover');
			$('#page-wrapper .section .dot-info').css('visibility','hidden');
			return false;
		});
	});
	$('#page-wrapper div.text a.arrow').hover(
		function(){
			$(this).animate({
				opacity: 1
			}, 200, function() {
			// Animation complete.
			});
		}, 
		function(){
			$(this).animate({
				opacity: 0.7
			}, 200, function() {
			// Animation complete.
			});
		}
	);
	/*$('#header #logo a,#footer a.logo').click(function(){
		$('#header div.menu div.content ul li a').removeClass('active');
		window.location.hash = '#/home';
		CurrentHash = '#/home'; 
		$.scrollTo(0, 500);
	});*/
	$('#header #logo a,#footer a.logo').attr('data-menu-top',0);
	$('#header div.menu div.content > ul > li > a').click(function(){
		$('#header div.menu div.content > ul > li > a').removeClass('active');
		$(this).addClass('active');
		if($(this).hasClass('dig-deeper')){
			//$.scrollTo(WindowHeight*2+500, 500);
		}
		else{
			section = $(this).attr('href');
			current_section = section.replace('/','');
			//$.scrollTo(current_section, 500);
		}
		//return false;
		scrolling = false;
		setTimeout(function() { scrolling = true }, 1000);
		if ($.browser.msie && $.browser.version <= 9.0) {
				scrolling = true;
				var top = $(this).attr('data-menu-top');
				$.scrollTo(top, 500,function(){});
			}
		$(this).addClass('active');
		
	});
	$('#header div.menu div.content > ul > li.dig-deeper ul li a').each(function(index){
		$(this).click(function(e){
			$('#header div.menu div.content > ul > li.dig-deeper ul > li > a').removeClass('active');
			$(this).addClass('active');
		});
	});
}

function initBackgroundVideo(){
	var window_ratio = WindowWidth/WindowHeight;
	$('#page-wrapper video.video-bg').each(function(index){
		$(this).bind('loadedmetadata', function(){
		    var rawWidth = $(this).prop('videoWidth');
		    var rawHeight = $(this).prop('videoHeight');
		    var video_ratio = rawWidth/rawHeight;
		    if(video_ratio > window_ratio){
				$(this).width('auto').height(WindowHeight);
			}
			else{
				$(this).width('100%').height('auto');
			}
		});
	});
	$('#page-wrapper div.field-name-field-background-image div.field-item img').each(function(index){
		var imgWidth = $(this).attr('width');
		var imgHeight = $(this).attr('height');
		var img_ratio = imgWidth/imgHeight;
		if(img_ratio > window_ratio){
			$(this).width('auto').height(WindowHeight);
		}
		else{
			$(this).width(WindowWidth).height('auto');
		}
	});
}

function initFeedback(){
	if($('#feedback').get(0)){
		$('#feedback form #edit-actions input.form-submit').addClass('disabled').attr('disabled', true);
		$('#feedback form').bind('change keyup', function() {
		    if($(this).validate().checkForm()) {
		        $('#feedback form #edit-actions input.form-submit').removeClass('disabled').attr('disabled', false);
		    } else {
		        $('#feedback form #edit-actions input.form-submit').addClass('disabled').attr('disabled', true);
		    }
		});
		$('#feedback form').validate({
			submitHandler: function(form) {
				$(form).ajaxSubmit();
			}
		});
		$('#feedback label').inFieldLabels();
		$('#footer a.feedback').fancybox({
			padding	: 0,
			helpers : {
		        overlay : {
		            css : {
		                'background' : 'rgba(00, 00, 00, 0.8)'
		            },
					closeClick: false
		        }
		    },
			beforeShow  : function(){
				$('.fancybox-skin').addClass('feedback');
			},
			afterClose : function(){
				$('.fancybox-skin').removeClass('feedback');
			}
		});
		$('#footer a.feedback').on("click",function(e){
			e.preventDefault();
		});
	}
}

function initTextAnimation(){
	$('.tlt').textillate({
	  // the default selector to use when detecting multiple texts to animate
	  selector: '.texts',
	  // enable looping
	  loop: true,
	  // sets the minimum display time for each text before it is replaced
	  minDisplayTime: 1000000,
	  // sets the initial delay before starting the animation
	  // (note that depending on the in effect you may need to manually apply 
	  // visibility: hidden to the element before running this plugin)
	  initialDelay: 0,
	  // set whether or not to automatically start animating
	  autoStart: true,
	  // custom set of 'in' effects. This effects whether or not the 
	  // character is shown/hidden before or after an animation  
	  inEffects: [],
	  // custom set of 'out' effects
	  outEffects: [],
	  // in animation settings
	  in: {
	    // set the effect name
	    effect: 'fadeIn',
	    // set the delay factor applied to each consecutive character
	    delayScale: 1.5,
	    // set the delay between each character
	    delay: 50,
	    // set to true to animate all the characters at the same time
	    sync: false,
	    // randomize the character sequence 
	    // (note that shuffle doesn't make sense with sync = true)
	    shuffle: false
	  },
	  // out animation settings.
	  out: {
	    effect: 'fadeOut',
	    delayScale: 1.5,
	    delay: 50,
	    sync: false,
	    shuffle: false,
	  }
	});
}

function InitPlayerOnHash(hash) {
	hash = unescape(hash);
	
	var hashes = hash.split("#/");
	var video_hash = hashes[1];
	if (video_hash == undefined) return;
	if (video_hash.indexOf("video") != -1) { 
		video_hash = video_hash.replace(new RegExp('-', 'g'), '_');
		video_hash = video_hash.replace(new RegExp('/', 'g'), '-');
		var trigger_id = 0;
		
		
		if(typeof(hashes[2]) != "undefined"){
			trigger_id = hashes[2];
			//trigger_id = trigger_id.replace('trigger_','');
		}
		if ($('a[data-url='+video_hash+']').get(0)){
			var url = $('a[data-url='+video_hash+']').attr('href');
			var data = 'player_show=1';
			var $videopopup = $('#video-popup');
			$.ajax({
				type: 'get',
				url: url,
				data: data,
				success: function(msg){
					scrolling = false;
					$videopopup.html(msg);
					var ID = $('#video-popup div.video-id').attr('data-id');
					looplayer.init({
						videoId : ID,
						trigger_id : trigger_id
					});
					$('#video-popup').attr('data-hash','#');
				}
			});
		}
		
	}
}

function initPlayer(){
	$('body').append('<div id="video-popup" />');
	
	var hash = window.location.hash;
	
	if (hash) {
		
		InitPlayerOnHash(hash);
		
	}
	
	
	if ($('#page .node-rich-media div.video-id').get(0)) {
		//var window_height = $(window).height();
		//$('.node-type-rich-media #page .node-rich-media').height(window_height);
		var ID = $('#page .node-rich-media div.video-id').attr('data-id');
		var trigger_id = 0;
		looplayer.init({
			videoId : ID
		});
	}
	
	$('.category-wrapper .video h2 a').on('click',function(){
		var url = $(this).attr('href');
		var data = 'player_show=1';
		var $videopopup = $('#video-popup');
		var video_url = url.replace(Drupal.settings.basePath,'');
		var scrollTop;
		var hash = window.location.hash;
		scrollTop = $(window).scrollTop();
		
		$.ajax({
			type: 'get',
			url: url,
			data: data,
			success: function(msg){
				$videopopup.html(msg);
				var ID = $('#video-popup div.video-id').attr('data-id');
				looplayer.init({
					videoId : ID
				});
				$videopopup.attr('data-hash',hash);
				$videopopup.attr('data-scrollTop',scrollTop);
				window.location.hash = '#/'+video_url;
				CurrentHash = '#/'+video_url;
				scrolling = false;
				setTimeout(function(){$.scrollTo(scrollTop , 0); },10);
			}
		});
		return false;
	});
	
	$('div.dot-info-wrapper a.play, div.dot-info-wrapper a.more:not(.take-action)').on('click',function(){
		var url = $(this).attr('href');
		var data = 'player_show=1';
		var $videopopup = $('#video-popup');
		var video_url = url.replace(Drupal.settings.basePath,'');
		scrolling = false;
		/*var scrollTop;
		var hash = window.location.hash;
		scrollTop = $(window).scrollTop();*/
		$.ajax({
			type: 'get',
			url: url,
			data: data,
			success: function(msg){
				$videopopup.html(msg);
				var ID = $('#video-popup div.video-id').attr('data-id');
				looplayer.init({
					videoId : ID
				});
			}
		});
		return false;
	});
}


var tagsclick = false; 
function initTypeToSearch() {
	
	if ($('body').hasClass('page-search-video')) {
		$('div.search-results').css('position','relative');
		initSearch();
	}
	$('body').append('<div id="seach-result"><a href="#" class="close">close</a><div class="search-inner"></div></div>');
	$('#seach-result').hide();
	$('#seach-result a.close').on('click',function(){
		$('#seach-result').hide();
		if (tagsclick) {
			looplayer.play();
		}
		return false;
	});
	
	
	$(document).on("keydown",function(e){
		if((!$(e.target).is("input[type=text]"))&&(e.keyCode>=65&&e.keyCode<=90||e.keyCode>=48&&e.keyCode<=57)){
			openSearchPopup();
		}
	});
	
	$(document).on("keyup",function(e){
		if($('body').hasClass("in-search")&&e.keyCode==27) {
			closeSearchPopup();
		}
	});
	
	$('#type_to_search').find('a.close').on("click",function(e){
		e.preventDefault();
		closeSearchPopup();
	});
	
	$('#type_to_search form').submit(function(){
		
		var keywords = $('#edit-keywords').val();
		if ($('#video-popup #btn-close').get(0)) {
			$('#video-popup #btn-close').click();
		}
		$('#edit-keywords').blur();
		$.ajax({
			type: 'get',
			url: Drupal.settings.basePath + 'search/video/'+keywords,
			data : 'is_ajax=1',
			success: function(msg){
				closeSearchPopup();
				
				$('#seach-result .search-inner').html(msg);
				$('#seach-result').show();
				initSearch();
			}
		});
		return false;
	});
	
	$('#search_button').on("click",function(e){
		e.preventDefault();
		openSearchPopup();
		return false;
	});
	
	$('#edit-keywords').on("keyup",$.debounce(250,function(e){
		var keywords = $(this).val();
		if(keywords.length>2 && e.keyCode!=27) {
			doSearch(keywords);
		}
	}));
	
	function openSearchPopup() {
		var $type_to_search = $('#type_to_search');
		if($type_to_search.hasClass("hide")){
			$('body').addClass("in-search"),
			$type_to_search.removeClass("hide"),
			$('#edit-keywords').focus();
		}
		$type_to_search.find('.related-search, .top-search').hide();
	}

	function closeSearchPopup() {
		var $type_to_search = $('#type_to_search');
		$type_to_search.addClass("hide");
		$('body').removeClass("in-search");
		setTimeout(function(){
			$('#edit-keywords').blur().val("");
			$type_to_search.addClass("hide");
		},300);
	}
	
	function doSearch(keywords){
		$.ajax({
			url:Drupal.settings.basePath + 'related-search/json',
			data:{keywords:keywords},
			dataType:"json",
			cache:"false",
			success:function(data){
				var $results = buildSearchResults(data);
				$('#type_to_search').find('div.related-search').html($results);
				$('#type_to_search').find('.related-search, .top-search').show();
				if ($results == '') {
					$('#type_to_search').find('div.related-search').hide();
				}
			}
		});
	}
	
	function buildSearchResults(data) { 
		var $keywords;
		var has_keywords = false;
		if(data.keywords) {
			$keywords = $('<h2>Related Searches:</h2>');
			$(data.keywords).each(function(index, entry) {
				var $line = $('<div class="item">'+entry+'</div>');
				$keywords.append($line);
				has_keywords = true;
			});
			if (!has_keywords) $keywords = '';
		}
		return $keywords;
	}
	
	
	$(document).on('click', '#type_to_search div.top-search li,#type_to_search div.related-search .item', function(){
		var val = $(this).text();
		$('#edit-keywords').val(val);
		$('#edit-keywords').parents('form').submit();
	});
	
	
	$(document).on('click', '#vidbox-markers-popup .popup .tags a', function(){
		var keywords = $(this).text();
		tagsclick = true;
		$.ajax({
			type: 'get',
			url: Drupal.settings.basePath + 'search/video/'+keywords,
			data : 'is_ajax=1',
			success: function(msg){
				$('#seach-result .search-inner').html(msg);
				$('#seach-result').show().css('zIndex','1002');
				initSearch();
			}
		});
		return false;
		
	});
	
	$(document).on('click', '#btn-close', function(){
		looplayer.destroy();
		scrolling = true;
		$('#video-popup').html('');
		var hash = $('#video-popup').attr('data-hash');
		var scrollTop = $('#video-popup').attr('data-scrolltop');
		if (hash) {
			window.location.hash = hash;
			CurrentHash = hash;
		}
		if (scrollTop != undefined) {
			$.scrollTo(scrollTop , 0);
		}
		$.fancybox.hideLoading();
		return false;
	});
	
}

function initSearch(){
	var trigger_id = 0;
	var $videoitems = $('div.video-results div.video-item');
	var $select = $('div.filter select.sort');
	
	$select.selectBox();
	
	$select.change(function(){
		var val = $(this).val();
		var attr = 'data-'+val;
		
		$('#video-holder').hide(0,function(){
			$('#video-holder').remove();
		});
		
		$("#search-result-sort").find('div.sort').removeAttr('rel');
		$("#search-result-sort").jSort({
			sort_by: 'div.sort-item',
			item: 'div.sort',
			order: 'desc',
			sort_by_attr: true,
			attr_name: attr,
		});

		$("#search-result-sort").find('div.sort').each(function(i){
			console.log(i);
			$(this).attr('data-index',(i+1));
		});
	});
	
	$videoitems.hover(
		function(){
			$(this).find('h3.title,div.overlay').fadeIn(300);
			$(this).addClass('hover');
		}, 
		function(){
			$(this).find('h3.title,div.overlay').fadeOut(300);
			$(this).removeClass('hover');
		}
	);
	
	$videoitems.click(function(){
		var html = $(this).find('div.description').html();
		var data_index = $(this).parents('div.sort').attr('data-index');
		 
		if (data_index) {
			element_position = data_index;
		} else {
			element_position = $videoitems.index($(this)) + 1;
		}
		
		var line_position = (element_position / 3);
		var pos = element_position%3;
		var math = Math.round(line_position + 0.4);
		var show_video = (math * 3)-1;
		var all = $videoitems.size();
		if (show_video >= all) show_video = all - 1;
		if (pos == 0) class_name = 'right';
		if (pos == 1) class_name = 'left';
		if (pos == 2) class_name = 'center';
		if (!$('#video-holder').get(0)) {
			appendVideoHolder(show_video,html,class_name);
		} else{
			if ($('#video-holder').attr('data-show') == show_video ) {
				$('#video-holder').removeClass().addClass(class_name);
				$('#video-holder div.inner').html(html);
			} else {
				$('#video-holder').slideUp(500,function(){
					$('#video-holder').remove();
					appendVideoHolder(show_video,html,class_name);
				});
			}
			
		}

		return false;
	});
	
	function appendVideoHolder(show_video,html,class_name) {
		$('#search-result-sort div.sort:eq('+show_video+')').after('<div id="video-holder"><div class="inner"></div></div>');
		$('#video-holder div.inner').html(html);
		$('#video-holder').hide().addClass(class_name);
		$('#video-holder').slideDown(500,function(){});
		$('#video-holder').attr('data-show',show_video);
		$('#video-holder').prepend('<a class="close" href="">close</a><span class="arrow" />');
		$('#video-holder').find('a.close').click(function(){
			$('#video-holder').slideUp(500,function(){
				$('#video-holder').remove();
			});
			return false;
		});
		
	}
	
	
	
	$(document).on('click', '#video-holder a.link', function(){
		var url = $(this).attr('href');
		var data = 'player_show=1';
		var $videopopup = $('#video-popup');
		if ($('#seach-result').css('zIndex') == 1002) {
			$('#seach-result').css('zIndex','1000');
		}
		tagsclick = false;
		
		var video_url = url.replace(Drupal.settings.basePath,'');
		var scrollTop;
		var hash = window.location.hash;
		scrollTop = $(window).scrollTop();
		
		$.ajax({
			type: 'get',
			url: url,
			data: data,
			success: function(msg){
				$videopopup.html(msg);
				var ID = $('#video-popup div.video-id').attr('data-id');
				looplayer.init({
					videoId : ID,
					trigger_id : trigger_id
				});
				$videopopup.attr('data-hash',hash);
				$videopopup.attr('data-scrollTop',scrollTop);
				window.location.hash = '#/'+video_url;
				CurrentHash = '#/'+video_url;
				scrolling = false;
				setTimeout(function(){$.scrollTo(scrollTop , 0); },10);
			}
		});
		return false;
	});
	
	$(document).on('click', '#video-holder div.image img, #video-holder div.text h3, #video-holder div.item a', function(){
		if ($(this).hasClass('hint')) {
			trigger_id = $(this).attr('data-id');
		} else trigger_id = 0;
		$('#video-holder div.text a.link').click();
		return false;
	});
	
	
}


$(window).on('hashchange', function() {
	var hash = window.location.hash;
	if (hash != CurrentHash) {
		if ($('#video-popup').find('div.node').get(0)) {
			$('#btn-close').click();
		} else {
			if (hash != '') { 
				InitPlayerOnHash(hash);
				window.location.hash = hash;
			}
		}
	}
});

})(jQuery);