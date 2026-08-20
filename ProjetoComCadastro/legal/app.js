// ================================================
//  ESCOLINHA DE BASQUETE — app.js
//  Funções compartilhadas por todas as páginas
// ================================================

// ── TEMA (claro/escuro) ─────────────────────────
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

// ── SAIR (LOGOUT DO PROFESSOR) ──────────────────
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
  window.location.href = '/legal/pages/login/index.html';
}

// ── MÁSCARAS DE FORMULÁRIO ───────────────────────
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

// Validação de e-mail: só aceita formato nome@dominio.tld
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

// ── BUSCA DE CEP (autopreenchimento de endereço) ─
function buscarCEP(inputId, alvoIds) {
  const input = document.getElementById(inputId);
  if (!input) return;
  const cep = input.value.replace(/\D/g, '');
  if (cep.length !== 8) return;

  fetch(`https://viacep.com.br/ws/${cep}/json/`)
    .then(r => r.json())
    .then(dados => {
      if (dados.erro) {
        alert('CEP não encontrado.');
        return;
      }
      if (alvoIds.endereco && document.getElementById(alvoIds.endereco)) document.getElementById(alvoIds.endereco).value = dados.logradouro || '';
      if (alvoIds.bairro && document.getElementById(alvoIds.bairro)) document.getElementById(alvoIds.bairro).value = dados.bairro || '';
      if (alvoIds.cidade && document.getElementById(alvoIds.cidade)) document.getElementById(alvoIds.cidade).value = dados.localidade || '';
      if (alvoIds.uf && document.getElementById(alvoIds.uf)) document.getElementById(alvoIds.uf).value = dados.uf || '';
      if (alvoIds.numero && document.getElementById(alvoIds.numero)) document.getElementById(alvoIds.numero).focus();
    })
    .catch(() => alert('Não foi possível buscar o CEP agora.'));
}

// ── UPLOAD DE ARQUIVO ────────────────────────────
function mostrarArquivo(input, idTexto) {
  const paragrafo = document.getElementById(idTexto);
  if (input.files && input.files[0]) {
    paragrafo.textContent = '✓ ' + input.files[0].name;
  }
}

// ── CÁLCULO DE IDADE / SUGESTÃO DE TURMA (informativo) ──
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

  if (sexo.value === 'F') {
    mostrarBannerTurma('Sugestão de turma: Sub Feminino (definida pelo sexo)');
    return;
  }
  if (sexo.value === 'M' && idade !== null) {
    let categoria = '';
    if (idade <= 10) categoria = 'Sub 10';
    else if (idade <= 13) categoria = 'Sub 13';
    else if (idade <= 16) categoria = 'Sub 16';
    else categoria = 'Sub 18';
    mostrarBannerTurma(`Sugestão de turma: ${categoria} · ${idade} anos (o professor confirma a turma depois de aprovar a matrícula)`);
  }
}

function mostrarBannerTurma(texto) {
  const banner = document.getElementById('banner-turma');
  const textoEl = document.getElementById('texto-turma');
  if (banner && textoEl) {
    textoEl.textContent = texto;
    banner.style.display = 'flex';
  }
}
