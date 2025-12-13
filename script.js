	(function () {
		const defaultOptions = {
			selector: "",
			type: "blur",
			duration: 1.2,
			delay: 0.1,
			stager: 0.05,
			easing: "cubic-bezier(0.5, 1, 0.89, 1)",
			trigger: 0.6,
		};

		const letterTypes = ["cubic", "elastic", "opacity"];

		// --- Функция для корректного разделения текста на юниты ---
		function splitUnits(el) {
			let html = el.innerHTML;

			// Заменяем &nbsp; на символ \u00A0
			html = html.replace(/&nbsp;/g, "\u00A0");
			// Убираем все теги кроме <br>
			html = html.replace(/<br\s*\/?>/gi, "\n").replace(/<[^>]+>/g, "");
			// Переводы строк → пробел, несколько пробелов → один
			html = html
				.replace(/\r\n|\r|\n+/g, " ")
				.replace(/[ \t\f\v]+/g, " ")
				.trim(); // Убираем пробелы в начале и конце

			const raw = html.split(/(\s+|\u00A0)/g).filter(Boolean);
			const units = [];

			for (let i = 0; i < raw.length; i++) {
				const token = raw[i];

				// обычный пробел (но не \u00A0)
				if (/^[ \t\f\v]+$/.test(token)) {
					// Не добавляем пробел в начале строки
					if (units.length === 0) continue;
					// Не добавляем повторяющиеся пробелы
					if (units[units.length - 1] === " ") continue;
					units.push(" ");
					continue;
				}

				// склейка по \u00A0 — ищем предыдущий и следующий токен, игнорируем обычные пробелы
				if (token === "\u00A0") {
					const prev = units.pop();
					let j = i + 1;
					// Пропускаем обычные пробелы после \u00A0
					while (j < raw.length && /^[ \t\f\v]+$/.test(raw[j])) j++;
					const next = raw[j];
					if (prev && next) {
						// Склеиваем предыдущее слово, \u00A0 и следующее слово
						units.push(prev + "\u00A0" + next);
						i = j; // Пропускаем обработанные токены
					} else if (prev) {
						// Если нет следующего слова, возвращаем предыдущее
						units.push(prev);
					}
					continue;
				}

				// обычное слово
				units.push(token);
			}

			// удаляем конечный пробел
			if (units.length && units[units.length - 1] === " ") units.pop();

			return units;
		}

		// --- Основная функция анимации ---
		const animateText = (el, config) => {
			const mode = letterTypes.includes(config.type) ? "letter" : "word";
			const units = splitUnits(el);
			el.textContent = "";

			// Делаем элемент видимым перед анимацией
			el.style.visibility = "visible";
			el.style.opacity = "100%";

			let globalIndex = 0;

			units.forEach((unit) => {
				if (unit === " ") {
					el.appendChild(document.createTextNode(" "));
					return;
				}

				if (mode === "letter") {
					const wordWrapper = document.createElement("span");
					wordWrapper.className = "motion-word";
					wordWrapper.style.whiteSpace = "nowrap";
					wordWrapper.style.display = "inline-block";

					Array.from(unit).forEach((char) => {
						if (char === " ") {
							wordWrapper.appendChild(document.createTextNode(" "));
							return;
						}

						const span = document.createElement("span");
						span.textContent = char;
						span.className = `motion-head-${config.type}`;
						span.style.display = "inline-block";
						span.style.animationDelay = `${(
							config.delay +
							globalIndex * config.stager
						).toFixed(2)}s`;
						span.style.animationDuration = `${config.duration}s`;
						span.style.animationTimingFunction = config.easing;
						span.setAttribute("data-text", char);
						wordWrapper.appendChild(span);
						globalIndex++;
					});

					el.appendChild(wordWrapper);
				} else {
					const span = document.createElement("span");
					span.textContent = unit;
					span.className = `motion-head-${config.type}`;
					span.style.display = "inline-block";
					span.style.animationDelay = `${(
						config.delay +
						globalIndex * config.stager
					).toFixed(2)}s`;
					span.style.animationDuration = `${config.duration}s`;
					span.style.animationTimingFunction = config.easing;

					el.appendChild(span);
					globalIndex++;
				}
			});

			// Запускаем анимацию через RAF
			requestAnimationFrame(() => {
				const spans = el.querySelectorAll(".motion-head-" + config.type);
				spans.forEach((span) => span.classList.add("motion-active"));
			});
		};

		// --- Инициализация ---
		const init = (options = {}) => {
			const config = { ...defaultOptions, ...options };
			const elements = Array.from(document.querySelectorAll(config.selector));

			elements.forEach((el) => {
				if (!el.__motionPrepared) {
					el.__motionPrepared = true;
					// Для cubic и opacity текст должен быть виден сразу
					// Для остальных типов делаем невидимым до анимации
					if (config.type === "cubic") {
						el.style.visibility = "visible";
						const color = getComputedStyle(el).color;
						el.style.setProperty("--letter-color", color);
					} else if (config.type === "opacity") {
						el.style.opacity = "10%";
						const color = getComputedStyle(el).color;
						el.style.setProperty("--letter-color", color);
					} else {
						el.style.visibility = "hidden";
					}
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
		window.MotionHead = { init };
	})();

