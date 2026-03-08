const burger = document.getElementById('burger');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');
const closeBtn = document.getElementById('sidebar-close');

function openSidebar() {
  sidebar.classList.add('open');
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeSidebar() {
  sidebar.classList.remove('open');
  overlay.classList.remove('open');
  document.body.style.overflow = '';
}

burger.addEventListener('click', openSidebar);
closeBtn.addEventListener('click', closeSidebar);
overlay.addEventListener('click', closeSidebar);

sidebar.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', closeSidebar);
});

const hero = document.getElementById('hero');

burger.classList.add('on-hero');

const heroObserver = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting) {
    burger.classList.add('on-hero');
  } else {
    burger.classList.remove('on-hero');
  }
}, { threshold: 0.1 });

heroObserver.observe(hero);

const fadeEls = document.querySelectorAll('.fade-in');

const fadeObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      fadeObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });

fadeEls.forEach(el => fadeObserver.observe(el));

const phoneInput = document.getElementById('field-phone');
IMask(phoneInput, { mask: '+{7} (000) 000-00-00' });

flatpickr('#field-dates', {
  locale: 'ru',
  mode: 'range',
  minDate: 'today',
  dateFormat: 'd.m.Y',
  disableMobile: false,
});

let guests = 2;
const guestVal = document.getElementById('guest-value');
const guestInput = document.getElementById('field-guests');

document.getElementById('guest-minus').addEventListener('click', () => {
  if (guests > 1) {
    guests--;
    guestVal.textContent = guests;
    guestInput.value = guests;
  }
});

document.getElementById('guest-plus').addEventListener('click', () => {
  if (guests < 10) {
    guests++;
    guestVal.textContent = guests;
    guestInput.value = guests;
  }
});

const form = document.getElementById('booking-form');
const successMsg = document.getElementById('form-success');

function showError(fieldId, errId) {
  document.getElementById(fieldId).classList.add('error');
  document.getElementById(errId).style.display = 'block';
}

function clearError(fieldId, errId) {
  document.getElementById(fieldId).classList.remove('error');
  document.getElementById(errId).style.display = 'none';
}

const errorMap = {
  'field-name': 'err-name',
  'field-phone': 'err-phone',
  'field-dates': 'err-dates',
};

Object.keys(errorMap).forEach(id => {
  document.getElementById(id).addEventListener('input', () => {
    clearError(id, errorMap[id]);
  });
});

form.addEventListener('submit', async e => {
  e.preventDefault();

  const name = document.getElementById('field-name').value.trim();
  const phone = document.getElementById('field-phone').value.trim();
  const dates = document.getElementById('field-dates').value.trim();

  Object.keys(errorMap).forEach(id => clearError(id, errorMap[id]));

  let valid = true;

  if (!name) { showError('field-name', 'err-name'); valid = false; }
  if (phone.length < 17) { showError('field-phone', 'err-phone'); valid = false; }
  if (!dates.includes('—')) { showError('field-dates', 'err-dates'); valid = false; }

  if (!valid) return;

  const submitBtn = form.querySelector('.btn-submit');
  submitBtn.disabled = true;
  submitBtn.textContent = 'ОТПРАВЛЯЕМ...';

  try {
    const res = await fetch('https://formspree.io/f/xyknzbjg', {
      method: 'POST',
      body: new FormData(form),
      headers: { 'Accept': 'application/json' },
    });

    if (res.ok) {
      form.style.display = 'none';
      successMsg.style.display = 'block';
    } else {
      submitBtn.disabled = false;
      submitBtn.textContent = 'ОТПРАВИТЬ ЗАЯВКУ';
      alert('Произошла ошибка. Попробуйте ещё раз.');
    }
  } catch {
    submitBtn.disabled = false;
    submitBtn.textContent = 'ОТПРАВИТЬ ЗАЯВКУ';
    alert('Произошла ошибка. Проверьте подключение к интернету.');
  }
});

const stickyCta = document.getElementById('sticky-cta');
const contactsSection = document.getElementById('contacts');

stickyCta.addEventListener('click', () => {
  contactsSection.scrollIntoView({ behavior: 'smooth' });
});

const stickyObserver = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting) {
    stickyCta.style.display = 'none';
  } else {
    if (window.innerWidth < 768) stickyCta.style.display = 'block';
  }
}, { threshold: 0.1 });

stickyObserver.observe(contactsSection);