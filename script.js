(function () {
  const defaultOptions = {
    selector: ".text-anim",
    type: "scale",           // тип анимации
    duration: "0.9s",
    delayStart: 1.1,
    stagger: 0.1,
    easing: "cubic-bezier(0.5, 1, 0.89, 1)"
  };

  const animationPresets = {
    fade: {
      from: { opacity: "0", filter: "blur(10px)" },
      to:   { opacity: "1", filter: "blur(0)" }
    },
    slide: {
      from: { opacity: "0", transform: "translateY(30px)" },
      to:   { opacity: "1", transform: "translateY(0)" }
    },
    scale: {
      from: { opacity: "0", transform: "scale(0.8)" },
      to:   { opacity: "1", transform: "scale(1)" }
    },
    rotate: {
      from: { opacity: "0", transform: "rotate(-90deg)" },
      to:   { opacity: "1", transform: "rotate(0deg)" }
    }
    // можно добавить свои
  };

  const animateText = (el, options = {}) => {
    const config = { ...defaultOptions, ...options };
    const preset = animationPresets[config.type] || animationPresets.fade;
    const words = el.textContent.trim().split(/\s+/);
    el.textContent = "";

    words.forEach((word, i) => {
      const span = document.createElement("span");
      span.textContent = word;
      span.style.display = "inline-block";
      Object.assign(span.style, preset.from);
      span.style.animation = `textanim-${config.type} ${config.duration} ${config.easing} ${(
        config.delayStart + i * config.stagger
      ).toFixed(2)}s forwards`;
      el.appendChild(span);
      el.appendChild(document.createTextNode(" "));
    });
  };

  const init = (options = {}) => {
    const config = { ...defaultOptions, ...options };
    document.querySelectorAll(config.selector).forEach(el => animateText(el, config));
  };

  window.TextAnim = { init, animate: animateText };
})();


