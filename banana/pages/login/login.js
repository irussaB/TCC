function toggleSenha() {
  const campo = document.getElementById('senha');
  const icone = document.getElementById('icone-olho');
  const visivel = campo.type === 'text';
  campo.type = visivel ? 'password' : 'text';
  icone.className = visivel ? 'ti ti-eye' : 'ti ti-eye-off';
}

const apiUrlProfessores = 'http://localhost/banana/api/PROFESSORES/';

function fazerLogin(e) {
  e.preventDefault();
  const email = document.getElementById('email').value.trim().toLowerCase();
  const senha = document.getElementById('senha').value;
  const alerta = document.getElementById('alerta-erro');
  const textoErro = document.getElementById('texto-erro');
  const botao = document.querySelector('.btn-entrar');
  botao.disabled = true;

  fetch(`${apiUrlProfessores}LPROFESSORES.php?jsn=${encodeURIComponent(JSON.stringify({ email, senha }))}`)
    .then(r => r.json())
    .then(professor => {
      botao.disabled = false;
      if (professor) {
        localStorage.setItem('professor-logado', JSON.stringify(professor));
        alerta.style.display = 'none';
        window.location.href = '../menu/index.html';
      } else {
        textoErro.textContent = 'E-mail ou senha incorretos.';
        alerta.style.display = 'flex';
        document.getElementById('senha').focus();
      }
    })
    .catch(() => {
      botao.disabled = false;
      textoErro.textContent = 'Não foi possível fazer login agora.';
      alerta.style.display = 'flex';
    });
}

// ── TEMA ──
let cliquesTema = 0, temporizadorTema = null;

function alternarTema() {
  cliquesTema++;
  clearTimeout(temporizadorTema);
  temporizadorTema = setTimeout(() => cliquesTema = 0, 1500);

  if (cliquesTema >= 5) {
    cliquesTema = 0;
    document.body.classList.add('tema-escuro');
    const ativo = document.body.classList.toggle('tema-time');
    document.getElementById('icone-tema').className = ativo ? 'ti ti-flame' : 'ti ti-moon';
    localStorage.setItem('tema', ativo ? 'time' : 'escuro');
    return;
  }

  if (document.body.classList.contains('tema-time')) return;

  const escuro = document.body.classList.toggle('tema-escuro');
  document.getElementById('icone-tema').className = escuro ? 'ti ti-moon' : 'ti ti-sun';
  localStorage.setItem('tema', escuro ? 'escuro' : 'claro');
}

(function () {
  const salvo = localStorage.getItem('tema');
  if (salvo === 'time') {
    document.body.classList.add('tema-escuro', 'tema-time');
  } else if (salvo === 'claro') {
    // nada
  } else {
    document.body.classList.add('tema-escuro');
  }
  document.addEventListener('DOMContentLoaded', function () {
    const ic = document.getElementById('icone-tema');
    if (!ic) return;
    if (salvo === 'time') ic.className = 'ti ti-flame';
    else if (salvo === 'claro') ic.className = 'ti ti-sun';
    else ic.className = 'ti ti-moon';
  });
})();
