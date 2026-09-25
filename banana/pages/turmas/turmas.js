const apiUrlTurmas = 'http://localhost/banana/api/TURMAS/';
const apiUrlProfessores = 'http://localhost/banana/api/PROFESSORES/';
const apiUrlMatriculas = 'http://localhost/banana/api/MATRICULAS/';
const apiUrlMT = 'http://localhost/banana/api/MATRICULAS/';

let turmas = [], matriculas = [], vinculos = [], professores = [];
let turmaAbertaId = null, turmaEditandoId = null, turmaDeletandoId = null;

function carregarProfessores() {
  return fetch(`${apiUrlProfessores}SPROFESSORES.php`).then(r => r.json()).then(data => {
    professores = data;
    document.getElementById('turma-professor').innerHTML = '<option value="">Selecione</option>' +
      data.map(p => `<option value="${p.id}">${p.nome}</option>`).join('');
  });
}
function carregarTurmas() {
  return fetch(`${apiUrlTurmas}STURMAS.php`).then(r => r.json()).then(d => { turmas = d; renderTurmas(); });
}
function carregarMatriculas() {
  return fetch(`${apiUrlMatriculas}SMATRICULAS.php`).then(r => r.json()).then(d => { matriculas = d; });
}
function carregarVinculos() {
  return fetch(`${apiUrlMT}SMATRICULAS_TURMAS.php`).then(r => r.json()).then(d => { vinculos = d; });
}

function renderTurmas() {
  const cont = document.getElementById('lista-turmas');
  if (!turmas.length) {
    cont.innerHTML = '<div class="estado-vazio" style="display:block"><i class="ti ti-inbox"></i><p>Nenhuma turma cadastrada ainda.</p></div>';
    return;
  }
  cont.innerHTML = turmas.map(t => `
    <div class="card">
      <div class="card-header" style="cursor:pointer" onclick="abrirModalAlunos(${t.id})">
        <i class="ti ti-ball-basketball"></i>
        <span style="flex:1">${t.nome}</span>
        <span style="font-size:12px;color:var(--texto-mudo)">Prof. ${t.professorNome || '—'}</span>
        <span class="badge badge-laranja">${t.totalAlunos} alunos</span>
      </div>
      <div style="padding:10px 20px;display:flex;gap:8px;">
        <button class="btn-detalhes" onclick="abrirModalAlunos(${t.id})"><i class="ti ti-eye"></i> Visualizar</button>
        <button class="btn-detalhes" onclick="editarTurma(${t.id})"><i class="ti ti-pencil"></i> Editar</button>
        <button class="btn-recusar" onclick="abrirDelete(${t.id})"><i class="ti ti-trash"></i> Excluir</button>
      </div>
    </div>
  `).join('');
}

function salvarTurma() {
  const nome = document.getElementById('turma-nome').value.trim();
  const professor_id = document.getElementById('turma-professor').value;
  if (!nome || !professor_id) { alert('Preencha o nome e selecione o professor.'); return; }

  if (turmaEditandoId) {
    fetch(`${apiUrlTurmas}UTURMAS.php?jsn=${encodeURIComponent(JSON.stringify({ id: turmaEditandoId, nome, professor_id }))}`)
      .then(r => r.json()).then(() => { cancelarEdicao(); carregarTurmas(); });
  } else {
    const duplicada = turmas.find(t => t.nome.toLowerCase() === nome.toLowerCase());
    if (duplicada) { alert('Já existe uma turma com esse nome.'); return; }
    fetch(`${apiUrlTurmas}ITURMAS.php?jsn=${encodeURIComponent(JSON.stringify({ nome, professor_id }))}`)
      .then(r => r.json()).then(() => {
        document.getElementById('turma-nome').value = '';
        document.getElementById('turma-professor').value = '';
        carregarTurmas();
      });
  }
}

function editarTurma(id) {
  const t = turmas.find(x => x.id === id);
  if (!t) return;
  turmaEditandoId = id;
  document.getElementById('turma-nome').value = t.nome;
  document.getElementById('turma-professor').value = t.professor_id;
  document.getElementById('form-turma-titulo').textContent = 'Editar turma';
  document.getElementById('btn-turma').innerHTML = '<i class="ti ti-device-floppy" style="margin-right:6px"></i> Salvar turma';
  document.getElementById('btn-cancelar-edicao').style.display = 'block';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
function cancelarEdicao() {
  turmaEditandoId = null;
  document.getElementById('turma-nome').value = '';
  document.getElementById('turma-professor').value = '';
  document.getElementById('form-turma-titulo').textContent = 'Nova turma';
  document.getElementById('btn-turma').innerHTML = '<i class="ti ti-plus" style="margin-right:6px"></i> Criar turma';
  document.getElementById('btn-cancelar-edicao').style.display = 'none';
}

function abrirDelete(id) { turmaDeletandoId = id; document.getElementById('modal-confirmar-delete').classList.add('aberto'); }
function fecharModalDelete(e) { if (e.target.id === 'modal-confirmar-delete') fecharModalDeleteBtn(); }
function fecharModalDeleteBtn() { document.getElementById('modal-confirmar-delete').classList.remove('aberto'); turmaDeletandoId = null; }
function confirmarDelete() {
  fetch(`${apiUrlTurmas}DTURMAS.php?jsn=${encodeURIComponent(JSON.stringify({ id: turmaDeletandoId }))}`)
    .then(r => r.json()).then(() => { fecharModalDeleteBtn(); carregarTurmas(); });
}

// ── ALUNOS DA TURMA ──
function abrirModalAlunos(id) {
  turmaAbertaId = id;
  const t = turmas.find(x => x.id === id);
  document.getElementById('modal-turma-titulo').textContent = 'Turma ' + (t ? t.nome : '');
  document.getElementById('busca-aluno-turma').value = '';
  renderAlunosNaTurma();
  filtrarAlunosDisponiveis();
  document.getElementById('modal-alunos-turma').classList.add('aberto');
}
function fecharModalAlunos(e) { if (e.target.id === 'modal-alunos-turma') fecharModalAlunosBtn(); }
function fecharModalAlunosBtn() { document.getElementById('modal-alunos-turma').classList.remove('aberto'); turmaAbertaId = null; }

function renderAlunosNaTurma() {
  const tbody = document.getElementById('tbody-alunos-turma');
  const daTurma = vinculos.filter(v => v.turmaId == turmaAbertaId);
  tbody.innerHTML = daTurma.map(v => `
    <tr>
      <td>${v.alunoNome}</td>
      <td>${v.nascimento ? calcularIdade(v.nascimento) + ' anos' : '—'}</td>
      <td>
        <button class="btn-detalhes" onclick="window.location.href='../perfil-aluno/index.html?id=${v.alunoId}'"><i class="ti ti-eye"></i> Perfil</button>
        <button class="btn-recusar" onclick="removerDaTurma(${v.id})"><i class="ti ti-x"></i> Remover</button>
      </td>
    </tr>
  `).join('') || '<tr><td colspan="3" style="text-align:center;color:var(--texto-mudo)">Nenhum aluno matriculado ainda</td></tr>';
}

function filtrarAlunosDisponiveis() {
  const termo = document.getElementById('busca-aluno-turma').value.toLowerCase();
  const jaNaTurma = vinculos.filter(v => v.turmaId == turmaAbertaId).map(v => v.matriculaId);

  const disp = matriculas.filter(m =>
    m.status === 'aprovada' && !jaNaTurma.includes(m.id) &&
    m.nome.toLowerCase().includes(termo)
  );

  const cont = document.getElementById('lista-alunos-disponiveis');
  cont.innerHTML = disp.slice(0, 20).map(m => {
    const outrasTurmas = vinculos.filter(v => v.matriculaId === m.id).length;
    return `
      <div class="exercicio-selecao-item">
        <span>${m.nome} ${outrasTurmas ? '<span style="color:var(--texto-mudo)">(já em outra turma)</span>' : ''}</span>
        <button class="btn-aceitar" onclick="adicionarNaTurma(${m.id})"><i class="ti ti-plus"></i> Adicionar</button>
      </div>`;
  }).join('') || '<p style="color:var(--texto-mudo);font-size:13px;">Nenhum aluno disponível.</p>';
}

function adicionarNaTurma(matId) {
  fetch(`${apiUrlMT}IMATRICULAS_TURMAS.php?jsn=${encodeURIComponent(JSON.stringify({ matriculaId: matId, turmaId: turmaAbertaId }))}`)
    .then(r => r.json())
    .then(() => Promise.all([carregarVinculos(), carregarTurmas()]))
    .then(() => { renderAlunosNaTurma(); filtrarAlunosDisponiveis(); });
}
function removerDaTurma(vincId) {
  fetch(`${apiUrlMT}DMATRICULAS_TURMAS.php?jsn=${encodeURIComponent(JSON.stringify({ id: vincId }))}`)
    .then(r => r.json())
    .then(() => Promise.all([carregarVinculos(), carregarTurmas()]))
    .then(() => { renderAlunosNaTurma(); filtrarAlunosDisponiveis(); });
}

window.onload = () => {
  Promise.all([carregarProfessores(), carregarMatriculas(), carregarVinculos()]).then(carregarTurmas);
};