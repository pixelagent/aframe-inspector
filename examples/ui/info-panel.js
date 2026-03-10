/* global AFRAME */
AFRAME.registerComponent('info-panel', {
  init: function () {
    var buttonEls = document.querySelectorAll('.menu-button');
    var fadeBackgroundEl = this.fadeBackgroundEl = document.querySelector('#fadeBackground');

    this.movieTitleEl = document.querySelector('#movieTitle');
    this.movieDescriptionEl = document.querySelector('#movieDescription');

    // Video iframe container
    this.videoContainer = null;
    this.isVideoPlaying = false;

    // YouTube video IDs for each movie
    this.videoIds = {
      karigurashiButton: '9CtIXPhPo0g',  // Arrietty
      kazetachinuButton: 'TXuswYJFrDM',  // The Wind Rises
      ponyoButton: 'h6XP82TyFWw'         // Ponyo
    };

    this.movieInfo = {
      karigurashiButton: {
        title: 'The Secret World of Arrietty (2010)',
        imgEl: document.querySelector('#karigurashiMovieImage'),
        videoEl: document.querySelector('#karigurashiVideoEl'),
        description: 'Based on the 1952 novel The Borrowers by Mary Norton, an English author of children\'s books, about a family of tiny people who live secretly in the walls and floors of a typical household, borrowing items from humans to survive.'
      },
      kazetachinuButton: {
        title: 'The Wind Rises (2013)',
        imgEl: document.querySelector('#kazetachinuMovieImage'),
        videoEl: document.querySelector('#kazetachinuVideoEl'),
        description: 'The Wind Rises is a fictionalised biographical film of Jiro Horikoshi (1903, 1982), designer of the Mitsubishi A5M fighter aircraft and its successor, the Mitsubishi A6M Zero, used by the Empire of Japan during World War II. The film is adapted from Miyazaki\'s manga of the same name, which was in turn loosely based on both the 1937 novel The Wind Has Risen by Tatsuo Hori and the life of Jiro Horikoshi.'
      },
      ponyoButton: {
        title: 'Ponyo (2003)',
        imgEl: document.querySelector('#ponyoMovieImage'),
        videoEl: document.querySelector('#ponyoVideoEl'),
        description: 'It is the eighth film Miyazaki directed for Studio Ghibli, and his tenth overall. The film tells the story of Ponyo (Nara), a goldfish who escapes from the ocean and is rescued by a five-year-old human boy, Sōsuke (Doi) after she is washed ashore while trapped in a glass jar.'
      }
    };

    var self = this;

    this.onMenuButtonClick = this.onMenuButtonClick.bind(this);
    this.onBackgroundClick = this.onBackgroundClick.bind(this);
    this.onPlayButtonClick = this.onPlayButtonClick.bind(this);
    this.onCloseButtonClick = this.onCloseButtonClick.bind(this);
    this.backgroundEl = document.querySelector('#background');
    
    // Set up menu button click handlers with stopPropagation
    for (var i = 0; i < buttonEls.length; ++i) {
      buttonEls[i].addEventListener('click', function(evt) {
        evt.stopPropagation();
        self.onMenuButtonClick(evt);
      });
    }
    
    this.backgroundEl.addEventListener('click', this.onBackgroundClick);

    // Set up play button click handler (stop propagation to prevent closing)
    this.playButtonEl = document.querySelector('#playButton');
    if (this.playButtonEl) {
      this.playButtonEl.addEventListener('click', function(evt) {
        evt.stopPropagation();
        self.onPlayButtonClick();
      });
    }

    // Set up close button click handler
    this.closeButtonEl = document.querySelector('#closeButton');
    if (this.closeButtonEl) {
      this.closeButtonEl.addEventListener('click', function(evt) {
        evt.stopPropagation();
        self.onCloseButtonClick();
      });
    }

    this.el.object3D.renderOrder = 2;
    this.el.object3D.depthTest = false;
    fadeBackgroundEl.object3D.renderOrder = 1;
    fadeBackgroundEl.getObject3D('mesh').material.depthTest = false;

    // Current video ID
    this.currentVideoId = null;
    this.currentButtonId = null;
  },

  onMenuButtonClick: function (evt) {
    var movieInfo = this.movieInfo[evt.currentTarget.id];
    this.currentButtonId = evt.currentTarget.id;
    this.isVideoPlaying = false;

    this.backgroundEl.object3D.scale.set(1, 1, 1);

    this.el.object3D.scale.set(1, 1, 1);
    if (AFRAME.utils.device.isMobile()) { this.el.object3D.scale.set(1.4, 1.4, 1.4); }
    this.el.object3D.visible = true;
    this.fadeBackgroundEl.object3D.visible = true;

    // Hide any existing video
    this.hideVideo();

    if (this.movieImageEl) { this.movieImageEl.object3D.visible = false; }
    this.movieImageEl = movieInfo.imgEl;
    this.movieImageEl.object3D.visible = true;

    // Show play button
    if (this.playButtonEl) {
      this.playButtonEl.object3D.visible = true;
    }

    // Show close button
    if (this.closeButtonEl) {
      this.closeButtonEl.object3D.visible = true;
    }

    // Show title and description
    if (this.movieTitleEl) {
      this.movieTitleEl.object3D.visible = true;
    }
    if (this.movieDescriptionEl) {
      this.movieDescriptionEl.object3D.visible = true;
    }

    this.movieTitleEl.setAttribute('text', 'value', movieInfo.title);
    this.movieDescriptionEl.setAttribute('text', 'value', movieInfo.description);
  },

  onPlayButtonClick: function () {
    if (!this.currentButtonId) return;

    var videoId = this.videoIds[this.currentButtonId];
    if (!videoId) return;

    this.playVideo(videoId);
  },

  playVideo: function (videoId) {
    this.isVideoPlaying = true;

    // Hide the image
    if (this.movieImageEl) {
      this.movieImageEl.object3D.visible = false;
    }

    // Hide play button
    if (this.playButtonEl) {
      this.playButtonEl.object3D.visible = false;
    }

    // Hide title and description to make room for video
    if (this.movieTitleEl) {
      this.movieTitleEl.object3D.visible = false;
    }
    if (this.movieDescriptionEl) {
      this.movieDescriptionEl.object3D.visible = false;
    }

    // Create or update iframe
    this.showVideoIframe(videoId);
  },

  showVideoIframe: function (videoId) {
    // Remove existing iframe if any
    this.hideVideo();

    // Create iframe element
    var iframe = document.createElement('iframe');
    iframe.setAttribute('id', 'videoIframe');
    iframe.setAttribute('width', '100%');
    iframe.setAttribute('height', '100%');
    iframe.setAttribute('frameborder', '0');
    iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
    iframe.setAttribute('allowfullscreen', 'true');
    iframe.setAttribute('src', 'https://www.youtube.com/embed/' + videoId + '?autoplay=1');

    // Create container entity - larger to fit video better
    var container = document.createElement('a-entity');
    container.setAttribute('id', 'videoIframeContainer');
    container.setAttribute('geometry', 'primitive: plane; width: 1.5; height: 1.2');
    container.setAttribute('position', '0 0.2 0.002');

    container.appendChild(iframe);
    this.el.appendChild(container);

    this.videoContainer = container;
  },

  hideVideo: function () {
    // Remove iframe if exists
    var existingContainer = document.querySelector('#videoIframeContainer');
    if (existingContainer && existingContainer.parentNode) {
      existingContainer.parentNode.removeChild(existingContainer);
    }
    this.videoContainer = null;
  },

  onCloseButtonClick: function () {
    this.isVideoPlaying = false;
    this.hideVideo();
    this.backgroundEl.object3D.scale.set(0.001, 0.001, 0.001);
    this.el.object3D.scale.set(0.001, 0.001, 0.001);
    this.el.object3D.visible = false;
    this.fadeBackgroundEl.object3D.visible = false;
  },

  onBackgroundClick: function (evt) {
    // Only close if video is not playing
    if (!this.isVideoPlaying) {
      this.onCloseButtonClick();
    }
  }
});
