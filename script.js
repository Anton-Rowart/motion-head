(function () {
  const defaultOptions = {
    selector: ".text-anim",
    duration: "0.9s",
    delayStart: 1.1, // начальная задержка
    stagger: 0.1, // шаг между словами
    easing: "cubic-bezier(0.5, 1, 0.89, 1)",
  };

  const animateText = (el, options = {}) => {
    const config = { ...defaultOptions, ...options };
    const words = el.textContent.trim().split(/\s+/);
    el.textContent = "";

    words.forEach((word, i) => {
      const span = document.createElement("span");
      span.textContent = word;
      span.className = "fade-in";
      span.style.animationDelay = `${(
        config.delayStart +
        i * config.stagger
      ).toFixed(2)}s`;
      span.style.animationDuration = config.duration;
      span.style.animationTimingFunction = config.easing;
      el.appendChild(span);
      el.appendChild(document.createTextNode(" ")); // пробел между словами
    });
  };

  const init = (options = {}) => {
    const config = { ...defaultOptions, ...options };
    document
      .querySelectorAll(config.selector)
      .forEach((el) => animateText(el, config));
  };

  window.TextAnim = { init, animate: animateText };
})();
