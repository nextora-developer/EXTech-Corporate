document.addEventListener("DOMContentLoaded", () => {
  const elements = document.querySelectorAll(".reveal-on-scroll");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
    }
  );

  elements.forEach((el) => observer.observe(el));
});

document.addEventListener("scroll", () => {
  const navbar = document.querySelector(".navbar");
  if (window.scrollY > 40) {
    navbar.classList.add("navbar-scrolled");
  } else {
    navbar.classList.remove("navbar-scrolled");
  }
});

// Auto change copyright year
// document.getElementById("year").textContent = new Date().getFullYear();

// Move to Top
const backToTop = document.getElementById("backToTop");

window.addEventListener("scroll", () => {
  if (window.scrollY > 200) {
    backToTop.classList.add("show");
  } else {
    backToTop.classList.remove("show");
  }
});

backToTop.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});

// services process timeline
const revealItems = document.querySelectorAll(".timeline-item");
const options = { threshold: 0.2 };

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("in-view");
    }
  });
}, options);

revealItems.forEach((i) => observer.observe(i));

// Navbar and Footer + Active Menu
document.addEventListener("DOMContentLoaded", async () => {
  const navbarEl = document.getElementById("navbar");
  const footerEl = document.getElementById("footer");

  if (!navbarEl || !footerEl) return;

  async function load(el, paths) {
    for (const p of paths) {
      try {
        const r = await fetch(p, { cache: "no-store" });
        if (r.ok) {
          el.innerHTML = await r.text();
          return true;
        }
      } catch (e) {}
    }
    return false;
  }

  // =========
  // Load Navbar
  // =========
  const navbarLoaded = await load(navbarEl, [
    "partials/navbar.html",
    "../partials/navbar.html",
  ]);

  // =========
  // Set Active Menu (after navbar injected)
  // =========
  if (navbarLoaded) {
    const path = window.location.pathname; // e.g. /services/web-design.html
    const file = path.split("/").pop() || "index.html";
    const isServicesSubpage = path.includes("/services/");

    // clear all active first (since your navbar had hardcoded active before)
    document.querySelectorAll(".navbar .nav-link").forEach((a) => {
      a.classList.remove("active");
      a.removeAttribute("aria-current");
    });

    // apply active based on your absolute href like /index.html
    document.querySelectorAll(".navbar .nav-link[href]").forEach((a) => {
      const href = a.getAttribute("href");
      if (!href) return;

      // exact page match
      if (href === "/" + file) {
        a.classList.add("active");
        a.setAttribute("aria-current", "page");
      }

      // any /services/*.html should highlight /services.html
      if (isServicesSubpage && href === "/services.html") {
        a.classList.add("active");
        a.setAttribute("aria-current", "page");
      }
    });
  }

  // =========
  // Load Footer
  // =========
  const footerLoaded = await load(footerEl, [
    "partials/footer.html",
    "../partials/footer.html",
  ]);

  // =========
  // Auto change copyright year (after footer injected)
  // =========
  if (footerLoaded) {
    const yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  }
});
