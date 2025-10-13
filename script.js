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
			const html = el.innerHTML
				.replace(/&nbsp;/g, "\u00A0")
				.replace(/<[^>]*>/g, "")
				.trim();
			el.textContent = "";
			el.style.visibility = "visible";

			const rawUnits = html.split(/(\u00A0|\s+)/g).filter(Boolean);
			const units = [];

			for (let i = 0; i < rawUnits.length; i++) {
				const current = rawUnits[i];
				const next = rawUnits[i + 1];

				if (next === "\u00A0" && rawUnits[i + 2]) {
					units.push(current + "\u00A0" + rawUnits[i + 2]);
					i += 2;
					continue;
				}

				if (/^\s+$/.test(current)) {
					units.push("\u00A0");
					continue;
				}

				units.push(current);
			}

			let globalIndex = 0;

			for (let i = 0; i < units.length; i++) {
				const unit = units[i];

				if (unit === "\u00A0") {
					el.appendChild(document.createTextNode("\u00A0"));
					continue;
				}

				if (mode === "letter") {
					const wordWrapper = document.createElement("span");
					wordWrapper.className = "motion-word";
					wordWrapper.style.whiteSpace = "nowrap";
					wordWrapper.style.display = "inline-block";

					Array.from(unit).forEach((char) => {
						const span = document.createElement("span");
						span.textContent = char;
						span.className = `motion-head-${config.type}`;
						span.style.animationDelay = `${(
							config.delay +
							globalIndex * config.stager
						).toFixed(2)}s`;
						span.style.animationDuration = `${config.duration}s`;
						span.style.animationTimingFunction = config.easing;
						span.setAttribute("data-text", char);
						span.style.setProperty(
							"--delay",
							`${(config.delay + globalIndex * config.stager).toFixed(2)}s`
						);
						span.style.setProperty("--duration", `${config.duration}s`);
						span.style.setProperty("--easing", config.easing);
						span.style.display = "inline-block";
						wordWrapper.appendChild(span);
						globalIndex++;
					});

					el.appendChild(wordWrapper);
				} else {
					const span = document.createElement("span");
					span.textContent = unit;
					span.className = `motion-head-${config.type}`;
					span.style.animationDelay = `${(
						config.delay +
						globalIndex * config.stager
					).toFixed(2)}s`;
					span.style.animationDuration = `${config.duration}s`;
					span.style.animationTimingFunction = config.easing;
					span.style.display = "inline-block";
					el.appendChild(span);
					globalIndex++;
				}
			}
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
			checkVisibility();
		};

		window.MotionHead = { init };
	})();
