$(function() {


/*-------------------------------------------
Load Page
---------------------------------------------*/

	$('body').waitForImages({
		finished: function() {
				Website();
		},
		waitForAll: true
	});


/*-------------------------------------------
Ajax link page transitions
---------------------------------------------*/

	$(document).on("click", "a.ajax-link", function(){
		$this = $(this);
		var link = $this.attr('href');
		var current_url = $(location).attr('href');

		if( link != current_url && link != '#' ) {
		$.ajax({
			url:link,
			processData:true,
			dataType:'html',
			success:function(data){
				document.title = $(data).filter('title').text();
				current_url = link;
        if (typeof history.pushState != 'undefined') history.pushState(data, 'Page', link);

          setTimeout(function(){
          $('#preloader').delay(50).fadeIn(600);
          $('html, body').delay(1000).animate({ scrollTop:  0  },1000);

					setTimeout(function(){

            $('#ajax-content').html($(data).filter('#ajax-content').html());
            $('#ajax-sidebar').html($(data).filter('#ajax-sidebar').html());

						$('body').waitForImages({
							finished: function() {
								Website();
								backLoading();
								$('.opacity-nav').delay(50).fadeOut(600);
              },
              waitForAll: true
						});
					},1000);
					},0);
			}
		});
    }
    return false;
	});


/*-------------------------------------------
When you click back arrow
---------------------------------------------*/


function backLoading() {
    $(window).on("popstate", function () {
        $('body').fadeOut('slow',function(){
            location.reload();
        });
        $('body').fadeIn();
    });
}

/*-------------------------------------------
Load Page - next Open Site
---------------------------------------------*/

function Website() {
		CheckScripts();
		Masonry();
		backgroundmenu();
		setTimeout(function(){
			$(".preloader").fadeOut(500);
		},2000);
		setTimeout(function(){
			$('header').fadeIn();
		},500);
}


/*-------------------------------------------
Init and check list scripts
---------------------------------------------*/

function CheckScripts() {

  $(document).ready(function(){
    preloaderCheck();
    Typewriting();
    sidebarhero();
  });

}


/*-------------------------------------------
Masonry Check Script
---------------------------------------------*/

function Masonry() {
       var $container = $('.portfolio-grid');

       $container.imagesLoaded( function(){
         $container.masonry({
           itemSelector : 'li'
         });
       });
}


/*-------------------------------------------
Multi purpose init Background menu
---------------------------------------------*/

function backgroundmenu() {

  $(document).ready(function(){
     if($("#header-fade").length) {

         $(window).scroll(function(){
            if ($(this).scrollTop() > 10) {
                $('header').fadeOut();
            } else {
                $('header').fadeIn();
            }
        });
     }

     if($("#header-white").length) {

         $(window).scroll(function(){
            if ($(this).scrollTop() > 10) {
                $('header').css( "background", "white" );
                $('header .logo > a').css( "borderBottom", "0" );

            } else {
                $('header').css( "background", "none" );
            }
        });
     }


  });

}

/*-------------------------------------------
Typewriting init script
---------------------------------------------*/

function Typewriting() {


  $(document).ready(function(){
  	setTimeout( function(){
  		if($("#site-type").length) {
          $(".typewrite span").typed({
              strings: ["show case ", "projects "],
              typeSpeed: 100,
              backDelay: 500,
              loop: false,
              contentType: 'html', // or text
              // defaults to false for infinite loop
              loopCount: false,
          });
      }
  	}, 3000);
  });
}


/*-------------------------------------------
Amazing Fade with scroll Sidebar
---------------------------------------------*/

function sidebarhero() {

  if($("#hero").length) {
    var fadeStart=100,fadeUntil=800,fading = $('#hero');

    $(window).bind('scroll', function(){
        var offset = $(document).scrollTop()
            ,opacity=0
        ;
        if( offset<=fadeStart ){
            opacity=1;
        }else if( offset<=fadeUntil ){
            opacity=1-offset/fadeUntil;
        }
        fading.css('opacity',opacity);
    });
  }
}


/*-------------------------------------------
Open Check Scription
---------------------------------------------*/

function OpenCheck() {
    setTimeout(function() {
        hidePreloader();
    }, 1000);
}


/*-------------------------------------------
Check Preloader
---------------------------------------------*/

function preloaderCheck() {
    showPreloader();
    $(window).load(function() {
        hidePreloader();
    });
}

/*-------------------------------------------
Functions Show / Hide Preloader
---------------------------------------------*/

function showPreloader() {
  $(".preloader").fadeIn("slow");
}

function hidePreloader() {
  $(".preloader").delay(2000).fadeOut("slow");
}

})//End

var renderSite = function (config){

    if (config.hideScrollbar) {
      $("body").addClass("scrollbar-hidden");
    }
    else {
      $("body").removeClass("scrollbar-hidden");
    }

    $(".menu-index").removeClass().addClass("menu-index").addClass(config.navClass);
    $(".icon-logo").removeClass().addClass("icon-logo").addClass(config.iceClass);

};

var ga_track = function (category, action, label) {
    if (category !== '' && action !== '') {
        ga('send', 'event', category, action, label);
    }
};


var showSite = function (section) {
	section = section || "portfolio";
	$("section").addClass("hidden");
    $(".opacity-nav").hide();
    $(".preloader").fadeIn("slow");
    setTimeout(function () {
        $(".preloader").fadeOut("slow");
        $("." + section).removeClass('hidden')
    }, 500);
};


var getHash = function () {
	var hash;
	if (location.href.indexOf("#") > -1) {
  		hash = location.href.split("#").pop().split('?').slice(0,1);
  	}
  	return hash;
};

$(document).ready(function () {

  var hash = getHash();

  renderSite(Sites[hash || 'portfolio']);
  showSite(hash);

  $(".js-open-site").click(function (evt) {

    evt.preventDefault();

    var section = $(this).attr("href");
    location.href = "#" + section; // set hash
    ga_track($(this).data("gaCategory"), $(this).data("gaAction"), $(this).data("gaLabel"));

    renderSite(Sites[section]);
    showSite(section);

  });

  $(window).bind('hashchange', function(e) {
  	showSite(getHash());
  });

  $('#button, #buttons, .button').on('click', function(evt) {
      evt.preventDefault();
      $( ".opacity-nav" ).fadeToggle( "slow", "linear" );
    // Animation complete.
  });


  $('.carousel').carousel({
      interval: 5000, //changes the speed
      pause: false
  });

  $(".contact form").submit(function (evt) {
      var $form = $(this);
      evt.preventDefault();
      $.post("/formdata", $(this).serialize())
        .done(function () {
          console.log("email erfolgreich gesendet");
          $form.hide();
          $('.contact .success').removeClass('hidden');
        })
        .fail(function () {
          console.log("es ist ein fehler aufgetreten");
          $('.contact .fail').removeClass('hidden');
        });
  });

  var mqXS = window.matchMedia ? window.matchMedia("(min-width:740px)").matches : false;
  if (mqXS) {
    var $video = $('<video muted autoplay loop poster="/img/mobile.jpg" id="bgvid"><source src="img/intro.mp4" type="video/mp4"></video>');
    $('.start-video').html($video);
  }

    $("img.lazy").lazyload();

});



$(window).scroll(function(){
    $(".index-headline").css("opacity", 1 - $(window).scrollTop() / 1250);
});

$(document).ready(function(){
	$('a[href^="#"]').on('click',function (e) {
	    e.preventDefault();

	    var target = this.hash;
	    var $target = $(target);

	    $('html, body').stop().animate({
	        'scrollTop': $target.offset().top
	    }, 900, 'swing', function () {
	        window.location.hash = target;
	    });
	});
});

(function() {
  // This is the bare minimum JavaScript. You can opt to pass no arguments to setup.
  // e.g. just plyr.setup(); and leave it at that if you have no need for events
  var instances = plyr.setup({
    // Output to console
    debug: true
  });

  // Get an element
  function get(selector) {
    return document.querySelector(selector);
  }

  // Custom event handler (just for demo)
  function on(element, type, callback) {
    if (!(element instanceof HTMLElement)) {
      element = get(element);
    }
    element.addEventListener(type, callback, false);
  }

  // Loop through each instance
  instances.forEach(function(instance) {
    // Play
    on('.js-play', 'click', function() {
      instance.play();
    });

    // Pause
    on('.js-pause', 'click', function() {
      instance.pause();
    });

    // Stop
    on('.js-stop', 'click', function() {
      instance.stop();
    });

    // Rewind
    on('.js-rewind', 'click', function() {
      instance.rewind();
    });

    // Forward
    on('.js-forward', 'click', function() {
      instance.forward();
    });
  });
})();
