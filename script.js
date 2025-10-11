	(function () {
		const defaultOptions = {
			selector: "",
			type: "blur",
			duration: 1.2,
			delay: 1.1,
			stager: 0.1,
			easing: "cubic-bezier(0.5, 1, 0.89, 1)",
			trigger: 0.6,
		};

		const letterTypes = ["cubic", "elastic", "opacity"];

		const animateText = (el, config) => {
			const mode = letterTypes.includes(config.type) ? "letter" : "word";

			let units;

			if (mode !== "letter") {
				units = el.textContent.trim().split(/\s+/);
			} else {
				units = Array.from(el.textContent); // без .trim() — чтобы сохранить пробелы
			}

			el.textContent = "";
			el.style.visibility = "visible";

			units.forEach((char, i) => {
				const span = document.createElement("span");

				// если это пробел — обрабатываем отдельно
				if (mode === "letter" && char === " ") {
					span.className = "motion-space";
					span.textContent = "\u00A0"; // неразрывный пробел
					span.style.width = "0.4em"; // или auto
					el.appendChild(span);
					return;
				}

				span.textContent = char;
				span.className = `motion-head-${config.type}`;
				span.style.animationDelay = `${(config.delay + i * config.stager).toFixed(
					2
				)}s`;
				span.style.animationDuration = `${config.duration}s`;
				span.style.animationTimingFunction = config.easing;

				if (mode === "letter") {
					el.style.overflow = "hidden";
					span.setAttribute("data-text", char);
					span.style.setProperty(
						"--delay",
						`${(config.delay + i * config.stager).toFixed(2)}s`
					);
					span.style.setProperty("--duration", `${config.duration}s`);
					span.style.setProperty("--easing", config.easing);
				}

				el.appendChild(span);

				// только для разбивки по словам — добавляем пробел
				if (mode !== "letter") {
					el.appendChild(document.createTextNode(" "));
				}
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
