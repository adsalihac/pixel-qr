export function scrollToSection(id: string) {
  if (typeof document === "undefined") {
    return;
  }

  const element = document.getElementById(id);
  if (!element) {
    return;
  }

  const scroll = () => {
    element.scrollIntoView({ behavior: "smooth", block: "start" });

    if (typeof window !== "undefined") {
      window.setTimeout(() => {
        const top = element.getBoundingClientRect().top + window.scrollY - 8;
        window.scrollTo({ top, behavior: "smooth" });
      }, 80);
    }
  };

  if (typeof requestAnimationFrame === "function") {
    requestAnimationFrame(scroll);
  } else {
    scroll();
  }
}
