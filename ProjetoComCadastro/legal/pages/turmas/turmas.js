const apiUrlTurmas = 'http://localhost/legal/api/TURMAS/';
const apiUrlProfessores = 'http://localhost/legal/api/PROFESSORES/';
const apiUrlMatriculas = 'http://localhost/legal/api/MATRICULAS/';

let turmas = [];
let matriculas = [];
let professores = [];
let turmaAbertaId = null;

function carregarProfessores() {
  return fetch(`${apiUrlProfessores}SPROFESSORES.php`)
    .then(r => r.json())
    .then(data => {
      professores = data;
      const select = document.getElementById('turma-professor');
      select.innerHTML = '<option value="">Selecione o professor</option>' +
        data.map(p => `<option value="${p.id}">${p.nome}</option>`).join('');
    });
}

function carregarTurmas() {
  return fetch(`${apiUrlTurmas}STURMAS.php`)
    .then(r => r.json())
    .then(data => { turmas = data; renderTurmas(); });
}

function carregarMatriculas() {
  return fetch(`${apiUrlMatriculas}SMATRICULAS.php`)
    .then(r => r.json())
    .then(data => { matriculas = data; });
}

function renderTurmas() {
  const cont = document.getElementById('lista-turmas');
  cont.innerHTML = turmas.map(t => `
    <div class="turma-card">
      <div class="turma-cabecalho" onclick="abrirModalAlunos(${t.id})">
        <div class="turma-icone"><i class="ti ti-ball-basketball"></i></div>
        <div class="turma-info">
          <div class="turma-nome">${t.nome}</div>
          <div class="turma-detalhe"><i class="ti ti-user"></i> Prof. ${t.proNome || '—'}</div>
        </div>
        <span class="turma-badge">${t.totalAlunos} alunos</span>
        <i class="ti ti-chevron-right"></i>
      </div>
    </div>
  `).join('') || '<div class="estado-vazio" style="display:block"><i class="ti ti-inbox"></i><p>Nenhuma turma cadastrada ainda.</p></div>';
}

function criarTurma() {
  const nome = document.getElementById('turma-nome').value.trim();
  const proid = document.getElementById('turma-professor').value;
  if (!nome || !proid) {
    alert('Preencha o nome da turma e escolha o professor responsável.');
    return;
  }
  fetch(`${apiUrlTurmas}ITURMAS.php?jsn=${encodeURIComponent(JSON.stringify({ nome, proid }))}`)
    .then(r => r.json())
    .then(() => {
      document.getElementById('turma-nome').value = '';
      document.getElementById('turma-professor').value = '';
      carregarTurmas();
    });
}

// ── GESTÃO DE ALUNOS DENTRO DA TURMA ────────────
function abrirModalAlunos(turid) {
  turmaAbertaId = turid;
  const turma = turmas.find(t => t.id === turid);
  document.getElementById('modal-turma-titulo').textContent = 'Turma ' + (turma ? turma.nome : '');
  document.getElementById('busca-aluno-turma').value = '';
  renderAlunosNaTurma();
  filtrarAlunosDisponiveis();
  document.getElementById('modal-alunos-turma').classList.add('aberto');
}

function fecharModalAlunos(e) { if (e.target.id === 'modal-alunos-turma') fecharModalAlunosBtn(); }
function fecharModalAlunosBtn() { document.getElementById('modal-alunos-turma').classList.remove('aberto'); turmaAbertaId = null; }

function calcularIdadeSimples(nascimento) {
  if (!nascimento) return '—';
  const idade = calcularIdade(nascimento);
  return idade !== null ? idade + ' anos' : '—';
}

function renderAlunosNaTurma() {
  const tbody = document.getElementById('tbody-alunos-turma');
  const alunosDaTurma = matriculas.filter(m => m.status === 'aprovada' && m.turid == turmaAbertaId);
  tbody.innerHTML = alunosDaTurma.map(m => `
    <tr>
      <td>${m.nome}</td>
      <td>${calcularIdadeSimples(m.nascimento)}</td>
      <td><button class="btn-detalhes" onclick="removerDaTurma(${m.id})"><i class="ti ti-x"></i> Remover</button></td>
    </tr>
  `).join('') || '<tr><td colspan="3" style="text-align:center;color:var(--texto-mudo)">Nenhum aluno matriculado ainda</td></tr>';
}

function filtrarAlunosDisponiveis() {
  const termo = document.getElementById('busca-aluno-turma').value.toLowerCase();
  const disponiveis = matriculas.filter(m =>
    m.status === 'aprovada' &&
    m.turid != turmaAbertaId &&
    m.nome.toLowerCase().includes(termo)
  );
  const cont = document.getElementById('lista-alunos-disponiveis');
  cont.innerHTML = disponiveis.slice(0, 20).map(m => `
    <div class="aluno-disponivel-linha">
      <span>${m.nome} ${m.turmaNome ? `<span style="color:var(--texto-mudo)">(${m.turmaNome})</span>` : ''}</span>
      <button class="btn-aceitar" onclick="adicionarNaTurma(${m.id})"><i class="ti ti-plus"></i> Adicionar</button>
    </div>
  `).join('') || '<p style="color:var(--texto-mudo);font-size:13px;">Nenhum aluno aprovado disponível.</p>';
}

function adicionarNaTurma(matid) {
  fetch(`${apiUrlMatriculas}UMATRICULAS.php?jsn=${encodeURIComponent(JSON.stringify({ id: matid, turid: turmaAbertaId }))}`)
    .then(r => r.json())
    .then(() => Promise.all([carregarMatriculas(), carregarTurmas()]))
    .then(() => { renderAlunosNaTurma(); filtrarAlunosDisponiveis(); });
}

function removerDaTurma(matid) {
  fetch(`${apiUrlMatriculas}UMATRICULAS.php?jsn=${encodeURIComponent(JSON.stringify({ id: matid, turid: null }))}`)
    .then(r => r.json())
    .then(() => Promise.all([carregarMatriculas(), carregarTurmas()]))
    .then(() => { renderAlunosNaTurma(); filtrarAlunosDisponiveis(); });
}

window.onload = () => {
  Promise.all([carregarProfessores(), carregarMatriculas()]).then(carregarTurmas);
};
