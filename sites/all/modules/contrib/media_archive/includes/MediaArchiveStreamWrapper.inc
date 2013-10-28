<?php

/**
 *  @file
 *  Create a Archive Stream Wrapper class for the Media/Resource module.
 */

/**
 *  Create an instance like this:
 *  $archive = new ResourceArchiveStreamWrapper('archive://?v=[video-code]');
 */
class MediaArchiveStreamWrapper extends MediaReadOnlyStreamWrapper {

  // Overrides $base_url defined in MediaReadOnlyStreamWrapper.
  protected $base_url = 'http://archive.org/file';

  protected function _parse_url($url) {
    $path = explode('://', $url);
    $parts = explode('/',  $url[1]);

    $properties = MediaInternetArchiveHandler::getVideoProperties($path[1]);
    $params['v'] = $path[1];
	
	foreach ($properties['files'] as $filepath => $file) {
		if ($file['format'] == 'Animated GIF') {
			$thumbpath = 'https://'.$properties['server'].$properties['dir'].$filepath;
			break;
		}
		
	}
	
	
	//pa($thumbpath);
	//pa($properties['misc']['image'],1);
    $params['video_thumb'] = $thumbpath;
    $string  = urldecode($thumbpath);
	
	//$string = 'https://'.$properties['server'].$properties['dir'].'/TRIGGER VIDEO #1 KAWANA JASPER-15k bit-ORIG H264.gif';
	
    preg_match('@archive\.org/([0-9]+)/items/([a-zA-Z0-9_\-\.\/]+)/([a-zA-Z0-9_\-\s\#\.\/]+)\.(.*)$@i', $string, $matches);
    
	$params['video_dir'] = $matches[1];
    $params['video_videofirst'] = $matches[2];
    $params['video_videosecond'] = $matches[3];
    
    return $params;
  }

  /**
   * Returns a url in the format "http://archive.org/id".
   *
   * Overrides interpolateUrl() defined in MediaReadOnlyStreamWrapper.
   * This is an exact copy of the function in MediaReadOnlyStreamWrapper,
   * here in case that example is redefined or removed.
   */
  function interpolateUrl() {
    if ($parameters = $this->get_parameters()) {
      return $this->base_url . '?' . http_build_query($parameters);
    }
  }
  static function getMimeType($uri, $mapping = NULL) {
    return 'video/archive';
  }

  function getTarget($f) {
    return FALSE;
  }

  function getOriginalThumbnailPath() {
    $parts = $this->get_parameters();
	
	$thumb = check_plain($parts['video_thumb']);
	$thumb = str_replace('#','%23',$thumb);
    return $thumb;
  }

  function getLocalThumbnailPath() {
    $parts = $this->get_parameters();
    $local_path = 'public://media-archive/' . check_plain($parts['video_videofirst']) . '.gif';
    if (!file_exists($local_path)) {
      $dirname = drupal_dirname($local_path);
      file_prepare_directory($dirname, FILE_CREATE_DIRECTORY | FILE_MODIFY_PERMISSIONS);
	  $path = $this->getOriginalThumbnailPath();
	  if (!empty($path)) {
		$options = array('headers'=> array('Content-Type' => 'image/gif'));
	  	$response = drupal_http_request($path,$options);
	      if (!isset($response->error)) {
		  	$data = $response->data;
			if (empty($data)) {
				$data = file_get_contents('sites/default/files/default-image/default-image-archive-video.gif');
			}
	        file_save_data($data, $local_path, TRUE);
	      }
	      else {
	        @copy($path, $local_path);
	      }
	  }
      
    }
    return $local_path;
  }
}
