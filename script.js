			(function () {
				const defaultOptions = {
					selector: "",
					type: "fade",
					duration: 1.2,
					delay: 1.1,
					stager: 0.1,
					easing: "cubic-bezier(0.5, 1, 0.89, 1)",
					trigger: 0.6,
				};

				const animateText = (el, config) => {
					const words = el.textContent.trim().split(/\s+/);
					el.textContent = "";
					el.style.visibility = "visible";

					words.forEach((word, i) => {
						const span = document.createElement("span");
						span.textContent = word;
						span.className = `motion-head-${config.type}`;
						span.style.animationDelay = `${(config.delay + i * config.stager).toFixed(
							2
						)}s`;
						span.style.animationDuration = `${config.duration}s`;
						span.style.animationTimingFunction = config.easing;
						el.appendChild(span);
						el.appendChild(document.createTextNode(" "));
					});
				};

				const init = (options = {}) => {
					const config = { ...defaultOptions, ...options };
					const elements = Array.from(document.querySelectorAll(config.selector));

					elements.forEach((el) => {
						if (!el.__motionPrepared) {
							el.style.visibility = "hidden";
							el.__motionPrepared = true;
						}
					});

					const checkVisibility = () => {
						const triggerY = window.innerHeight * config.trigger;

						elements.forEach((el) => {
							if (el.__motionTriggered) return;

							const rect = el.getBoundingClientRect();
							if (rect.top < triggerY) {
								el.__motionTriggered = true;
								animateText(el, config);
							}
						});
					};

					window.addEventListener("scroll", checkVisibility);
					window.addEventListener("resize", checkVisibility);
					checkVisibility(); // запуск при загрузке
				};

				window.MotionHead = { init };
			})();
