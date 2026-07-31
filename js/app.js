// ================================================
//  ESCOLINHA DE BASQUETE — app.js
//  Funções usadas em todas as páginas
// ================================================


// ── MÁSCARAS DE FORMULÁRIO ───────────────────────

// Formata o CPF enquanto o usuário digita: 000.000.000-00
function mascaraCPF(input) {
  let v = input.value.replace(/\D/g, ''); // remove tudo que não é número
  v = v.replace(/(\d{3})(\d)/, '$1.$2');
  v = v.replace(/(\d{3})(\d)/, '$1.$2');
  v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  input.value = v;
}

// Formata o telefone: (00) 9 0000-0000
function mascaraTelefone(input) {
  let v = input.value.replace(/\D/g, '');
  v = v.replace(/^(\d{2})(\d)/, '($1) $2');
  v = v.replace(/(\d{5})(\d{4})$/, '$1-$2');
  input.value = v;
}


// ── CHIPS (SELEÇÃO DE SUBCATEGORIA) ─────────────

// Ao clicar em um chip, remove o destaque de todos e aplica no clicado
function selecionarChip(chip) {
  const grupo = chip.closest('.chip-grupo');
  grupo.querySelectorAll('.chip').forEach(c => c.classList.remove('selecionado'));
  chip.classList.add('selecionado');
}


// ── UPLOAD DE ARQUIVO ────────────────────────────

// Mostra o nome do arquivo selecionado embaixo do botão de upload
function mostrarArquivo(input, idTexto) {
  const paragrafo = document.getElementById(idTexto);
  if (input.files && input.files[0]) {
    paragrafo.textContent = '✓ ' + input.files[0].name;
  }
}


// ── CÁLCULO AUTOMÁTICO DE CATEGORIA ─────────────

// Calcula a idade e define a subcategoria automaticamente
// com base na data de nascimento e no sexo informado
function calcularCategoria() {
  const nascimento = document.getElementById('nascimento');
  const sexo       = document.getElementById('sexo');
  const banner     = document.getElementById('banner-turma');
  const textoTurma = document.getElementById('texto-turma');
  const chips      = document.querySelectorAll('#chips-sub .chip');

  if (!nascimento || !sexo) return; // página não tem o formulário

  // Se feminino, vai direto para Sub Feminino
  if (sexo.value === 'F') {
    mostrarBannerTurma('Turma: Sub Feminino (definida pelo sexo)');
    chips.forEach(c => {
      c.classList.remove('selecionado');
      if (c.textContent.trim() === 'Sub Feminino') c.classList.add('selecionado');
    });
    return;
  }

  // Se masculino, calcula a idade
  if (sexo.value === 'M' && nascimento.value) {
    const hoje       = new Date();
    const nasc       = new Date(nascimento.value);
    let idade        = hoje.getFullYear() - nasc.getFullYear();
    const mesPassou  = hoje.getMonth() > nasc.getMonth() ||
                      (hoje.getMonth() === nasc.getMonth() && hoje.getDate() >= nasc.getDate());
    if (!mesPassou) idade--;

    // Define a subcategoria pela idade
    let categoria = '';
    if      (idade <= 10) categoria = 'Sub 10';
    else if (idade <= 13) categoria = 'Sub 13';
    else if (idade <= 16) categoria = 'Sub 16';
    else if (idade <= 18) categoria = 'Sub 18';
    else                  categoria = 'Sub 18'; // 19–22 ficam na Sub 18

    mostrarBannerTurma(`Turma: ${categoria} · ${idade} anos (definida pela idade)`);
    chips.forEach(c => {
      c.classList.remove('selecionado');
      if (c.textContent.trim() === categoria) c.classList.add('selecionado');
    });
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


// ── SALVAR RASCUNHO ──────────────────────────────

// Salva os dados do formulário no localStorage do navegador
// (funciona sem banco de dados — os dados ficam no próprio navegador)
function salvarRascunho() {
  const dados = {
    nome:       document.getElementById('nome')?.value,
    nascimento: document.getElementById('nascimento')?.value,
    sexo:       document.getElementById('sexo')?.value,
    cpfAluno:   document.getElementById('cpf-aluno')?.value,
    emailAluno: document.getElementById('email-aluno')?.value,
    nomeResp:   document.getElementById('nome-resp')?.value,
    professor:  document.getElementById('professor')?.value,
  };
  localStorage.setItem('rascunho-cadastro', JSON.stringify(dados));
  alert('Rascunho salvo! Os dados ficam guardados neste navegador.');
}

// Ao carregar a página de cadastro, tenta recuperar o rascunho
function carregarRascunho() {
  const rascunho = localStorage.getItem('rascunho-cadastro');
  if (!rascunho) return;

  const dados = JSON.parse(rascunho);
  if (document.getElementById('nome')) {
    if (dados.nome)       document.getElementById('nome').value       = dados.nome;
    if (dados.nascimento) document.getElementById('nascimento').value = dados.nascimento;
    if (dados.sexo)       document.getElementById('sexo').value       = dados.sexo;
    if (dados.cpfAluno)   document.getElementById('cpf-aluno').value  = dados.cpfAluno;
    if (dados.emailAluno) document.getElementById('email-aluno').value= dados.emailAluno;
    if (dados.nomeResp)   document.getElementById('nome-resp').value  = dados.nomeResp;
    if (dados.professor)  document.getElementById('professor').value  = dados.professor;

    // Recalcula a categoria com os dados carregados
    calcularCategoria();
  }
}


// ── ENVIO DO FORMULÁRIO ──────────────────────────

const formCadastro = document.getElementById('form-cadastro');
if (formCadastro) {
  formCadastro.addEventListener('submit', function(e) {
    e.preventDefault(); // impede o envio padrão do browser

    function finalizarEnvio() {
      // Esconde o formulário e mostra a tela de confirmação
      formCadastro.style.display = 'none';
      const confirmacao = document.getElementById('tela-confirmacao');
      if (confirmacao) {
        confirmacao.style.display = 'block';
        confirmacao.scrollIntoView({ behavior: 'smooth' });
      }

      localStorage.removeItem('rascunho-cadastro'); // limpa o rascunho
    }

    // EASTER EGG: animação de "bola na cesta" antes da confirmação
    if (typeof window.mostrarAnimacaoCesta === 'function') {
      window.mostrarAnimacaoCesta(finalizarEnvio);
    } else {
      finalizarEnvio();
    }
  });
}


// ── INICIALIZAÇÃO ────────────────────────────────

// Roda quando a página termina de carregar
document.addEventListener('DOMContentLoaded', function() {
  carregarRascunho();
});
