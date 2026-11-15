/* Interactions locales : aucun stockage et aucune requête réseau de formulaire. */
'use strict';
const toggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
const mobile = window.matchMedia('(max-width: 599px)');
function setMenu(open) {
  navigation.hidden = !open;
  toggle.setAttribute('aria-expanded', String(open));
  toggle.querySelector('.fa').className = open ? 'fa fa-xmark' : 'fa fa-bars';
}
// La rangée de liens reste visible initialement, comme sur la maquette.
setMenu(true);
toggle.addEventListener('click', () => setMenu(navigation.hidden));
navigation.addEventListener('keydown', event => {
  if (event.key === 'Escape' && mobile.matches) {
    setMenu(false);
    toggle.focus();
  }
});
mobile.addEventListener('change', () => setMenu(true));

const form = document.querySelector('#registration-form');
if (form) {
  const fields = [...form.querySelectorAll('input')];
  const status = document.querySelector('#form-status');
  const submit = form.querySelector('button[type="submit"]');
  const messages = {
    nom: 'Veuillez renseigner votre nom.',
    prenom: 'Veuillez renseigner votre prénom.',
    email: 'Veuillez renseigner votre adresse e-mail.'
  };
  function validate(field) {
    let error = '';
    if (!field.value.trim()) error = messages[field.id];
    else if (field.id === 'email' && (!field.validity.valid || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value.trim()))) {
      error = 'Saisissez une adresse e-mail valide (exemple : nom@domaine.fr).';
    }
    field.setAttribute('aria-invalid', String(Boolean(error)));
    document.querySelector('#' + field.id + '-error').textContent = error;
    return !error;
  }
  fields.forEach(field => {
    field.addEventListener('input', () => {
      status.textContent = '';
      status.className = 'form-status';
      if (field.hasAttribute('aria-invalid')) validate(field);
    });
    field.addEventListener('blur', () => {
      if (field.value.length || field.hasAttribute('aria-invalid')) validate(field);
    });
  });
  form.addEventListener('submit', event => {
    event.preventDefault();
    fields.forEach(field => { field.value = field.value.trim(); });
    const results = fields.map(validate);
    if (results.includes(false)) {
      status.className = 'form-status error';
      status.textContent = 'Le formulaire contient des erreurs. Vérifiez les champs signalés.';
      fields[results.indexOf(false)].focus();
      return;
    }
    status.className = 'form-status success';
    status.textContent = 'Formulaire valide. Aucune donnée n’a été envoyée ou enregistrée ; aucune inscription n’a été effectuée.';
    form.reset();
    fields.forEach(field => field.removeAttribute('aria-invalid'));
  });
  form.noValidate = true;
  submit.disabled = false;
  const titles = {
    'visage-rouge': 'Visage rouge', 'collines-au-soleil': 'Collines au soleil',
    'bouquet-de-nuit': 'Bouquet de nuit', 'les-trois-danseurs': 'Les trois danseurs',
    'terre-et-feuillage': 'Terre et feuillage', 'ville-au-crepuscule': 'Ville au crépuscule'
  };
  const title = titles[new URLSearchParams(window.location.search).get('oeuvre')];
  if (title) {
    const inquiry = document.querySelector('#art-inquiry');
    inquiry.textContent = 'Votre demande concerne : « ' + title + ' ».';
    inquiry.hidden = false;
  }
}
