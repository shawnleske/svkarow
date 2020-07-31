$(() => {
    initMenu();
    initNews();
    initSlick();
    initBanner();
    initViewer();
});

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
        // TODO: BEWARE: Doesn't really work when children have different widths as it only checks the 1st elem
        if($carouselElems.outerWidth(true)*$carouselElems.length >= $(this).parent().width()) {
            createCarousel($(this));
        }
    });

    $(window).resize(function() {
        $carousel.each(function() {
            var $this = $(this);
            var $carouselElems = $this.hasClass('slick-initialized') ? $this.find('.slick-slide') : $this.children();

            // TODO: BEWARE: Doesn't really work when children have different widths as it only checks the 1st elem
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

function initNews() {
    if(!$('.news').length)
        return;

    $('.news').click(function() {
        $this = $(this);
        
        $this.toggleClass('open');

        if($this.hasClass('open')) 
            setTimeout(() => {$this.children('.news-content').slideDown(250)}, 250);
        else
            $this.children('.news-content').slideUp(250);

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