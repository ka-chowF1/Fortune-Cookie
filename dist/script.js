(() => {
  const stage = document.getElementById('stage');
  const cookie = document.getElementById('cookie');
  const open = document.getElementById('open');
  const reset = document.getElementById('reset');
  const slip = document.getElementById('slip');
  const fortune = document.getElementById('fortune');
  const hint = document.getElementById('hint');
  const announcement = document.getElementById('announcement');
  let state = 'closed';
  let previous = -1;
  const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
  async function crack() {
    if (state !== 'closed') return;
    state = 'opening';
    cookie.disabled = open.disabled = true;
    hint.textContent = 'Consulting the cookie…';
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    stage.classList.add('opening');
    await wait(reduced ? 0 : 500);
    stage.classList.remove('opening');
    stage.classList.add('cracked');
    await wait(reduced ? 0 : 800);
    const selected = FortuneCookies.pickFortune(previous);
    previous = selected.index;
    fortune.textContent = selected.text;
    slip.setAttribute('aria-hidden', 'false');
    stage.classList.add('revealed');
    announcement.textContent = selected.text;
    open.hidden = true;
    reset.hidden = false;
    hint.textContent = 'Take it with a grain of salt. Or a whole cookie.';
    state = 'revealed';
    reset.focus({ preventScroll: true });
  }
  function startAgain() {
    if (state !== 'revealed') return;
    state = 'closed';
    stage.classList.remove('opening', 'cracked', 'revealed');
    slip.setAttribute('aria-hidden', 'true');
    fortune.textContent = announcement.textContent = '';
    cookie.disabled = open.disabled = false;
    open.hidden = false;
    reset.hidden = true;
    hint.textContent = "Go on. What's the worst it could say?";
    open.focus({ preventScroll: true });
  }
  cookie.addEventListener('click', crack);
  open.addEventListener('click', crack);
  reset.addEventListener('click', startAgain);
})();
