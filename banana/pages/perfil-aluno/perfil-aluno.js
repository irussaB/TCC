const apiAlunos = 'http://localhost/banana/api/ALUNOS/';
const apiMatriculas = 'http://localhost/banana/api/MATRICULAS/';

function getParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

function renderLinha(label, valor) {
  return `<div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:6px;"><span style="color:var(--texto-mudo)">${label}</span><span>${valor || '—'}</span></div>`;
}

function carregar() {
  const id = getParam('id');
  if (!id) { document.getElementById('perfil-nome').textContent = 'Aluno não encontrado'; return; }

  Promise.all([
    fetch(`${apiAlunos}SALUNOS.php`).then(r => r.json()),
    fetch(`${apiMatriculas}SMATRICULAS.php`).then(r => r.json())
  ]).then(([alunos, matriculas]) => {
    const aluno = alunos.find(a => a.id == id);
    if (!aluno) { document.getElementById('perfil-nome').textContent = 'Aluno não encontrado'; return; }

    const idade = aluno.datanasc ? calcularIdade(aluno.datanasc) : null;
    const matricula = matriculas.find(m => m.aluno_id == id);

    document.getElementById('perfil-avatar').textContent = iniciais(aluno.nome);
    document.getElementById('perfil-nome').textContent = aluno.nome;
    document.getElementById('perfil-sub').textContent =
      `${idade ? idade + ' anos' : ''} · ${aluno.sexo === 'F' ? 'Feminino' : 'Masculino'} · Matrícula em ${matricula ? formatarData(matricula.data_matricula) : '—'}`;

    document.getElementById('dados-pessoais').innerHTML =
      renderLinha('Nome completo', aluno.nome) +
      renderLinha('Sexo', aluno.sexo === 'F' ? 'Feminino' : 'Masculino') +
      renderLinha('Nascimento', formatarData(aluno.datanasc)) +
      renderLinha('Idade', idade ? idade + ' anos' : '—') +
      renderLinha('Peso / Altura', `${aluno.peso} kg / ${aluno.altura} cm`) +
      renderLinha('E-mail', aluno.email) +
      renderLinha('Telefone', aluno.telefone) +
      renderLinha('CPF', aluno.cpf) +
      renderLinha('Endereço', `${aluno.endereco}, ${aluno.numero} - ${aluno.bairro}`) +
      renderLinha('Cidade/UF', `${aluno.cidade}/${aluno.uf}`);

    document.getElementById('dados-contato').innerHTML =
      renderLinha('Nome', aluno.contatoemergencianome) +
      renderLinha('Telefone', aluno.contatoemergenciatelefone) +
      renderLinha('CPF', aluno.contatoemergenciacpf);

    document.getElementById('dados-turmas').innerHTML =
      matricula && matricula.turmaNome
        ? matricula.turmaNome.split(', ').map(t => `<span class="badge badge-laranja" style="margin:2px">${t}</span>`).join('')
        : '<p style="color:var(--texto-mudo);font-size:13px;">Não vinculado a nenhuma turma.</p>';

    let docs = '';
    if (aluno.atestadomedico) {
      docs += `<div class="doc-linha"><span><i class="ti ti-file-medical"></i> Exame médico</span>
        <a href="${aluno.atestadomedico}" target="_blank" class="btn-detalhes"><i class="ti ti-eye"></i> Ver</a></div>`;
    }
    if (aluno.autorizacaoresponsavel) {
      docs += `<div class="doc-linha"><span><i class="ti ti-file-certificate"></i> Autorização do responsável</span>
        <a href="${aluno.autorizacaoresponsavel}" target="_blank" class="btn-detalhes"><i class="ti ti-eye"></i> Ver</a></div>`;
    }
    document.getElementById('dados-documentos').innerHTML = docs || '<p style="color:var(--texto-mudo);font-size:13px;">Nenhum documento anexado.</p>';
  });
}

window.onload = carregar;