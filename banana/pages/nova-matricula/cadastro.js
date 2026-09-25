const apiUrlAlunos = 'http://localhost/banana/api/ALUNOS/';
const apiUrlMatriculas = 'http://localhost/banana/api/MATRICULAS/';

// ── Mostra/oculta campos do responsável conforme idade ──
function atualizarSecaoResponsavel() {
  const nasc = document.getElementById('nascimento').value;
  const idade = calcularIdade(nasc);

  const titulo = document.getElementById('titulo-responsavel');
  const labelNome = document.getElementById('label-resp-nome');
  const labelCpf = document.getElementById('label-resp-cpf');
  const labelTel = document.getElementById('label-resp-tel');
  const labelAut = document.getElementById('label-autorizacao');
  const reqAut = document.getElementById('req-autorizacao');

  if (idade !== null && idade >= 18) {
    titulo.textContent = 'Contato de emergência';
    labelNome.innerHTML = 'Nome do contato <span class="req">*</span>';
    labelCpf.innerHTML = 'CPF do contato <span class="req">*</span>';
    labelTel.innerHTML = 'Telefone do contato <span class="req">*</span>';
    labelAut.innerHTML = 'Autorização do responsável (opcional)';
    if (reqAut) reqAut.remove();
  } else {
    titulo.textContent = 'Responsável';
    labelNome.innerHTML = 'Nome do responsável <span class="req">*</span>';
    labelCpf.innerHTML = 'CPF do responsável <span class="req">*</span>';
    labelTel.innerHTML = 'Telefone do responsável <span class="req">*</span>';
    labelAut.innerHTML = 'Autorização do responsável <span class="req" id="req-autorizacao">*</span>';
  }
}

// ── Converte arquivo para base64 ──
function lerArquivoBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// ── Envia via POST (JSON no body) ──
function postJSON(url, payload) {
  return fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  }).then(r => r.json());
}

document.getElementById('form-cadastro').addEventListener('submit', async function (event) {
  event.preventDefault();

  // ── Validações ──
  const nascimento = document.getElementById('nascimento').value;
  const idade = calcularIdade(nascimento);
  if (idade === null || idade < 7 || idade > 21) {
    alert('A idade deve estar entre 7 e 21 anos.');
    return;
  }

  const sexo = document.getElementById('sexo').value;
  if (!sexo) { alert('Selecione o sexo (F ou M).'); return; }

  const senha = document.getElementById('senha').value;
  const confirma = document.getElementById('confirma-senha').value;
  if (senha !== confirma) { alert('As senhas devem ser iguais.'); return; }

  const emailAluno = document.getElementById('email-aluno');
  if (!emailValido(emailAluno.value)) { alert('Informe um e-mail válido.'); return; }

  const arquivoMedico = document.getElementById('arquivo-medico');
  if (!arquivoMedico.files.length) { alert('Anexe o exame médico (PDF).'); return; }

  const arquivoAutorizacao = document.getElementById('arquivo-autorizacao');
  if (idade < 18 && !arquivoAutorizacao.files.length) {
    alert('Para menores de 18 anos, a autorização do responsável é obrigatória.');
    return;
  }

  const obrigatorios = [
    'nome', 'cpf-aluno', 'telefone-aluno', 'peso', 'altura',
    'cep', 'numero', 'endereco', 'bairro', 'cidade', 'uf', 'psf',
    'nome-resp', 'cpf-resp', 'telefone-resp'
  ];
  for (const id of obrigatorios) {
    const el = document.getElementById(id);
    if (!el.value.trim()) { alert('Preencha todos os campos obrigatórios.'); el.focus(); return; }
  }

  // ── Avisa o usuário que está enviando ──
  const btn = document.querySelector('#form-cadastro button[type="submit"]');
  const textoOriginal = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = '<i class="ti ti-loader"></i> Enviando...';

  try {
    // ── Converte PDFs ──
    const docMedicoB64 = await lerArquivoBase64(arquivoMedico.files[0]);
    const docAutB64 = arquivoAutorizacao.files.length
      ? await lerArquivoBase64(arquivoAutorizacao.files[0])
      : null;

    const aluno = {
      nome: document.getElementById('nome').value.trim(),
      email: document.getElementById('email-aluno').value.trim(),
      senha: senha,
      cpf: document.getElementById('cpf-aluno').value.trim(),
      sexo: sexo,
      datanasc: nascimento,
      telefone: document.getElementById('telefone-aluno').value.trim(),
      altura: document.getElementById('altura').value,
      peso: document.getElementById('peso').value,
      endereco: document.getElementById('endereco').value.trim(),
      bairro: document.getElementById('bairro').value.trim(),
      numero: document.getElementById('numero').value.trim(),
      cidade: document.getElementById('cidade').value.trim(),
      uf: document.getElementById('uf').value,
      cep: document.getElementById('cep').value.trim(),
      psf: document.getElementById('psf').value.trim(),
      contatoemergencianome: document.getElementById('nome-resp').value.trim(),
      contatoemergenciatelefone: document.getElementById('telefone-resp').value.trim(),
      contatoemergenciacpf: document.getElementById('cpf-resp').value.trim(),
      atestadomedico: docMedicoB64,
      autorizacaoresponsavel: docAutB64
    };

    // ── Envia aluno via POST ──
    const resultadoAluno = await postJSON(`${apiUrlAlunos}IALUNOS.php`, aluno);

    if (!resultadoAluno.id) {
      throw new Error(resultadoAluno.erro || 'Erro ao cadastrar aluno');
    }

    // ── Envia matrícula via POST ──
    const resultadoMat = await postJSON(`${apiUrlMatriculas}IMATRICULAS.php`, {
      aluno_id: resultadoAluno.id,
      data_matricula: new Date().toISOString().slice(0, 10),
      status: 'pendente'
    });

    if (!resultadoMat.id) {
      throw new Error(resultadoMat.erro || 'Erro ao criar matrícula');
    }

    // ── Sucesso ──
    document.getElementById('form-cadastro').style.display = 'none';
    document.getElementById('tela-confirmacao').style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });

  } catch (err) {
    console.error('Erro no cadastro:', err);
    alert('Erro ao enviar: ' + err.message);
    btn.disabled = false;
    btn.innerHTML = textoOriginal;
  }
});