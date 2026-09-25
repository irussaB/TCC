const apiCat = 'http://localhost/banana/api/CATEGORIAS/';
const apiEx = 'http://localhost/banana/api/EXERCICIOS/';

let categorias = [], exercicios = [];
let catEditandoId = null, exEditandoId = null;
let modoCat = null, modoEx = null;
let filtroEx = 'todas';

function carregarTudo() {
  return Promise.all([
    fetch(`${apiCat}SCATEGORIAS.php`).then(r => r.json()),
    fetch(`${apiEx}SEXERCICIOS.php`).then(r => r.json())
  ]).then(([c, e]) => {
    categorias = c; exercicios = e;
    renderCategorias(); renderFiltrosCategorias(); renderExercicios(); preencherSelectCategoria();
  });
}

function preencherSelectCategoria() {
  const sel = document.getElementById('ex-categoria');
  sel.innerHTML = '<option value="">Selecione</option>' +
    categorias.map(c => `<option value="${c.id}">${c.nome}</option>`).join('');
}

function renderCategorias() {
  const cont = document.getElementById('categorias-lista');
  cont.innerHTML = categorias.map(c => `
    <button class="categoria-chip ${modoCat === 'editar' ? 'modo-editar' : modoCat === 'excluir' ? 'modo-excluir' : ''}"
      onclick="clicarCategoria(${c.id})">${c.nome}</button>
  `).join('') || '<p style="color:var(--texto-mudo);font-size:13px;">Nenhuma categoria criada.</p>';
}

function renderFiltrosCategorias() {
  const cont = document.getElementById('filtros-categorias');
  cont.innerHTML = categorias.map(c => `
    <button class="chip" onclick="filtrarExercicios(${c.id}, this)">${c.nome}</button>
  `).join('');
}

function renderExercicios() {
  const cont = document.getElementById('exercicios-grid');
  const vazio = document.getElementById('vazio-ex');
  const filtrados = exercicios.filter(e => filtroEx === 'todas' || e.categoria_id == filtroEx);
  if (!filtrados.length) { cont.innerHTML = ''; vazio.style.display = 'block'; return; }
  vazio.style.display = 'none';

  cont.innerHTML = filtrados.map(e => `
    <div class="exercicio-card ${modoEx === 'editar' ? 'modo-editar' : modoEx === 'excluir' ? 'modo-excluir' : ''}"
      onclick="clicarExercicio(${e.id})">
      <h4>${e.nome}</h4>
      <p>${e.descricao}</p>
      <span class="badge badge-laranja">${e.categoriaNome}</span>
    </div>
  `).join('');
}

// ── CATEGORIAS ──
function salvarCategoria() {
  const nome = document.getElementById('cat-nome').value.trim();
  if (!nome) { alert('Preencha o nome.'); return; }

  if (catEditandoId) {
    fetch(`${apiCat}UCATEGORIAS.php?jsn=${encodeURIComponent(JSON.stringify({ id: catEditandoId, nome }))}`)
      .then(r => r.json()).then(() => { cancelarEdicaoCategoria(); carregarTudo(); });
  } else {
    if (categorias.find(c => c.nome.toLowerCase() === nome.toLowerCase())) {
      alert('Já existe uma categoria com esse nome.'); return;
    }
    fetch(`${apiCat}ICATEGORIAS.php?jsn=${encodeURIComponent(JSON.stringify({ nome }))}`)
      .then(r => r.json()).then(() => { document.getElementById('cat-nome').value = ''; carregarTudo(); });
  }
}

function cancelarEdicaoCategoria() {
  catEditandoId = null;
  document.getElementById('cat-nome').value = '';
  document.getElementById('form-cat-titulo').textContent = 'Nova categoria';
  document.getElementById('btn-cat').innerHTML = '<i class="ti ti-plus" style="margin-right:6px"></i> Criar categoria';
  document.getElementById('btn-cancelar-cat').style.display = 'none';
}

function modoEditarCategoria() {
  modoCat = modoCat === 'editar' ? null : 'editar';
  renderCategorias();
}
function modoExcluirCategoria() {
  modoCat = modoCat === 'excluir' ? null : 'excluir';
  renderCategorias();
}

function clicarCategoria(id) {
  if (modoCat === 'editar') {
    const c = categorias.find(x => x.id === id);
    catEditandoId = id;
    document.getElementById('cat-nome').value = c.nome;
    document.getElementById('form-cat-titulo').textContent = 'Editar categoria';
    document.getElementById('btn-cat').innerHTML = '<i class="ti ti-device-floppy" style="margin-right:6px"></i> Salvar categoria';
    document.getElementById('btn-cancelar-cat').style.display = 'block';
    modoCat = null;
    renderCategorias();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else if (modoCat === 'excluir') {
    if (!confirm('Apagar esta categoria?')) { modoCat = null; renderCategorias(); return; }
    fetch(`${apiCat}DCATEGORIAS.php?jsn=${encodeURIComponent(JSON.stringify({ id }))}`)
      .then(r => r.json())
      .then(res => {
        if (res.erro) { alert(res.erro); modoCat = null; renderCategorias(); return; }
        modoCat = null;
        carregarTudo();
      });
  }
}

// ── EXERCÍCIOS ──
function salvarExercicio() {
  const nome = document.getElementById('ex-nome').value.trim();
  const descricao = document.getElementById('ex-descricao').value.trim();
  const categoria_id = document.getElementById('ex-categoria').value;
  if (!nome || !descricao || !categoria_id) { alert('Preencha todos os campos.'); return; }

  if (exEditandoId) {
    fetch(`${apiEx}UEXERCICIOS.php?jsn=${encodeURIComponent(JSON.stringify({ id: exEditandoId, nome, descricao, categoria_id }))}`)
      .then(r => r.json()).then(() => { cancelarEdicaoExercicio(); carregarTudo(); });
  } else {
    if (exercicios.find(e => e.nome.toLowerCase() === nome.toLowerCase())) {
      alert('Já existe um exercício com esse nome.'); return;
    }
    fetch(`${apiEx}IEXERCICIOS.php?jsn=${encodeURIComponent(JSON.stringify({ nome, descricao, categoria_id }))}`)
      .then(r => r.json()).then(() => {
        document.getElementById('ex-nome').value = '';
        document.getElementById('ex-descricao').value = '';
        document.getElementById('ex-categoria').value = '';
        carregarTudo();
      });
  }
}

function cancelarEdicaoExercicio() {
  exEditandoId = null;
  document.getElementById('ex-nome').value = '';
  document.getElementById('ex-descricao').value = '';
  document.getElementById('ex-categoria').value = '';
  document.getElementById('form-ex-titulo').textContent = 'Novo exercício';
  document.getElementById('btn-ex').innerHTML = '<i class="ti ti-plus" style="margin-right:6px"></i> Criar exercício';
  document.getElementById('btn-cancelar-ex').style.display = 'none';
}

function modoEditarExercicio() { modoEx = modoEx === 'editar' ? null : 'editar'; renderExercicios(); }
function modoExcluirExercicio() { modoEx = modoEx === 'excluir' ? null : 'excluir'; renderExercicios(); }

function clicarExercicio(id) {
  if (modoEx === 'editar') {
    const e = exercicios.find(x => x.id === id);
    exEditandoId = id;
    document.getElementById('ex-nome').value = e.nome;
    document.getElementById('ex-descricao').value = e.descricao;
    document.getElementById('ex-categoria').value = e.categoria_id;
    document.getElementById('form-ex-titulo').textContent = 'Editar exercício';
    document.getElementById('btn-ex').innerHTML = '<i class="ti ti-device-floppy" style="margin-right:6px"></i> Salvar exercício';
    document.getElementById('btn-cancelar-ex').style.display = 'block';
    modoEx = null;
    renderExercicios();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else if (modoEx === 'excluir') {
    if (!confirm('Apagar este exercício?')) { modoEx = null; renderExercicios(); return; }
    fetch(`${apiEx}DEXERCICIOS.php?jsn=${encodeURIComponent(JSON.stringify({ id }))}`)
      .then(r => r.json()).then(() => { modoEx = null; carregarTudo(); });
  }
}

function filtrarExercicios(id, btn) {
  filtroEx = id;
  document.querySelectorAll('#filtros-categorias .chip, .chip[onclick*="filtrarExercicios(\'todas\'"]').forEach(b => b.classList.remove('selecionado'));
  if (btn) btn.classList.add('selecionado');
  renderExercicios();
}

window.onload = carregarTudo;