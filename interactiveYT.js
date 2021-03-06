    // 1. Load the IFrame Player API code asynchronously
    var tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    // tag.src = "http://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    // 2. Creates an <iframe> and YouTube player after the API code downloads.
    var ytplayer;
    var videotime;

    function onYouTubeIframeAPIReady() {
      ytplayer = new YT.Player('ytplayer', {
        height: '360',
        width: '640',
        videoId: 'f0-fPwuPpAk',
        events: {
          // Event handlers
          'onReady': onPlayerReady,
          'onStateChange': onPlayerStateChange
        }
      });
    }

    // 3. The API will call this function when the video player is ready.

    // Initialize variables
    var rounded_time;
    var timestamp_array = ['0', '1', '23', '48', '71', '96', '119', '142', '165', '190', '213', '236', '262'];
    var prev_timestamp = timestamp_array[0];
    var next_timestamp;
    var iframe_url;

    // Get last timestamp
    /*
    function getLastTimestamp() {
    	var timestamp_array_length = timestamp_array.length;
    	var ante_last_index = timestamp_array_length - 1;
    	var last_stamp = timestamp_array[ante_last_index];
    	return last_stamp;
    }
    var last_timestamp = getLastTimestamp();
    */

    // Execute when timestamp reached
    var timestamp_index; // = 0;
    var file_type = "png";

    function timestampReached(timestamp) {
      iframe_url = "./html/template.html?m=" + timestamp + "&n=" + file_type;
      top.text_iframe.location.href = iframe_url; // TRIGGER CHANGE OF PAGE IN IFRAME
      timestamp_index = timestamp_index + 1;
    }

    function onPlayerReady(event) {
      event.target.playVideo();

      function updateTime() {
        var oldTime = videotime;
        if (ytplayer && ytplayer.getCurrentTime) {
          videotime = ytplayer.getCurrentTime();
          document.getElementById("cur_time").innerHTML = videotime;
        }

        if (videotime !== oldTime) {
          onProgress(videotime); // INITIATE TRAVERSAL
        }
      }
      timeupdater = setInterval(updateTime, 100);
    }

    // Get page before timestamp
    var array_length = timestamp_array.length;

    function getPrevTimestamp(rounded_time) {
      // Loops through timestamp array
      for (var i = 0; i < array_length; i++) {
        // Finds timestamp before rounded_time
        if (timestamp_array[i] > rounded_time) {
          return timestamp_array[i - 1];
          break;
        }
      }
    }

    // Get page after timestamp
    function getNextTimestamp(rounded_time) {
      // Loops through timestamp array
      for (var i = 0; i < array_length; i++) {
        // Finds previous timestamp before rounded_time
        if (timestamp_array[i] > rounded_time) {
          return timestamp_array[i];
          break;
        }
      }
    }

    // When the time changes, this will be called.
    function onProgress(current_time) {

      // Register time
      rounded_time = Math.round(current_time);
      document.getElementById("round_time").innerHTML = rounded_time;

      // Trigger text page change
      var i;
      for (i = 0; i < timestamp_array.length; i++) {

        // 1. On progressing forward
        if (rounded_time > prev_timestamp) { // ***

          // On reaching Timestamp
          if (rounded_time == timestamp_array[i]) {
            prev_timestamp = rounded_time; // required by if at ***
            document.getElementById("prev_timestamp").innerHTML = prev_timestamp;
            next_timestamp = getNextTimestamp(rounded_time);
            if (next_timestamp !== undefined) {
              document.getElementById("next_timestamp").innerHTML = next_timestamp;
            } else {
              document.getElementById("next_timestamp").innerHTML = "N/A";
            }
            timestampReached(rounded_time); // TRIGGER
          }
        }
      } // for loop ending

      // 2. On jumping backward
      var cur_page;
      if (rounded_time < prev_timestamp) {
        cur_page = getPrevTimestamp(rounded_time); // gets page before videotime
        document.getElementById("prev_timestamp").innerHTML = cur_page;
        next_timestamp = getNextTimestamp(rounded_time);
        document.getElementById("next_timestamp").innerHTML = next_timestamp;
        timestampReached(current_time); // TRIGGER; rounded
        prev_timestamp = current_time; // rounded; required by if at ***
        onProgress(cur_page);
      }

      // 3. On jumping forward
      if (rounded_time > next_timestamp) {
        cur_page = getPrevTimestamp(rounded_time); // gets page before videotime
        document.getElementById("prev_timestamp").innerHTML = cur_page;
        next_timestamp = getNextTimestamp(rounded_time);
        document.getElementById("next_timestamp").innerHTML = next_timestamp;
        timestampReached(current_time); // TRIGGER; rounded
        prev_timestamp = current_time; // rounded; required by if at ***
        onProgress(cur_page);
      }
    }

    // 4. The API calls this function when the player's state changes.

    function onPlayerStateChange(event) {
      if (event.data == -1) { // event.data -1
        document.getElementById("state").innerHTML = 'Waiting';
      }
      if (event.data == YT.PlayerState.PLAYING) { // event.data 1
        document.getElementById("state").innerHTML = 'Playing';
      }
      if (event.data == YT.PlayerState.PAUSED) { // event.data 2
        document.getElementById("state").innerHTML = 'Paused';
      }
      if (event.data == YT.PlayerState.BUFFERING) { // event.data 3
        document.getElementById("state").innerHTML = 'Buffering';
      }
      if (event.data == YT.PlayerState.ENDED) { // event.data 0
        document.getElementById("state").innerHTML = 'Ended';
      }
      if (event.data == YT.PlayerState.CUED) { // event.data 5
        document.getElementById("state").innerHTML = 'Cued';
      }
    }
