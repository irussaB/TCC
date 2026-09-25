// ================================================
//  ESCOLINHA DE BASQUETE — app.js
// ================================================

// ── TEMA ──
function alternarTema() {
  const claro = document.body.classList.toggle('tema-claro');
  const icone = document.getElementById('icone-tema');
  if (icone) icone.className = claro ? 'ti ti-sun' : 'ti ti-moon';
  localStorage.setItem('tema', claro ? 'claro' : 'escuro');
}
(function () {
  const salvo = localStorage.getItem('tema');
  if (salvo === 'claro') document.body.classList.add('tema-claro');
  document.addEventListener('DOMContentLoaded', function () {
    const icone = document.getElementById('icone-tema');
    if (icone) icone.className = salvo === 'claro' ? 'ti ti-sun' : 'ti ti-moon';
  });
})();

// ── MENU DROPDOWN (ícone hamburguer) ──
function abrirMenuDropdown() {
  const dd = document.getElementById('menu-dropdown');
  if (dd) dd.classList.toggle('aberto');
}
document.addEventListener('click', function (e) {
  const dd = document.getElementById('menu-dropdown');
  if (dd && !e.target.closest('.btn-menu-icone') && !e.target.closest('.menu-dropdown')) {
    dd.classList.remove('aberto');
  }
});

// ── LOGOUT DO PROFESSOR ──
function confirmarSaidaProfessor() {
  const modal = document.getElementById('modal-sair-professor');
  if (modal) modal.classList.add('ativo');
}
function fecharModalSairProfessor() {
  const modal = document.getElementById('modal-sair-professor');
  if (modal) modal.classList.remove('ativo');
}
function sairProfessorAgora() {
  localStorage.removeItem('professor-logado');
  window.location.href = '../../index.html';
}

// ── MÁSCARAS ──
function mascaraCPF(input) {
  let v = input.value.replace(/\D/g, '');
  v = v.replace(/(\d{3})(\d)/, '$1.$2');
  v = v.replace(/(\d{3})(\d)/, '$1.$2');
  v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  input.value = v;
}
function mascaraTelefone(input) {
  let v = input.value.replace(/\D/g, '');
  v = v.replace(/^(\d{2})(\d)/, '($1) $2');
  v = v.replace(/(\d{5})(\d{4})$/, '$1-$2');
  input.value = v;
}
function mascaraCEP(input) {
  let v = input.value.replace(/\D/g, '');
  v = v.replace(/(\d{5})(\d{1,3})$/, '$1-$2');
  input.value = v;
}
function emailValido(email) {
  return /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(email);
}
function validarEmailCampo(input) {
  if (input.value && !emailValido(input.value)) {
    input.setCustomValidity('Informe um e-mail válido (ex: nome@dominio.com)');
  } else {
    input.setCustomValidity('');
  }
}

// ── BUSCA DE CEP ──
function buscarCEP(inputId, alvoIds) {
  const input = document.getElementById(inputId);
  if (!input) return;
  const cep = input.value.replace(/\D/g, '');
  if (cep.length !== 8) return;

  fetch(`https://viacep.com.br/ws/${cep}/json/`)
    .then(r => r.json())
    .then(dados => {
      if (dados.erro) { alert('CEP não encontrado.'); return; }
      if (alvoIds.endereco) document.getElementById(alvoIds.endereco).value = dados.logradouro || '';
      if (alvoIds.bairro) document.getElementById(alvoIds.bairro).value = dados.bairro || '';
      if (alvoIds.cidade) document.getElementById(alvoIds.cidade).value = dados.localidade || '';
      if (alvoIds.uf) document.getElementById(alvoIds.uf).value = dados.uf || '';
      if (alvoIds.numero) document.getElementById(alvoIds.numero).focus();
    })
    .catch(() => alert('Não foi possível buscar o CEP agora.'));
}

// ── UPLOAD ──
function mostrarArquivo(input, idTexto) {
  const paragrafo = document.getElementById(idTexto);
  if (input.files && input.files[0]) {
    paragrafo.textContent = '✓ ' + input.files[0].name;
  }
}

// ── IDADE ──
function calcularIdade(dataNascimento) {
  if (!dataNascimento) return null;
  const hoje = new Date();
  const nasc = new Date(dataNascimento);
  let idade = hoje.getFullYear() - nasc.getFullYear();
  const mesPassou = hoje.getMonth() > nasc.getMonth() ||
    (hoje.getMonth() === nasc.getMonth() && hoje.getDate() >= nasc.getDate());
  if (!mesPassou) idade--;
  return idade;
}

function calcularCategoria() {
  const nascimento = document.getElementById('nascimento');
  const sexo = document.getElementById('sexo');
  if (!nascimento || !sexo) return;
  const idade = calcularIdade(nascimento.value);
  if (sexo.value === 'F') { mostrarBannerTurma('Sugestão de turma: Sub Feminino'); return; }
  if (sexo.value === 'M' && idade !== null) {
    let cat = idade <= 10 ? 'Sub 10' : idade <= 13 ? 'Sub 13' : idade <= 16 ? 'Sub 16' : 'Sub 18';
    mostrarBannerTurma(`Sugestão de turma: ${cat} · ${idade} anos`);
  }
}
function mostrarBannerTurma(texto) {
  const banner = document.getElementById('banner-turma');
  const textoEl = document.getElementById('texto-turma');
  if (banner && textoEl) { textoEl.textContent = texto; banner.style.display = 'flex'; }
}

// ── UTILITÁRIOS ──
function iniciais(nome) {
  const partes = (nome || '?').trim().split(' ');
  return (partes[0][0] + (partes[1] ? partes[1][0] : '')).toUpperCase();
}
function formatarData(iso) {
  if (!iso) return '—';
  const [ano, mes, dia] = iso.split('-');
  return `${dia}/${mes}/${ano}`;
}
function censurarCPF(cpf) {
  if (!cpf) return '—';
  return cpf.replace(/(\d{3})\.\d{3}\.\d{3}-(\d{2})/, '***.$2***.$3-**').replace(/(\d{3})\.(\d{3})\.(\d{3})-(\d{2})/, '***.$2.$3-**').replace(/^(\d{3})/, '***');
}

// ── TOAST ──
function toast(msg, tipo) {
  let wrap = document.getElementById('toasts');
  if (!wrap) {
    wrap = document.createElement('div');
    wrap.id = 'toasts';
    wrap.className = 'toast-wrap';
    document.body.appendChild(wrap);
  }
  const el = document.createElement('div');
  el.className = `toast ${tipo || 'sucesso'}`;
  el.innerHTML = `<i class="ti ti-${tipo === 'erro' ? 'x' : 'check'}"></i> ${msg}`;
  wrap.appendChild(el);
  setTimeout(() => el.remove(), 3000);
}