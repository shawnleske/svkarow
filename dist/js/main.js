$(() => {
    initMenu();
    initSlick();
    initBanner();
    initViewer();
    initNews();

    let $buttonArrows = $('a.button .button-arrow');
    
    if($buttonArrows.length) {
        $buttonArrows.each(function (){
            $(this).css('top', $(this).css('top'));
        });
        
        $(window).resize(function() {
            $buttonArrows.each(function (){
                $(this).css('top', $(this).parent().height() / 2);
            });
        });
    }

    
});

(($) => {
    $.fn.pagination = function(options) {
        console.log('function called');
        
        return this;
    }; 
})( jQuery );

function initNews() {
    $news = $('.container[data-news-per-page] .news');
    
    if(!$news.length)
        return;

        console.log($news);

    $('.pagination').pagination({})
}

function initViewer() {
    $elems = $('.image-viewer');

    if(!$elems.length)
        return;

    $elems.each(function() {
        $(this).viewer();
    });
}

function initSlick() {
    var $carousel = $('.carousel');

    if(!$carousel.length)
        return;

    $carousel.each(function() {
        var $carouselElems = $(this).children();

        // ONLY CREATE CAROUSEL WHEN MORE WIDTH THEN SCREEN
        //BEWARE: Doesn't really work when children have different widths as it only checks the 1st elem
        if($carouselElems.outerWidth(true)*$carouselElems.length >= $(this).parent().width()) {
            createCarousel($(this));
        }
    });

    $(window).resize(function() {
        $carousel.each(function() {
            var $this = $(this);
            var $carouselElems = $this.hasClass('slick-initialized') ? $this.find('.slick-slide') : $this.children();

            //BEWARE: Doesn't really work when children have different widths as it only checks the 1st elem
            if($carouselElems.outerWidth(true)*$carouselElems.length >= $this.parent().width() && !$this.hasClass('slick-initialized')) {
                createCarousel($this);
            }
            else if($carouselElems.outerWidth(true)*$carouselElems.length < $this.parent().width() && $this.hasClass('slick-initialized')) {
                $this.slick('unslick');
                $this.siblings('.carousel-movement').remove();
            }
        });
    });
}

function createCarousel($this) {
    var $carouselDots = $(document.createElement('div')).addClass('carousel-dots');
    
        var $carouselMovement = $(document.createElement('div'))
            .addClass('carousel-movement')
            .insertAfter($this)
            .append($carouselDots);

        $(document.createElement('div'))
            .addClass('carousel-prev-arrow')
            .insertBefore($carouselDots)

        $(document.createElement('div'))
                .addClass('carousel-next-arrow')
                .insertAfter($carouselDots)

        $this.slick({
            infinite: false,
            variableWidth: true,
            centerMode: true,
            dots: true,
            prevArrow: $carouselMovement.find($('.carousel-prev-arrow')),
            nextArrow: $carouselMovement.find($('.carousel-next-arrow')),
            appendDots: $carouselMovement.find($('.carousel-dots'))
        });
}

function initMenu() {
    var $navButton = $('.nav-button');
    var $nav = $('nav');

    $navButton.click(e => {
        $navButton.toggleClass('open');
        $nav.toggleClass('active');

        if($nav.hasClass('active')) 
            $nav.slideDown(250);
        else
            $nav.slideUp(250);
    });

    $('body').click(e => {
        if(!$(e.target).is($navButton) && !$(e.target).closest($navButton).length && $nav.hasClass('active')) {
            $navButton.removeClass('open');
            $nav.removeClass('active');
            $nav.slideUp(250);
        }
    });
    
    $(window).resize(function() {
        if(!$navButton.is(':visible') && !$nav.hasClass('active')) {
            $navButton.addClass('open');
            $nav.addClass('active')
            $nav.slideDown(0);
        } else if ($navButton.is(':visible') && $nav.hasClass('active')) {
            $navButton.removeClass('open');
            $nav.removeClass('active')
            $nav.slideUp(0);
        }
    });
}

function initBanner() {
    if(!$('.banner').length)
        return;

    var $imageContainer = $('.banner > .image-container');
    var hasAutoplay = $imageContainer.attr('data-banner-autoplay') !== undefined && $imageContainer.attr('data-banner-autoplay') !== false;
    var autoplaySpeed = hasAutoplay ? $imageContainer.attr('data-banner-autoplay') * 1000 : 5000;

    if(!$imageContainer.length)
        return console.log('image container nicht gefunden');

    $imageContainer.slick({
        autoplay: hasAutoplay,
        autoplaySpeed: autoplaySpeed,
        slidesToShow: 1,
        slidesToScroll: 1,
        infinite: true,
        variableWidth: false,
        centerMode: false,
        dots: true,
        prevArrow: $('.banner > .banner-arrows > #banner-arrow-left'),
        nextArrow: $('.banner > .banner-arrows > #banner-arrow-right'),
        appendDots: $imageContainer.siblings('.banner-dots')
    });
}