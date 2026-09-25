const apiPD = 'http://localhost/banana/api/PLANOSDIARIOS/';
const apiPM = 'http://localhost/banana/api/PLANOSMENSAL/';
const apiTurmas = 'http://localhost/banana/api/TURMAS/';
const apiCat = 'http://localhost/banana/api/CATEGORIAS/';
const apiEx = 'http://localhost/banana/api/EXERCICIOS/';

let planosDiarios = [], planosMensais = [], turmas = [], categorias = [], exercicios = [], exPD = [];
let pdEditandoId = null;
let exerciciosTemp = [];
let filtroSel = 'todas';

function carregarTudo() {
  return Promise.all([
    fetch(`${apiPD}SPLANOSDIARIOS.php`).then(r => r.json()),
    fetch(`${apiPM}SPLANOSMENSAL.php`).then(r => r.json()),
    fetch(`${apiTurmas}STURMAS.php`).then(r => r.json()),
    fetch(`${apiCat}SCATEGORIAS.php`).then(r => r.json()),
    fetch(`${apiEx}SEXERCICIOS.php`).then(r => r.json()),
    fetch(`${apiPD}SEXPLANOSDIARIOS.php`).then(r => r.json())
  ]).then(([pd, pm, t, c, e, ep]) => {
    planosDiarios = pd; planosMensais = pm; turmas = t;
    categorias = c; exercicios = e; exPD = ep;

    document.getElementById('pd-turma').innerHTML = '<option value="">Selecione</option>' +
      turmas.map(x => `<option value="${x.id}">${x.nome}</option>`).join('');
    document.getElementById('pd-plano-mensal').innerHTML = '<option value="">Selecione</option>' +
      planosMensais.map(x => `<option value="${x.id}">${x.nome}</option>`).join('');

    renderLista();
  });
}

function renderLista() {
  const cont = document.getElementById('lista-pd');
  const vazio = document.getElementById('vazio-pd');
  if (!planosDiarios.length) { cont.innerHTML = ''; vazio.style.display = 'block'; return; }
  vazio.style.display = 'none';

  cont.innerHTML = planosDiarios.map(p => `
    <div class="plano-card">
      <div style="flex:1">
        <h4>${p.turmaNome} — ${formatarData(p.data)}</h4>
        <p style="font-size:12px;color:var(--texto-mudo);">${p.planoNome} ${p.observacao ? '· ' + p.observacao : ''}</p>
      </div>
      <button class="btn-detalhes" onclick="editar(${p.id})"><i class="ti ti-pencil"></i></button>
      <button class="btn-recusar" onclick="excluir(${p.id})"><i class="ti ti-trash"></i></button>
    </div>
  `).join('');
}

function editar(id) {
  const p = planosDiarios.find(x => x.id === id);
  if (!p) return;
  pdEditandoId = id;
  document.getElementById('pd-data').value = p.data;
  document.getElementById('pd-turma').value = p.turma_id;
  document.getElementById('pd-plano-mensal').value = p.plano_mensal_id;
  document.getElementById('pd-obs').value = p.observacao || '';
  exerciciosTemp = [];
  exPD.filter(x => x.plano_diario_id === id).forEach(x => {
    const ex = exercicios.find(e => e.id === x.exercicio_id);
    if (ex) exerciciosTemp.push(ex);
  });
  renderCampos();
  document.getElementById('form-pd-titulo').textContent = 'Editar plano diário';
  document.getElementById('btn-cancelar-pd').style.display = 'block';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function excluir(id) {
  if (!confirm('Apagar este plano diário?')) return;
  fetch(`${apiPD}DPLANOSDIARIOS.php?jsn=${encodeURIComponent(JSON.stringify({ id }))}`)
    .then(r => r.json()).then(() => carregarTudo());
}

function salvarPlanoDiario() {
  const data = document.getElementById('pd-data').value;
  const turma_id = document.getElementById('pd-turma').value;
  const plano_mensal_id = document.getElementById('pd-plano-mensal').value;
  const observacao = document.getElementById('pd-obs').value.trim();

  if (!data || !turma_id || !plano_mensal_id) { alert('Preencha todos os campos obrigatórios.'); return; }

  const metodo = pdEditandoId ? 'U' : 'I';
  const payload = pdEditandoId
    ? { id: pdEditandoId, plano_mensal_id, turma_id, data, observacao }
    : { plano_mensal_id, turma_id, data, observacao };

  fetch(`${apiPD}${metodo}PLANOSDIARIOS.php?jsn=${encodeURIComponent(JSON.stringify(payload))}`)
    .then(r => r.json())
    .then(res => {
      const pdId = pdEditandoId || res.id;
      const promises = exPD.filter(x => x.plano_diario_id === pdId)
        .map(x => fetch(`${apiPD}DEXPLANOSDIARIOS.php?jsn=${encodeURIComponent(JSON.stringify({ id: x.id }))}`));
      return Promise.all(promises).then(() => pdId);
    })
    .then(pdId => {
      const inserts = exerciciosTemp.map(ex =>
        fetch(`${apiPD}IEXPLANOSDIARIOS.php?jsn=${encodeURIComponent(JSON.stringify({ plano_diario_id: pdId, exercicio_id: ex.id }))}`)
      );
      return Promise.all(inserts);
    })
    .then(() => { cancelarEdicao(); carregarTudo(); toast('Plano diário salvo!', 'sucesso'); });
}

function cancelarEdicao() {
  pdEditandoId = null;
  exerciciosTemp = [];
  document.getElementById('pd-data').value = '';
  document.getElementById('pd-turma').value = '';
  document.getElementById('pd-plano-mensal').value = '';
  document.getElementById('pd-obs').value = '';
  renderCampos();
  document.getElementById('form-pd-titulo').textContent = 'Novo plano diário';
  document.getElementById('btn-cancelar-pd').style.display = 'none';
}

function renderCampos() {
  const cont = document.getElementById('lista-ex-pd');
  cont.innerHTML = exerciciosTemp.map(ex => `
    <span class="badge badge-laranja" style="padding:6px 12px;display:inline-flex;gap:6px;align-items:center;">
      ${ex.nome}
      <i class="ti ti-x" style="cursor:pointer" onclick="removerEx(${ex.id})"></i>
    </span>
  `).join('') || '<span style="color:var(--texto-mudo);font-size:12px;">Nenhum exercício</span>';
}

function removerEx(id) {
  exerciciosTemp = exerciciosTemp.filter(e => e.id !== id);
  renderCampos();
}

function abrirSelecao() {
  filtroSel = 'todas';
  document.getElementById('filtros-sel').innerHTML = categorias.map(c =>
    `<button class="chip" onclick="filtrarSel(${c.id}, this)">${c.nome}</button>`
  ).join('');
  renderSel();
  document.getElementById('modal-exercicios').classList.add('aberto');
}

function renderSel() {
  const usados = new Set(exerciciosTemp.map(e => e.id));
  const filtrados = exercicios.filter(e => {
    const okCat = filtroSel === 'todas' || e.categoria_id == filtroSel;
    return okCat && !usados.has(e.id);
  });
  document.getElementById('lista-sel').innerHTML = filtrados.map(e => `
    <div class="exercicio-selecao-item">
      <span>${e.nome} <span style="color:var(--texto-mudo);font-size:11px;">(${e.categoriaNome})</span></span>
      <button class="btn-aceitar" onclick="adicionar(${e.id})"><i class="ti ti-plus"></i> Adicionar</button>
    </div>
  `).join('') || '<p style="color:var(--texto-mudo);font-size:13px;">Nenhum exercício disponível.</p>';
}

function filtrarSel(id, btn) {
  filtroSel = id;
  document.querySelectorAll('#modal-exercicios .chip').forEach(b => b.classList.remove('selecionado'));
  if (btn) btn.classList.add('selecionado');
  renderSel();
}

function adicionar(id) {
  const ex = exercicios.find(e => e.id === id);
  if (ex) exerciciosTemp.push(ex);
  renderCampos();
  renderSel();
}

function fecharSelecao(e) { if (e.target.id === 'modal-exercicios') fecharSelecaoBtn(); }
function fecharSelecaoBtn() { document.getElementById('modal-exercicios').classList.remove('aberto'); }

window.onload = carregarTudo;