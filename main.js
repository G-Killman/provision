const primaryColorInput = document.querySelector("#primary-color");
const secondaryColorInput = document.querySelector("#secondary-color");
const accentColorInput = document.querySelector("#accent-color");
const textColorInput = document.querySelector("#text-color");
const revealElements = document.querySelectorAll(".reveal");

const applyColors = () => {
  if (primaryColorInput) {
    document.body.style.setProperty("--primary", primaryColorInput.value);
    document.body.style.setProperty("--primary-border", `${primaryColorInput.value}29`);
  }

  if (secondaryColorInput) {
    document.body.style.setProperty("--secondary", secondaryColorInput.value);
  }

  if (accentColorInput) {
    document.body.style.setProperty("--accent", accentColorInput.value);
  }

  if (textColorInput) {
    document.body.style.setProperty("--text", textColorInput.value);
  }
};

applyColors();

[primaryColorInput, secondaryColorInput, accentColorInput, textColorInput].forEach((input) => {
  input?.addEventListener("input", applyColors);
  input?.addEventListener("change", applyColors);
});

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries, observerInstance) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.animationPlayState = "running";
          observerInstance.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealElements.forEach((element) => {
    element.style.animationPlayState = "paused";
    observer.observe(element);
  });
}
