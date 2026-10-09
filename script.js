const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

menuToggle?.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuToggle?.setAttribute("aria-expanded", "false");
  });
});

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

const rotatingNotes = {
  top: [
    ["24/7", "Siap membantu<br />kapan saja"],
    ["20+", "Tahun pengalaman<br />di bidang listrik"],
    ["Jabodetabek", "Siap datang<br />ke lokasi Anda"],
  ],
  bottom: [
    ["Garansi pekerjaan", "Beres dengan tenang"],
    ["Harga bersahabat", "Konsultasi dulu<br />via WhatsApp"],
    ["Pengerjaan rapi", "Aman untuk<br />jangka panjang"],
    ["Teknisi tepercaya", "Solusi listrik<br />untuk rumah & usaha"],
  ],
};

Object.entries(rotatingNotes).forEach(([position, messages]) => {
  const note = document.querySelector(`[data-rotating-note="${position}"]`);
  if (!note || messages.length < 2) return;

  let index = 0;
  const changeMessage = () => {
    index = (index + 1) % messages.length;
    note.classList.add("is-changing");
    window.setTimeout(() => {
      const [heading, detail] = messages[index];
      const headingElement = note.querySelector("strong");
      const detailElement = note.querySelector("span:not(.check-icon)");
      headingElement.innerHTML = heading;
      detailElement.innerHTML = detail;
      note.classList.remove("is-changing");
    }, 220);
  };

  window.setInterval(changeMessage, position === "top" ? 4200 : 5000);
});

const galleryTrack = document.querySelector(".gallery-track");
const gallerySlides = [...document.querySelectorAll(".gallery-track figure")];
const galleryDots = document.querySelector(".gallery-dots");
const previousButton = document.querySelector(".gallery-prev");
const nextButton = document.querySelector(".gallery-next");
let galleryIndex = 0;

if (galleryTrack && gallerySlides.length && galleryDots) {
  const getVisibleSlides = () => (window.innerWidth <= 640 ? 1 : window.innerWidth <= 900 ? 2 : 3);
  const getSlideStep = () => gallerySlides[0].getBoundingClientRect().width + parseFloat(getComputedStyle(galleryTrack).gap);
  const getMaxIndex = () => Math.max(0, gallerySlides.length - getVisibleSlides());
  const getPageCount = () => Math.ceil(gallerySlides.length / getVisibleSlides());
  let dots = [];

  const updateGallery = () => {
    galleryIndex = Math.min(galleryIndex, getMaxIndex());
    galleryTrack.style.transform = `translateX(-${galleryIndex * getSlideStep()}px)`;
    const activePage = Math.floor(galleryIndex / getVisibleSlides());
    dots.forEach((dot, index) => dot.classList.toggle("active", index === activePage));
  };

  const rebuildDots = () => {
    galleryDots.replaceChildren();
    dots = Array.from({ length: getPageCount() }, (_, index) => {
      const dot = document.createElement("button");
      dot.className = "gallery-dot";
      dot.type = "button";
      dot.setAttribute("aria-label", `Lihat halaman galeri ${index + 1}`);
      dot.addEventListener("click", () => {
        galleryIndex = Math.min(index * getVisibleSlides(), getMaxIndex());
        updateGallery();
      });
      galleryDots.append(dot);
      return dot;
    });
  };

  previousButton?.addEventListener("click", () => {
    galleryIndex = galleryIndex <= 0 ? getMaxIndex() : galleryIndex - 1;
    updateGallery();
  });
  nextButton?.addEventListener("click", () => {
    galleryIndex = galleryIndex >= getMaxIndex() ? 0 : galleryIndex + 1;
    updateGallery();
  });
  let touchStartX = 0;
  galleryTrack.parentElement.addEventListener("touchstart", (event) => {
    touchStartX = event.touches[0].clientX;
  }, { passive: true });
  galleryTrack.parentElement.addEventListener("touchend", (event) => {
    const distance = event.changedTouches[0].clientX - touchStartX;
    if (Math.abs(distance) > 45) {
      galleryIndex = distance < 0
        ? (galleryIndex >= getMaxIndex() ? 0 : galleryIndex + 1)
        : (galleryIndex <= 0 ? getMaxIndex() : galleryIndex - 1);
      updateGallery();
    }
  }, { passive: true });
  window.addEventListener("resize", () => {
    rebuildDots();
    updateGallery();
  });
  rebuildDots();
  updateGallery();

  let autoPlay = setInterval(() => {
    galleryIndex = galleryIndex >= getMaxIndex() ? 0 : galleryIndex + 1;
    updateGallery();
  }, 4500);
  galleryTrack.parentElement.addEventListener("mouseenter", () => clearInterval(autoPlay));
  galleryTrack.parentElement.addEventListener("mouseleave", () => {
    autoPlay = setInterval(() => {
      galleryIndex = galleryIndex >= getMaxIndex() ? 0 : galleryIndex + 1;
      updateGallery();
    }, 4500);
  });
}
