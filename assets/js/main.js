(function () {
	"use strict";

	const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
	const supportsHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
	const body = document.body;
	const revealItems = Array.from(document.querySelectorAll(".js-reveal"));

	if (!reduceMotion) {
		body.classList.add("motion-ready");
	}

	function initReveal() {
		if (reduceMotion || !("IntersectionObserver" in window)) {
			revealItems.forEach((item) => item.classList.add("is-visible"));
			return;
		}

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (!entry.isIntersecting) return;
					const idx = revealItems.indexOf(entry.target);
					window.setTimeout(() => {
						entry.target.classList.add("is-visible");
					}, Math.max(0, idx) * 70);
					observer.unobserve(entry.target);
				});
			},
			{ threshold: 0.16 }
		);

		revealItems.forEach((item) => observer.observe(item));
	}

	function initTyping() {
		const target = document.querySelector("[data-type-line]");
		if (!target) return;
		const text = target.getAttribute("data-type-line") || "";

		if (reduceMotion) {
			target.textContent = text;
			return;
		}

		target.textContent = "";
		for (let i = 0; i < text.length; i += 1) {
			window.setTimeout(() => {
				target.textContent += text[i];
			}, 100 + i * 13);
		}
	}

	function initParallaxPortrait() {
		if (reduceMotion || !supportsHover) return;
		const card = document.querySelector(".js-parallax");
		if (!card) return;

		card.addEventListener("pointermove", (event) => {
			const rect = card.getBoundingClientRect();
			const x = (event.clientX - rect.left) / rect.width;
			const y = (event.clientY - rect.top) / rect.height;
			const rotateY = (x - 0.5) * 8;
			const rotateX = (0.5 - y) * 7;
			card.style.transform = `perspective(900px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`;
		});

		card.addEventListener("pointerleave", () => {
			card.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg)";
		});
	}

	initTyping();
	initReveal();
	initParallaxPortrait();
})();
