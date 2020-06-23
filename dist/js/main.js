$(() => {
    initBanner();
    initMenu();
    initNews();
});

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
        }
    });
}

function initBanner() {
    if(!$('.banner').length)
        return;

    var $imageContainer = $('.banner > .image-container');

    if(!$imageContainer.length)
        return console.log('image container nicht gefunden');;

    $.ajax({
        url : "/bannerimages",
        success: data => {
            let images = JSON.parse(data);

            images.forEach((imageName, i) => {
                if( imageName.match(/\.(jpe?g|png|gif)$/) ) { 
                    $imageContainer.append( "<img src='./img/banner/"+ imageName +"' style=left:" + i*100 + "%; >" );
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