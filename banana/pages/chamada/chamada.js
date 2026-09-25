const apiUrlTurmas = 'http://localhost/banana/api/TURMAS/';
const apiUrlChamadas = 'http://localhost/banana/api/CHAMADAS/';
const apiUrlMT = 'http://localhost/banana/api/MATRICULAS/';
const apiUrlPD = 'http://localhost/banana/api/PLANOSDIARIOS/';

let planosDiarios = [], vinculos = [], chamadas = [];
let planoAtual = null;
let turmaAtualId = null, dataAtual = null;
let statusAlunos = {};

function carregarTudo() {
  return Promise.all([
    fetch(`${apiUrlPD}SPLANOSDIARIOS.php`).then(r => r.json()),
    fetch(`${apiUrlMT}SMATRICULAS_TURMAS.php`).then(r => r.json()),
    fetch(`${apiUrlChamadas}SCHAMADAS.php`).then(r => r.json()),
  ]).then(([pd, v, c]) => {
    planosDiarios = pd; vinculos = v; chamadas = c;
    renderSelectPlanos();
    renderHistorico();
  });
}

function renderSelectPlanos() {
  const sel = document.getElementById('select-plano-diario');
  if (!planosDiarios.length) {
    sel.innerHTML = '<option value="">Nenhum plano diário cadastrado</option>';
    return;
  }
  sel.innerHTML = '<option value="">Selecione um plano diário</option>' +
    planosDiarios.map(p => `
      <option value="${p.id}">
        ${p.turmaNome} — ${formatarData(p.data)} — ${p.planoNome}
      </option>
    `).join('');
}

function selecionarPlanoDiario() {
  const id = document.getElementById('select-plano-diario').value;
  if (!id) {
    planoAtual = null;
    turmaAtualId = null;
    dataAtual = null;
    document.getElementById('card-info-plano').style.display = 'none';
    document.getElementById('card-resumo').style.display = 'none';
    return;
  }
  planoAtual = planosDiarios.find(p => p.id == id);
  if (!planoAtual) return;

  turmaAtualId = planoAtual.turma_id;
  dataAtual = planoAtual.data;

  document.getElementById('info-turma').textContent = planoAtual.turmaNome || '—';
  document.getElementById('info-data').textContent = formatarData(planoAtual.data);
  document.getElementById('card-info-plano').style.display = 'block';
  document.getElementById('card-resumo').style.display = 'block';

  renderLista();
  // Pré-carrega o que já está salvo para essa data/turma
  carregarChamadasSalvas();
}

// ── CARREGA O QUE JÁ FOI SALVO (para pré-marcar) ──
function carregarChamadasSalvas() {
  const salvas = chamadas.filter(c =>
    c.turid == turmaAtualId && c.data === dataAtual
  );
  salvas.forEach(c => { statusAlunos[c.matid] = c.status; });
  aplicarStatusNaTela();
}

function aplicarStatusNaTela() {
  document.querySelectorAll('.aluno-linha').forEach(linha => {
    const matid = linha.dataset.matid;
    if (!matid) return;
    const status = statusAlunos[matid];
    linha.querySelectorAll('.status-btn').forEach(b => b.classList.remove('ativo'));
    if (status) {
      const btn = linha.querySelector('.status-btn.' + status);
      if (btn) btn.classList.add('ativo');
    }
  });
  atualizarResumo();
}

function alunosDaTurma() {
  return vinculos.filter(v => v.turmaId == turmaAtualId && v.matriculaStatus === 'aprovada');
}

function renderLista() {
  const cont = document.getElementById('lista-alunos');
  const alunos = alunosDaTurma();
  statusAlunos = {};
  alunos.forEach(v => statusAlunos[v.matriculaId] = 'presente');

  cont.innerHTML = alunos.map(v => `
    <div class="aluno-linha" data-matid="${v.matriculaId}" style="display:flex;align-items:center;gap:12px;padding:12px 0;border-bottom:1px solid var(--borda);">
      <div class="aluno-avatar">${iniciais(v.alunoNome)}</div>
      <div style="flex:1;font-size:14px;">${v.alunoNome}</div>
      <div style="display:flex;gap:6px;">
        <button class="btn-aceitar status-btn presente ativo" onclick="marcarStatus(${v.matriculaId}, 'presente', this)"><i class="ti ti-check"></i></button>
        <button class="btn-detalhes status-btn justificada" onclick="marcarStatus(${v.matriculaId}, 'justificada', this)"><i class="ti ti-note"></i></button>
        <button class="btn-recusar status-btn falta" onclick="marcarStatus(${v.matriculaId}, 'falta', this)"><i class="ti ti-x"></i></button>
      </div>
    </div>
  `).join('') || '<p style="color:var(--texto-mudo);font-size:13px;">Nenhum aluno aprovado nesta turma.</p>';

  carregarChamadasSalvas();
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
  const presentes = valores.filter(s => s === 'presente').length;
  const faltas = valores.filter(s => s === 'falta').length;
  const justificadas = valores.filter(s => s === 'justificada').length;

  // Frequência = presentes + justificadas (justificada conta como presença para frequência)
  const frequencia = total ? Math.round(((presentes + justificadas) / total) * 100) : 0;

  document.getElementById('resumo-total').textContent = total;
  document.getElementById('resumo-presentes').textContent = presentes;
  document.getElementById('resumo-faltas').textContent = faltas;
  document.getElementById('resumo-justificadas').textContent = justificadas;
  document.getElementById('resumo-pct').textContent = frequencia + '%';
}

function salvarChamada() {
  if (!planoAtual) { alert('Selecione um plano diário primeiro.'); return; }
  if (Object.keys(statusAlunos).length === 0) { alert('Não há alunos nesta turma.'); return; }

  const promises = Object.entries(statusAlunos).map(([matid, status]) =>
    fetch(`${apiUrlChamadas}ICHAMADAS.php?jsn=${encodeURIComponent(JSON.stringify({
      matid: Number(matid),
      turid: turmaAtualId,
      plano_diario_id: planoAtual.id,
      data: dataAtual,
      status
    }))}`)
  );

  Promise.all(promises)
    .then(() => fetch(`${apiUrlChamadas}SCHAMADAS.php`))
    .then(r => r.json())
    .then(d => {
      chamadas = d;
      renderHistorico();
      toast('Chamada salva!', 'sucesso');
    });
}

function renderHistorico() {
  const cont = document.getElementById('historico');
  const filtroData = document.getElementById('filtro-data-historico').value;
  const grupos = {};
  chamadas.filter(c => !filtroData || c.data === filtroData).forEach(c => {
    const chave = c.data + '|' + (c.turmaNome || '');
    if (!grupos[chave]) grupos[chave] = { data: c.data, turma: c.turmaNome, itens: [] };
    grupos[chave].itens.push(c);
  });
  const lista = Object.values(grupos);
  if (!lista.length) {
    cont.innerHTML = '<div class="estado-vazio" style="display:block"><i class="ti ti-clipboard-off"></i><p>Nenhuma chamada salva.</p></div>';
    return;
  }
  cont.innerHTML = lista.map(g => {
    const presentes = g.itens.filter(x => x.status === 'presente').length;
    const faltas = g.itens.filter(x => x.status === 'falta').length;
    const justificadas = g.itens.filter(x => x.status === 'justificada').length;
    return `
      <div style="display:flex;align-items:center;gap:14px;padding:12px 0;border-bottom:1px solid var(--borda);font-size:13px;">
        <div style="font-weight:700;min-width:90px;">${formatarData(g.data)}</div>
        <div style="color:var(--texto-mudo);flex:1;">${g.turma || '—'}</div>
        <div style="display:flex;gap:10px;font-size:12px;">
          <span style="color:var(--verde)"><i class="ti ti-check"></i> ${presentes}</span>
          <span style="color:var(--roxo)"><i class="ti ti-note"></i> ${justificadas}</span>
          <span style="color:var(--vermelho)"><i class="ti ti-x"></i> ${faltas}</span>
        </div>
      </div>`;
  }).join('');
}

window.onload = carregarTudo;