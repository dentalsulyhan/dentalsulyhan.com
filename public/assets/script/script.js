"use strict"

const team_slider = new Swiper('.team-slider', {
    // Optional parameters
    direction: 'horizontal',
    loop: true,
    speed: 600,
    slidesPerView: 1.5,
    centeredSlides: true,
    spaceBetween: 30,

    breakpoints: {
        991: {
            slidesPerView: 4,
            centeredSlides: false,

        },
        767: {
            slidesPerView: 3,
            centeredSlides: false,

        },
        767: {
            slidesPerView: 3,
            centeredSlides: false,

        },
        568: {
            slidesPerView: 2,
            centeredSlides: false,
        },
    },
    pagination: {
        el: '.team-pagination',
        clickable: true,
    },
    // Navigation arrows
    navigation: {
        nextEl: '.team-button-next',
        prevEl: '.team-button-prev',
    },


});

const gallery_slider = new Swiper('.gallery-slider', {
    // Optional parameters
    direction: 'horizontal',
    loop: true,
    speed: 600,


    // If we need pagination
    pagination: {
        el: '.gallery-pagination',
    },

    // Navigation arrows
    navigation: {
        nextEl: '.gallery-button-next',
        prevEl: '.gallery-button-prev',
    },


});

const reviews_slider = new Swiper('.reviews-slider', {
    // Optional parameters
    direction: 'horizontal',
    loop: true,
    speed: 600,


    // If we need pagination
    pagination: {
        el: '.reviews-pagination',
    },

    // Navigation arrows
    navigation: {
        nextEl: '.reviews-button-next',
        prevEl: '.reviews-button-prev',
    },


});



