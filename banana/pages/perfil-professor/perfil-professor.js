const apiProf = 'http://localhost/banana/api/PROFESSORES/';
const apiTurmas = 'http://localhost/banana/api/TURMAS/';

function getParam(name) { return new URLSearchParams(window.location.search).get(name); }

function carregar() {
  const id = getParam('id');
  if (!id) { document.getElementById('perfil-nome').textContent = 'Professor não encontrado'; return; }

  Promise.all([
    fetch(`${apiProf}SPROFESSORES.php`).then(r => r.json()),
    fetch(`${apiTurmas}STURMAS.php`).then(r => r.json())
  ]).then(([profs, turmas]) => {
    const p = profs.find(x => x.id == id);
    if (!p) { document.getElementById('perfil-nome').textContent = 'Professor não encontrado'; return; }

    document.getElementById('perfil-avatar').textContent = iniciais(p.nome);
    document.getElementById('perfil-nome').textContent = p.nome;
    document.getElementById('perfil-sub').textContent = `${p.email} · ${p.telefone}`;

    const minhas = turmas.filter(t => t.professor_id == id);
    document.getElementById('turmas-prof').innerHTML = minhas.length
      ? minhas.map(t => `<span class="badge badge-laranja" style="margin:2px">${t.nome}</span>`).join('')
      : '<p style="color:var(--texto-mudo);font-size:13px;">Nenhuma turma sob responsabilidade.</p>';
  });
}

window.onload = carregar;