"use strict"

// Меню бургер
const iconMenu = document.querySelector(".menu__icon");
const menuBody = document.querySelector(".menu__body");
const closeButton = document.querySelector(".menu__close-button");
const header = document.querySelector(".header");

if (iconMenu) {
	iconMenu.addEventListener("click", function () {
		document.body.classList.toggle("_lock");
		iconMenu.classList.toggle("_active");
		menuBody.classList.toggle("_active");
	});
}

if (closeButton) {
	closeButton.addEventListener("click", function () {
		document.body.classList.remove("_lock");
		iconMenu.classList.remove("_active");
		menuBody.classList.remove("_active");
	});
}

//Прокрутка при кліці
const menuLinks = document.querySelectorAll('.menu__link[data-goto]');
if (menuLinks.length > 0) {
	menuLinks.forEach(menuLink => {
		menuLink.addEventListener("click", onMenuLinkClick)
	});
	function onMenuLinkClick(e) {
		const menuLink = e.target;
		if (menuLink.dataset.goto && document.querySelector(menuLink.dataset.goto)) {
			const gotoBlock = document.querySelector(menuLink.dataset.goto);
			const gotoBlockValue = gotoBlock.getBoundingClientRect().top + pageYOffset - document.querySelector('header').offsetHeight;

			if (iconMenu.classList.contains('_active')) {
				document.body.classList.remove('_lock');
				iconMenu.classList.remove('_active');
				menuBody.classList.remove('_active');
			};


			window.scrollTo({
				top: gotoBlockValue,
				behavior: "smooth",
			});
			e.preventDefault()
		}
	}
}


// Змінюємо стиль хедера при прокрутці
window.addEventListener('scroll', () => {
	if (window.scrollY > 100) {
		header.classList.add('header--fixed');
	} else {
		header.classList.remove('header--fixed');
	}
});

document.addEventListener("DOMContentLoaded", function () {
	const lang = document.documentElement.lang; // Отримуємо поточну мову
	const links = document.querySelectorAll(".drop-block__link");

	// Створюємо відповідність між lang і href
	const langMap = {
		"en-GB": "https://dentalsulyhan.com/",
		"es-ES": "https://dentalsulyhan.com/es/",
		"uk": "https://dentalsulyhan.com/uk/"
	};

	// Додаємо клас active відповідному <a>
	links.forEach(link => {
		if (link.href === langMap[lang]) {
			link.classList.add("active");
		}
	});

	// Обробка кліку на ::before
	const switcher = document.querySelector(".drop-block.lang.switcher.header-language");

	if (switcher) {
		switcher.addEventListener("click", function (event) {
			if (event.target === switcher) {
				switcher.classList.toggle("open"); // Додаємо/видаляємо клас, що відкриває список мов
			}
		});
	}
});

