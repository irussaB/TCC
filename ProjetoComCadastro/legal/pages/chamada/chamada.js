const apiUrlTurmas = 'http://localhost/legal/api/TURMAS/';
const apiUrlMatriculas = 'http://localhost/legal/api/MATRICULAS/';
const apiUrlChamadas = 'http://localhost/legal/api/CHAMADAS/';

let turmas = [];
let matriculas = [];
let chamadas = [];
let turmaAtualId = null;
let statusAlunos = {}; // matid -> status

function iniciais(nome) {
  const partes = (nome || '?').split(' ');
  return (partes[0][0] + (partes[1] ? partes[1][0] : '')).toUpperCase();
}

function carregarTudo() {
  return Promise.all([
    fetch(`${apiUrlTurmas}STURMAS.php`).then(r => r.json()),
    fetch(`${apiUrlMatriculas}SMATRICULAS.php`).then(r => r.json()),
    fetch(`${apiUrlChamadas}SCHAMADAS.php`).then(r => r.json()),
  ]).then(([t, m, c]) => {
    turmas = t; matriculas = m; chamadas = c;
    renderChipsTurma();
    renderLista();
    renderHistorico();
  });
}

function renderChipsTurma() {
  const cont = document.getElementById('chips-turma');
  if (!turmaAtualId && turmas.length) turmaAtualId = turmas[0].id;
  cont.innerHTML = turmas.map(t => `
    <div class="chip ${t.id == turmaAtualId ? 'selecionado' : ''}" onclick="selecionarTurma(${t.id})">${t.nome}</div>
  `).join('') || '<p style="color:var(--texto-mudo);font-size:13px;">Cadastre uma turma na página Turmas primeiro.</p>';
}

function selecionarTurma(id) {
  turmaAtualId = id;
  renderChipsTurma();
  renderLista();
}

function alunosDaTurma() {
  return matriculas.filter(m => m.status === 'aprovada' && m.turid == turmaAtualId);
}

function renderLista() {
  const cont = document.getElementById('lista-alunos');
  const alunos = alunosDaTurma();
  statusAlunos = {};
  alunos.forEach(m => statusAlunos[m.id] = 'presente');

  cont.innerHTML = alunos.map(m => `
    <div class="aluno-linha">
      <div class="aluno-avatar">${iniciais(m.nome)}</div>
      <div class="aluno-nome">${m.nome}</div>
      <div class="status-btns">
        <button class="status-btn presente ativo" onclick="marcarStatus(${m.id}, 'presente', this)" title="Presente"><i class="ti ti-check"></i></button>
        <button class="status-btn justificada" onclick="marcarStatus(${m.id}, 'justificada', this)" title="Falta justificada"><i class="ti ti-note"></i></button>
        <button class="status-btn falta" onclick="marcarStatus(${m.id}, 'falta', this)" title="Falta"><i class="ti ti-x"></i></button>
      </div>
    </div>
  `).join('') || '<p style="color:var(--texto-mudo);font-size:13px;">Nenhum aluno aprovado nesta turma ainda.</p>';

  atualizarResumo();
}

function marcarStatus(matid, status, btn) {
  statusAlunos[matid] = status;
  const linha = btn.closest('.aluno-linha');
  linha.querySelectorAll('.status-btn').forEach(b => b.classList.remove('ativo'));
  btn.classList.add('ativo');
  atualizarResumo();
}

function marcarTodos(status) {
  Object.keys(statusAlunos).forEach(id => statusAlunos[id] = status);
  document.querySelectorAll('.aluno-linha').forEach(linha => {
    linha.querySelectorAll('.status-btn').forEach(b => b.classList.remove('ativo'));
    const btn = linha.querySelector('.status-btn.' + status);
    if (btn) btn.classList.add('ativo');
  });
  atualizarResumo();
}

function atualizarResumo() {
  const valores = Object.values(statusAlunos);
  const total = valores.length;
  const presentes = valores.filter(s => s === 'presente' || s === 'justificada').length;
  const faltas = total - presentes;
  const pct = total ? Math.round((presentes / total) * 100) : 0;

  document.getElementById('resumo-total').textContent = total;
  document.getElementById('resumo-presentes').textContent = presentes;
  document.getElementById('resumo-faltas').textContent = faltas;
  document.getElementById('resumo-pct').textContent = pct + '%';
}

function salvarChamada() {
  const data = document.getElementById('data-treino').value;
  if (!data) { alert('Selecione a data do treino antes de salvar.'); return; }
  if (Object.keys(statusAlunos).length === 0) { alert('Não há alunos nesta turma para registrar chamada.'); return; }

  const chamadasParaSalvar = Object.entries(statusAlunos).map(([matid, status]) =>
    fetch(`${apiUrlChamadas}ICHAMADAS.php?jsn=${encodeURIComponent(JSON.stringify({ matid: Number(matid), data, status }))}`)
  );

  Promise.all(chamadasParaSalvar)
    .then(() => fetch(`${apiUrlChamadas}SCHAMADAS.php`))
    .then(r => r.json())
    .then(data2 => { chamadas = data2; renderHistorico(); alert('Chamada salva com sucesso!'); });
}

function formatarData(iso) {
  if (!iso) return '—';
  const [ano, mes, dia] = iso.split('-');
  return `${dia}/${mes}/${ano}`;
}

function renderHistorico() {
  const cont = document.getElementById('historico');
  const grupos = {};
  chamadas.forEach(c => {
    const chave = c.data + '|' + (c.turmaNome || '');
    if (!grupos[chave]) grupos[chave] = { data: c.data, turma: c.turmaNome, itens: [] };
    grupos[chave].itens.push(c);
  });

  const lista = Object.values(grupos);
  if (lista.length === 0) {
    cont.innerHTML = '<div class="vazio"><i class="ti ti-clipboard-off"></i> Nenhuma chamada salva ainda.</div>';
    return;
  }

  cont.innerHTML = lista.map((g, i) => {
    const presentes = g.itens.filter(x => x.status === 'presente' || x.status === 'justificada').length;
    const faltas = g.itens.filter(x => x.status === 'falta').length;
    const justificadas = g.itens.filter(x => x.status === 'justificada').length;
    return `
      <div class="hist-item">
        <div class="hist-data">${formatarData(g.data)}</div>
        <div class="hist-turma">${g.turma || '—'}</div>
        <div class="hist-stats">
          <span class="ok"><i class="ti ti-check"></i> ${presentes}</span>
          <span class="no"><i class="ti ti-x"></i> ${faltas}</span>
          ${justificadas ? `<span class="just"><i class="ti ti-note"></i> ${justificadas}</span>` : ''}
        </div>
        <button class="btn-detalhes" onclick='abrirModalHist(${JSON.stringify(g).replace(/'/g, "&#39;")})'><i class="ti ti-eye"></i> Ver</button>
      </div>`;
  }).join('');
}

function abrirModalHist(grupo) {
  document.getElementById('hist-titulo').textContent = `${grupo.turma || '—'} · ${formatarData(grupo.data)}`;
  const labels = { presente: 'Presente', falta: 'Falta', justificada: 'Falta justificada' };
  document.getElementById('hist-lista').innerHTML = grupo.itens.map(item => `
    <div class="aluno-disponivel-linha" style="display:flex;justify-content:space-between;padding:8px 10px;background:var(--bg-input);border:1px solid var(--borda);border-radius:8px;font-size:13px;">
      <span>${item.alunoNome}</span>
      <span class="badge badge-${item.status === 'presente' ? 'verde' : item.status === 'falta' ? 'vermelho' : 'azul'}">${labels[item.status] || item.status}</span>
    </div>
  `).join('');
  document.getElementById('modal-hist-detalhe').classList.add('aberto');
}
function fecharModalHist(e) { if (e.target.id === 'modal-hist-detalhe') fecharModalHistBtn(); }
function fecharModalHistBtn() { document.getElementById('modal-hist-detalhe').classList.remove('aberto'); }

document.getElementById('data-treino').valueAsDate = new Date();
window.onload = carregarTudo;
