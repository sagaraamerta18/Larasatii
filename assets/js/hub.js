// ============================================
// LOAD DATA (foto & ucapan)
// ============================================
async function loadJSON(path) {
  try {
    const res = await fetch(path);
    if (!res.ok) throw new Error('fetch failed');
    return await res.json();
  } catch (e) {
    console.warn('Gagal load', path, e);
    return [];
  }
}

function photoSlideHTML(photo, index) {
  return `
    <div class="swiper-slide">
      <div class="photo-card">
        <img src="${photo.src}" alt="${photo.alt || ''}" loading="lazy" decoding="async"
             onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
        <div class="photo-card__fallback" style="display:none;">foto ${index + 1}</div>
      </div>
    </div>`;
}

function quoteSlideHTML(quote) {
  return `
    <div class="swiper-slide">
      <div class="quote-card"><p>${quote.text}</p></div>
    </div>`;
}

async function init() {
  const photos = await loadJSON('data/photos.json');
  const quotes = await loadJSON('data/quotes.json');

  const topWrapper = document.getElementById('topGalleryWrapper');
  const pictureWrapper = document.getElementById('pictureWrapper');
  const ucapanWrapper = document.getElementById('ucapanWrapper');

  if (photos.length === 0) {
    topWrapper.innerHTML = pictureWrapper.innerHTML = `
      <div class="swiper-slide"><div class="photo-card"><div class="photo-card__fallback">belum ada foto</div></div></div>`;
  } else {
    topWrapper.innerHTML = photos.map(photoSlideHTML).join('');
    pictureWrapper.innerHTML = photos.map(photoSlideHTML).join('');
  }

  ucapanWrapper.innerHTML = quotes.length
    ? quotes.map(quoteSlideHTML).join('')
    : `<div class="swiper-slide"><div class="quote-card"><p>belum ada ucapan</p></div></div>`;

  // ===== Top gallery: auto-slide + manual, coverflow style =====
  new Swiper('#topGallerySwiper', {
    effect: 'coverflow',
    grabCursor: true,
    centeredSlides: true,
    loop: photos.length > 2,
    slidesPerView: 'auto',
    coverflowEffect: {
      rotate: 15,
      stretch: 0,
      depth: 120,
      modifier: 1.5,
      slideShadows: false,
    },
    autoplay: {
      delay: 2600,
      disableOnInteraction: false,
      pauseOnMouseEnter: true,
    },
  });

  // ===== Picture: card stack, manual swipe =====
  new Swiper('#pictureSwiper', {
    effect: 'cards',
    grabCursor: true,
    loop: photos.length > 2,
  });

  // ===== Ucapan: card stack, manual swipe =====
  new Swiper('#ucapanSwiper', {
    effect: 'cards',
    grabCursor: true,
    loop: quotes.length > 2,
  });

  if (window.lucide) lucide.createIcons();
}

init();

// ============================================
// DROPDOWN ACCORDION
// ============================================
document.querySelectorAll('.menu__item').forEach((item) => {
  const trigger = item.querySelector('.menu__trigger');
  trigger.addEventListener('click', () => {
    if (window.SFX) SFX.click();
    const isOpen = item.classList.contains('is-open');

    // tutup semua item lain
    document.querySelectorAll('.menu__item').forEach((other) => {
      other.classList.remove('is-open');
    });

    if (!isOpen) {
      item.classList.add('is-open');
    }
  });
});
