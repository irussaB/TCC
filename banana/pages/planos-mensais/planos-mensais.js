const apiPlanos = 'http://localhost/banana/api/PLANOSMENSAL/';
const apiCat = 'http://localhost/banana/api/CATEGORIAS/';
const apiEx = 'http://localhost/banana/api/EXERCICIOS/';

let planos = [], categorias = [], exercicios = [], exerciciosPlanos = [];
let planoEditandoId = null;
let campoAtual = null, filtroSelEx = 'todas';
let exerciciosTemp = { 1: [], 2: [], 3: [] };

function carregarTudo() {
  return Promise.all([
    fetch(`${apiPlanos}SPLANOSMENSAL.php`).then(r => r.json()),
    fetch(`${apiCat}SCATEGORIAS.php`).then(r => r.json()),
    fetch(`${apiEx}SEXERCICIOS.php`).then(r => r.json()),
    fetch(`${apiPlanos}SEXPLANOSMENSAL.php`).then(r => r.json())
  ]).then(([p, c, e, ep]) => {
    planos = p; categorias = c; exercicios = e; exerciciosPlanos = ep;
    renderPlanos();
  });
}

function renderPlanos() {
  const cont = document.getElementById('lista-planos');
  const vazio = document.getElementById('vazio-planos');
  if (!planos.length) { cont.innerHTML = ''; vazio.style.display = 'block'; return; }
  vazio.style.display = 'none';

  cont.innerHTML = planos.map(p => `
    <div class="plano-card">
      <div style="flex:1">
        <h4>${p.nome}</h4>
        <p style="font-size:12px;color:var(--texto-mudo);">${p.observacoes || 'Sem observações'}</p>
      </div>
      <button class="btn-detalhes" onclick="editarPlano(${p.id})"><i class="ti ti-pencil"></i></button>
      <button class="btn-recusar" onclick="excluirPlano(${p.id})"><i class="ti ti-trash"></i></button>
    </div>
  `).join('');
}

function editarPlano(id) {
  const p = planos.find(x => x.id === id);
  if (!p) return;
  planoEditandoId = id;
  document.getElementById('plano-nome').value = p.nome;
  document.getElementById('plano-obs').value = p.observacoes || '';
  exerciciosTemp = { 1: [], 2: [], 3: [] };

  exerciciosPlanos.filter(ep => ep.plano_mensal_id === id).forEach(ep => {
    const ex = exercicios.find(e => e.id === ep.exercicio_id);
    if (ex) exerciciosTemp[ep.campo].push(ex);
  });
  renderCamposExercicios();

  document.getElementById('form-plano-titulo').textContent = 'Editar plano mensal';
  document.getElementById('btn-plano').innerHTML = '<i class="ti ti-device-floppy" style="margin-right:6px"></i> Salvar alterações';
  document.getElementById('btn-cancelar-plano').style.display = 'block';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function excluirPlano(id) {
  if (!confirm('Apagar este plano?')) return;
  fetch(`${apiPlanos}DPLANOSMENSAL.php?jsn=${encodeURIComponent(JSON.stringify({ id }))}`)
    .then(r => r.json()).then(() => carregarTudo());
}

function salvarPlano() {
  const nome = document.getElementById('plano-nome').value.trim();
  const observacoes = document.getElementById('plano-obs').value.trim();
  if (!nome) { alert('Preencha o nome do plano.'); return; }

  const metodo = planoEditandoId ? 'U' : 'I';
  const payload = planoEditandoId
    ? { id: planoEditandoId, nome, observacoes }
    : { nome, observacoes };

  fetch(`${apiPlanos}${metodo}PLANOSMENSAL.php?jsn=${encodeURIComponent(JSON.stringify(payload))}`)
    .then(r => r.json())
    .then(res => {
      const planoId = planoEditandoId || res.id;
      // Limpa exercícios antigos
      const promises = exerciciosPlanos
        .filter(ep => ep.plano_mensal_id === planoId)
        .map(ep => fetch(`${apiPlanos}DEXPLANOSMENSAL.php?jsn=${encodeURIComponent(JSON.stringify({ id: ep.id }))}`));

      return Promise.all(promises).then(() => planoId);
    })
    .then(planoId => {
      const inserts = [];
      [1, 2, 3].forEach(campo => {
        exerciciosTemp[campo].forEach(ex => {
          inserts.push(fetch(`${apiPlanos}IEXPLANOSMENSAL.php?jsn=${encodeURIComponent(JSON.stringify({
            plano_mensal_id: planoId, exercicio_id: ex.id, campo
          }))}`));
        });
      });
      return Promise.all(inserts);
    })
    .then(() => {
      cancelarEdicao();
      carregarTudo();
      toast('Plano salvo!', 'sucesso');
    });
}

function cancelarEdicao() {
  planoEditandoId = null;
  exerciciosTemp = { 1: [], 2: [], 3: [] };
  document.getElementById('plano-nome').value = '';
  document.getElementById('plano-obs').value = '';
  renderCamposExercicios();
  document.getElementById('form-plano-titulo').textContent = 'Novo plano mensal';
  document.getElementById('btn-plano').innerHTML = '<i class="ti ti-device-floppy" style="margin-right:6px"></i> Salvar plano';
  document.getElementById('btn-cancelar-plano').style.display = 'none';
}

function renderCamposExercicios() {
  [1, 2, 3].forEach(campo => {
    const cont = document.getElementById(`lista-campo-${campo}`);
    cont.innerHTML = exerciciosTemp[campo].map(ex => `
      <span class="badge badge-laranja" style="padding:6px 12px;display:inline-flex;gap:6px;align-items:center;">
        ${ex.nome}
        <i class="ti ti-x" style="cursor:pointer" onclick="removerExercicioCampo(${campo}, ${ex.id})"></i>
      </span>
    `).join('') || '<span style="color:var(--texto-mudo);font-size:12px;">Nenhum exercício</span>';
  });
}

function removerExercicioCampo(campo, exId) {
  exerciciosTemp[campo] = exerciciosTemp[campo].filter(e => e.id !== exId);
  renderCamposExercicios();
}

// ── SELEÇÃO DE EXERCÍCIOS ──
function abrirSelecaoExercicios(campo) {
  campoAtual = campo;
  filtroSelEx = 'todas';
  document.getElementById('filtros-sel-ex').innerHTML = categorias.map(c =>
    `<button class="chip" onclick="filtrarSelEx(${c.id}, this)">${c.nome}</button>`
  ).join('');
  renderSelEx();
  document.getElementById('modal-exercicios').classList.add('aberto');
}

function renderSelEx() {
  const usados = new Set();
  [1, 2, 3].forEach(c => exerciciosTemp[c].forEach(e => usados.add(e.id)));

  const filtrados = exercicios.filter(e => {
    const okCat = filtroSelEx === 'todas' || e.categoria_id == filtroSelEx;
    const naoUsado = !usados.has(e.id);
    return okCat && naoUsado;
  });

  const cont = document.getElementById('lista-sel-ex');
  cont.innerHTML = filtrados.map(e => `
    <div class="exercicio-selecao-item">
      <span>${e.nome} <span style="color:var(--texto-mudo);font-size:11px;">(${e.categoriaNome})</span></span>
      <button class="btn-aceitar" onclick="adicionarExercicioCampo(${e.id})"><i class="ti ti-plus"></i> Adicionar</button>
    </div>
  `).join('') || '<p style="color:var(--texto-mudo);font-size:13px;">Nenhum exercício disponível.</p>';
}

function filtrarSelEx(id, btn) {
  filtroSelEx = id;
  document.querySelectorAll('#modal-exercicios .chip').forEach(b => b.classList.remove('selecionado'));
  if (btn) btn.classList.add('selecionado');
  renderSelEx();
}

function adicionarExercicioCampo(exId) {
  const ex = exercicios.find(e => e.id === exId);
  if (ex) exerciciosTemp[campoAtual].push(ex);
  renderCamposExercicios();
  renderSelEx();
}

function fecharSelecaoExercicios(e) { if (e.target.id === 'modal-exercicios') fecharSelecaoExerciciosBtn(); }
function fecharSelecaoExerciciosBtn() { document.getElementById('modal-exercicios').classList.remove('aberto'); }

window.onload = carregarTudo;