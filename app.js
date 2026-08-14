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

// Calcula a idade a partir da data de nascimento (retorna null se não houver data)
function calcularIdade(dataNascimento) {
  if (!dataNascimento) return null;
  const hoje      = new Date();
  const nasc      = new Date(dataNascimento);
  let idade       = hoje.getFullYear() - nasc.getFullYear();
  const mesPassou = hoje.getMonth() > nasc.getMonth() ||
                    (hoje.getMonth() === nasc.getMonth() && hoje.getDate() >= nasc.getDate());
  if (!mesPassou) idade--;
  return idade;
}

// Calcula a idade e define a subcategoria automaticamente
// com base na data de nascimento e no sexo informado
function calcularCategoria() {
  const nascimento = document.getElementById('nascimento');
  const sexo       = document.getElementById('sexo');

  if (!nascimento || !sexo) return; // página não tem o formulário

  const idade = calcularIdade(nascimento.value);

  // A obrigatoriedade dos campos do responsável depende só da idade,
  // independentemente do sexo informado
  atualizarObrigatoriedadeResponsavel(idade);

  // Se feminino, vai direto para Sub Feminino
  if (sexo.value === 'F') {
    mostrarBannerTurma('Turma: Sub Feminino (definida pelo sexo)');
    return;
  }

  // Se masculino, define a subcategoria pela idade
  if (sexo.value === 'M' && idade !== null) {
    let categoria = '';
    if      (idade <= 10) categoria = 'Sub 10';
    else if (idade <= 13) categoria = 'Sub 13';
    else if (idade <= 16) categoria = 'Sub 16';
    else                  categoria = 'Sub 18'; // 17–22 ficam na Sub 18

    mostrarBannerTurma(`Turma: ${categoria} · ${idade} anos (definida pela idade)`);
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

// ── OBRIGATORIEDADE DOS CAMPOS DO RESPONSÁVEL ───
// A partir de 18 anos, o próprio aluno pode se responsabilizar,
// então os campos do responsável deixam de ser obrigatórios.
function atualizarObrigatoriedadeResponsavel(idade) {
  const secao = document.getElementById('secao-responsavel');
  if (!secao) return; // página não tem essa seção

  const maiorDeIdade = idade !== null && idade >= 18;
  const campos = ['nome-resp', 'cpf-resp', 'telefone', 'email-resp'];

  campos.forEach(id => {
    const campo = document.getElementById(id);
    if (!campo) return;
    if (maiorDeIdade) campo.removeAttribute('required');
    else              campo.setAttribute('required', '');
  });

  secao.querySelectorAll('.req').forEach(span => {
    span.style.display = maiorDeIdade ? 'none' : 'inline';
  });

  const badge = document.getElementById('badge-responsavel');
  if (badge) {
    badge.textContent = maiorDeIdade ? 'Opcional (aluno maior de idade)' : 'Obrigatório até 18 anos';
  }
}


// ── SALVAR RASCUNHO ──────────────────────────────

// Salva os dados do formulário no localStorage do navegador
// (funciona sem banco de dados — os dados ficam no próprio navegador)
function salvarRascunho() {
  const dados = {
    nome:          document.getElementById('nome')?.value,
    nascimento:    document.getElementById('nascimento')?.value,
    sexo:          document.getElementById('sexo')?.value,
    cpfAluno:      document.getElementById('cpf-aluno')?.value,
    emailAluno:    document.getElementById('email-aluno')?.value,
    telefoneAluno: document.getElementById('telefone-aluno')?.value,
    endereco:      document.getElementById('endereco')?.value,
    numero:        document.getElementById('numero')?.value,
    bairro:        document.getElementById('bairro')?.value,
    cidade:        document.getElementById('cidade')?.value,
    uf:            document.getElementById('uf')?.value,
    nomeResp:      document.getElementById('nome-resp')?.value,
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
    if (dados.nome)          document.getElementById('nome').value          = dados.nome;
    if (dados.nascimento)    document.getElementById('nascimento').value    = dados.nascimento;
    if (dados.sexo)          document.getElementById('sexo').value          = dados.sexo;
    if (dados.cpfAluno)      document.getElementById('cpf-aluno').value      = dados.cpfAluno;
    if (dados.emailAluno)    document.getElementById('email-aluno').value    = dados.emailAluno;
    if (dados.telefoneAluno) document.getElementById('telefone-aluno').value = dados.telefoneAluno;
    if (dados.endereco)      document.getElementById('endereco').value       = dados.endereco;
    if (dados.numero)        document.getElementById('numero').value         = dados.numero;
    if (dados.bairro)        document.getElementById('bairro').value         = dados.bairro;
    if (dados.cidade)        document.getElementById('cidade').value         = dados.cidade;
    if (dados.uf)            document.getElementById('uf').value             = dados.uf;
    if (dados.nomeResp)      document.getElementById('nome-resp').value       = dados.nomeResp;

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
