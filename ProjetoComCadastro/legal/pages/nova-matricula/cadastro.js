const apiUrlAlunos = 'http://localhost/legal/api/ALUNOS/';
const apiUrlMatriculas = 'http://localhost/legal/api/MATRICULAS/';

document.getElementById('form-cadastro').addEventListener('submit', function (event) {
  event.preventDefault();

  const arquivoAutorizacao = document.getElementById('arquivo-autorizacao');
  const arquivoMedico = document.getElementById('arquivo-medico');

  if (!arquivoAutorizacao.files.length || !arquivoMedico.files.length) {
    alert('É obrigatório anexar a autorização dos pais/responsável e o exame médico para enviar a matrícula.');
    return;
  }

  const emailAluno = document.getElementById('email-aluno');
  const emailResp = document.getElementById('email-resp');
  if (!emailValido(emailAluno.value) || !emailValido(emailResp.value)) {
    alert('Informe um e-mail válido (ex: nome@dominio.com).');
    return;
  }

  const aluno = {
    sexo: document.getElementById('sexo').value,
    nome: document.getElementById('nome').value,
    email: emailAluno.value,
    telefone: document.getElementById('telefone-aluno').value,
    cpf: document.getElementById('cpf-aluno').value,
    nascimento: document.getElementById('nascimento').value,
    altura: document.getElementById('altura').value,
    peso: document.getElementById('peso').value,
    cidade: document.getElementById('cidade').value,
    uf: document.getElementById('uf').value,
    endereco: document.getElementById('endereco').value,
    numero: document.getElementById('numero').value,
    bairro: document.getElementById('bairro').value,
    cep: document.getElementById('cep').value,
    rg: document.getElementById('rg').value,
    respNome: document.getElementById('nome-resp').value,
    respCpf: document.getElementById('cpf-resp').value,
    respTelefone: document.getElementById('telefone').value,
    respEmail: emailResp.value,
    docAutorizacao: arquivoAutorizacao.files[0].name,
    docMedico: arquivoMedico.files[0].name,
    psf: '',
    senha: document.getElementById('cpf-aluno').value.replace(/\D/g, '')
  };

  fetch(`${apiUrlAlunos}IALUNOS.php?jsn=${encodeURIComponent(JSON.stringify(aluno))}`)
    .then(r => r.json())
    .then(resultado => {
      const aluid = resultado.id;
      const matricula = { aluid, turid: null, status: 'pendente', data: new Date().toISOString().slice(0, 10) };
      return fetch(`${apiUrlMatriculas}IMATRICULAS.php?jsn=${encodeURIComponent(JSON.stringify(matricula))}`);
    })
    .then(r => r.json())
    .then(() => {
      document.getElementById('form-cadastro').style.display = 'none';
      document.getElementById('tela-confirmacao').style.display = 'block';
      document.getElementById('tela-confirmacao').scrollIntoView({ behavior: 'smooth' });
    })
    .catch(() => alert('Não foi possível enviar a matrícula agora. Tente novamente.'));
});
