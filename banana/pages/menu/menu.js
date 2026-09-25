const apiUrlAlunos = 'http://localhost/banana/api/ALUNOS/';
const apiUrlProfessores = 'http://localhost/banana/api/PROFESSORES/';
const apiUrlTurmas = 'http://localhost/banana/api/TURMAS/';
const apiUrlMatriculas = 'http://localhost/banana/api/MATRICULAS/';

let alunos = [];
let professores = [];
let turmas = [];
let tipoListaAtual = null;

function carregarResumo() {
  Promise.all([
    fetch(`${apiUrlAlunos}SALUNOS.php`).then(r => r.json()).catch(() => []),
    fetch(`${apiUrlProfessores}SPROFESSORES.php`).then(r => r.json()).catch(() => []),
    fetch(`${apiUrlTurmas}STURMAS.php`).then(r => r.json()).catch(() => []),
    fetch(`${apiUrlMatriculas}SMATRICULAS.php`).then(r => r.json()).catch(() => []),
  ]).then(([a, p, t, m]) => {
    alunos = a;
    professores = p;
    turmas = t;
    document.getElementById('stat-alunos').textContent = m.filter(x => x.status === 'aprovada').length;
    document.getElementById('stat-professores').textContent = p.length;
    document.getElementById('stat-turmas').textContent = t.length;
    document.getElementById('stat-pendentes').textContent = m.filter(x => x.status === 'pendente').length;
  });
}

function abrirLista(tipo) {
  tipoListaAtual = tipo;
  const titulos = {
    alunos: 'Alunos ativos',
    turmas: 'Turmas cadastradas',
    professores: 'Professores'
  };
  document.getElementById('modal-lista-titulo').textContent = titulos[tipo] || 'Lista';
  document.getElementById('busca-lista').value = '';
  renderListaModal();
  document.getElementById('modal-lista').classList.add('aberto');
}

function renderListaModal() {
  const termo = document.getElementById('busca-lista').value.toLowerCase();
  const cont = document.getElementById('lista-modal');

  let arr = [];
  if (tipoListaAtual === 'alunos') {
    arr = alunos
      .filter(x => (x.nome || '').toLowerCase().includes(termo))
      .sort((a, b) => (a.nome || '').localeCompare(b.nome || ''));
  } else if (tipoListaAtual === 'turmas') {
    arr = turmas
      .filter(x => (x.nome || '').toLowerCase().includes(termo))
      .sort((a, b) => (a.nome || '').localeCompare(b.nome || ''));
  } else if (tipoListaAtual === 'professores') {
    arr = professores
      .filter(x => (x.nome || '').toLowerCase().includes(termo))
      .sort((a, b) => (a.nome || '').localeCompare(b.nome || ''));
  }

  if (!arr.length) {
    cont.innerHTML = '<p style="color:var(--texto-mudo);text-align:center;padding:20px;">Nenhum registro encontrado.</p>';
    return;
  }

  cont.innerHTML = arr.map(x => {
    // ── ALUNOS ──
    if (tipoListaAtual === 'alunos') {
      const ini = iniciais(x.nome);
      const idade = x.datanasc ? calcularIdade(x.datanasc) + ' anos' : '';
      const sexo = x.sexo === 'F' ? 'Feminino' : x.sexo === 'M' ? 'Masculino' : '';
      return `
        <div style="display:flex;align-items:center;gap:12px;padding:10px;background:var(--bg-input);border:1px solid var(--borda);border-radius:10px;cursor:pointer;" onclick="abrirPerfilAluno(${x.id})">
          <div class="aluno-avatar">${ini}</div>
          <div style="flex:1;">
            <div style="font-weight:600;">${x.nome}</div>
            <div style="font-size:12px;color:var(--texto-mudo);">${idade} · ${sexo}</div>
          </div>
          <i class="ti ti-chevron-right" style="color:var(--texto-fraco)"></i>
        </div>`;
    }

    // ── TURMAS ──
    if (tipoListaAtual === 'turmas') {
      const ini = iniciais(x.nome);
      return `
        <div style="display:flex;align-items:center;gap:12px;padding:10px;background:var(--bg-input);border:1px solid var(--borda);border-radius:10px;cursor:pointer;" onclick="abrirTurma(${x.id})">
          <div class="aluno-avatar" style="background:var(--azul-dim);color:var(--azul);">
            <i class="ti ti-ball-basketball"></i>
          </div>
          <div style="flex:1;">
            <div style="font-weight:600;">${x.nome}</div>
            <div style="font-size:12px;color:var(--texto-mudo);">Prof. ${x.professorNome || '—'} · ${x.totalAlunos} alunos</div>
          </div>
          <i class="ti ti-chevron-right" style="color:var(--texto-fraco)"></i>
        </div>`;
    }

    // ── PROFESSORES ──
    const ini = iniciais(x.nome);
    return `
      <div style="display:flex;align-items:center;gap:12px;padding:10px;background:var(--bg-input);border:1px solid var(--borda);border-radius:10px;cursor:pointer;" onclick="abrirPerfilProfessor(${x.id})">
        <div class="aluno-avatar">${ini}</div>
        <div style="flex:1;">
          <div style="font-weight:600;">${x.nome}</div>
          <div style="font-size:12px;color:var(--texto-mudo);">${x.email || ''}</div>
        </div>
        <i class="ti ti-chevron-right" style="color:var(--texto-fraco)"></i>
      </div>`;
  }).join('');
}

function abrirPerfilAluno(id) {
  window.location.href = `../perfil-aluno/index.html?id=${id}`;
}
function abrirPerfilProfessor(id) {
  window.location.href = `../perfil-professor/index.html?id=${id}`;
}
function abrirTurma(id) {
  window.location.href = `../turmas/index.html?turma=${id}`;
}

function fecharModalLista(e) { if (e.target.id === 'modal-lista') fecharModalListaBtn(); }
function fecharModalListaBtn() { document.getElementById('modal-lista').classList.remove('aberto'); }

window.onload = carregarResumo;