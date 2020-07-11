$(() => {
    initBanner();
    initMenu();
    initNews();
    initSlick();
});

function initSlick() {
    var $carousel = $('.carousel');

    if(!$carousel.length)
        return;

    $carousel.each(function() {
        var $carouselElems = $(this).children();

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

    if(!$imageContainer.length)
        return console.log('image container nicht gefunden');

    $.ajax({
        url : "/api/bannerimages",
        success: images => {
            
            if(!images.length){
                console.warn('Es konnten keine Bannerbilder gefunden werden!');
                return;
            }

            images.forEach((imageName, i) => {
                if( imageName.match(/\.(jpe?g|png|gif)$/) ) { 
                    $imageContainer.append( "<img src='/img/banner/"+ imageName +"' style=left:" + i*100 + "%; >" );
                }
            });

            if(images.length > 1) {
                $('.banner > .banner-arrows').show();
                $('.banner').attr('data-active-banner', 0);

                let $bannerArrowLeft = $('.banner > .banner-arrows > #banner-arrow-left');
                let $bannerArrowRight = $('.banner > .banner-arrows > #banner-arrow-right');

                $('.banner > .banner-arrows > .banner-arrow').click(e => {
                    //TODO: do banner, try infinite scrolling to left and right, don't forget handy
                });
            }
        }
    });
}