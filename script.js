// Basic modal + form behavior for demo purposes.
// NOTE: This is demo-only: in production you'll POST to your backend or 3rd-party booking API.

const openBtns = document.querySelectorAll('#open-book-btn, #open-booking, #open-book-footer, #hero-book, #quick-book');
const modal = document.getElementById('modal');
const backdrop = document.getElementById('modalBackdrop');
const closeBtn = document.getElementById('modal-close');
const navToggle = document.getElementById('navToggle');
const nav = document.querySelector('.nav');

function showModal() {
  modal.setAttribute('aria-hidden','false');
  modal.style.display = 'block';
  backdrop.hidden = false;
  backdrop.style.display = 'block';
}
function hideModal() {
  modal.setAttribute('aria-hidden','true');
  modal.style.display = 'none';
  backdrop.hidden = true;
  backdrop.style.display = 'none';
}
openBtns.forEach(b=>b.addEventListener('click', e=>{ e.preventDefault(); showModal(); }));
closeBtn.addEventListener('click', hideModal);
backdrop.addEventListener('click', hideModal);

// Mobile nav toggle
navToggle && navToggle.addEventListener('click', () => {
  if(nav.style.display === 'flex') nav.style.display = 'none';
  else nav.style.display = 'flex';
});

// Show child fields when "Booking for child" is selected
const radios = document.querySelectorAll('input[name="forWho"]');
const childFields = document.getElementById('childFields');
radios.forEach(r=>{
  r.addEventListener('change', ()=>{
    if(r.value === 'child' && r.checked) childFields.hidden = false;
    if(r.value === 'self' && r.checked) childFields.hidden = true;
  });
});

// Form handling demo: validate and "submit"
const form = document.getElementById('signupForm');
form.addEventListener('submit', (e)=>{
  e.preventDefault();
  // collect
  const data = {
    fullName: form.fullName.value.trim(),
    email: form.email.value.trim(),
    phone: form.phone.value.trim(),
    forWho: form.forWho.value,
    childName: form.childName.value.trim(),
    childAge: form.childAge.value,
    medical: form.medical.value.trim(),
    classChoice: form.classChoice.value.trim(),
    waiver: form.waiver.checked,
    timestamp: new Date().toISOString()
  };

  if(!data.waiver){
    alert('You must accept the waiver to continue.');
    return;
  }
  // In production, POST to your server or booking API here.
  // For demo we store in localStorage and show a confirmation.
  let bookings = JSON.parse(localStorage.getItem('kuriousBookings')||'[]');
  bookings.push(data);
  localStorage.setItem('kuriousBookings', JSON.stringify(bookings));
  alert('Thanks! Your booking request has been recorded. We will email you to confirm details.');
  form.reset();
  childFields.hidden = true;
  hideModal();
});

// Save draft locally
document.getElementById('saveDraft')?.addEventListener('click', ()=>{
  const draft = {
    fullName: form.fullName.value,
    email: form.email.value,
    phone: form.phone.value,
    forWho: form.forWho.value,
    childName: form.childName.value,
    childAge: form.childAge.value,
    medical: form.medical.value,
    classChoice: form.classChoice.value
  };
  localStorage.setItem('kuriousDraft', JSON.stringify(draft));
  alert('Draft saved locally in your browser.');
});

// Autofill draft on load
window.addEventListener('load', ()=>{
  const draft = JSON.parse(localStorage.getItem('kuriousDraft')||'null');
  if(draft){
    form.fullName.value = draft.fullName||'';
    form.email.value = draft.email||'';
    form.phone.value = draft.phone||'';
    if(draft.forWho === 'child'){
      document.querySelector('input[name="forWho"][value="child"]').checked = true;
      childFields.hidden = false;
    }
    form.childName.value = draft.childName||'';
    form.childAge.value = draft.childAge||'';
    form.medical.value = draft.medical||'';
    form.classChoice.value = draft.classChoice||'';
  }
});
