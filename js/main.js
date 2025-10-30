// Fetch and display file size
$(document).ready(function() {
    // Fetch whirlpool.min.js size and update all placeholders
    fetch('https://raw.githubusercontent.com/lulurun/whirlpool/refs/heads/main/dist/whirlpool.min.js')
        .then(response => response.blob())
        .then(blob => {
            const sizeInKB = (blob.size / 1024).toFixed(1);
            $('.file-size').text(sizeInKB + 'KB');
        })
        .catch(error => {
            console.error('Error fetching file size:', error);
            $('.file-size').text('<10KB');
        });
})

// Smooth scrolling for navigation links
$(document).ready(function() {
    // Smooth scroll for anchor links
    $('a[href^="#"]').on('click', function(event) {
        var target = $(this.getAttribute('href'));
        if(target.length) {
            event.preventDefault();
            $('html, body').stop().animate({
                scrollTop: target.offset().top - 70
            }, 800);
        }
    });

    // Navbar collapse on link click (mobile)
    $('.navbar-nav>li>a').on('click', function(){
        $('.navbar-collapse').collapse('hide');
    });

    // Add active class to nav items on scroll
    $(window).on('scroll', function() {
        var scrollPos = $(document).scrollTop() + 100;

        $('.navbar-nav a').each(function () {
            var currLink = $(this);
            var refElement = $(currLink.attr("href"));

            if (refElement.length && refElement.position().top <= scrollPos && refElement.position().top + refElement.height() > scrollPos) {
                $('.navbar-nav li').removeClass("active");
                currLink.parent().addClass("active");
            } else {
                currLink.parent().removeClass("active");
            }
        });
    });

    // Fade in animation for sections
    function checkScroll() {
        $('.feature-box, .example-card, .doc-item').each(function() {
            var elementTop = $(this).offset().top;
            var elementBottom = elementTop + $(this).outerHeight();
            var viewportTop = $(window).scrollTop();
            var viewportBottom = viewportTop + $(window).height();

            if (elementBottom > viewportTop && elementTop < viewportBottom) {
                $(this).addClass('fade-in');
            }
        });
    }

    $(window).on('scroll', checkScroll);
    checkScroll(); // Initial check on page load

    // Add fade-in animation class
    $('<style>')
        .text('.fade-in { animation: fadeIn 0.6s ease-in; } @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }')
        .appendTo('head');
});
