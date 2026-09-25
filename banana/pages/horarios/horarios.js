const apiTurmas = 'http://localhost/banana/api/TURMAS/';
const apiHor = 'http://localhost/banana/api/HORARIOS/';

const DIAS = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
let turmas = [], horarios = [];
let horEditandoId = null, modo = null;

function carregarTudo() {
  return Promise.all([
    fetch(`${apiTurmas}STURMAS.php`).then(r => r.json()),
    fetch(`${apiHor}SHORARIOS.php`).then(r => r.json())
  ]).then(([t, h]) => {
    turmas = t; horarios = h;
    document.getElementById('hor-turma').innerHTML = '<option value="">Selecione</option>' +
      turmas.map(x => `<option value="${x.id}">${x.nome}</option>`).join('');
    renderLista();
  });
}

function renderLista() {
  const cont = document.getElementById('lista-horarios');
  const vazio = document.getElementById('vazio-hor');
  if (!horarios.length) { cont.innerHTML = ''; vazio.style.display = 'block'; return; }
  vazio.style.display = 'none';

  cont.innerHTML = horarios.map(h => `
    <div class="plano-card ${modo === 'editar' ? '' : ''}" style="${modo === 'editar' ? 'cursor:pointer;border-color:var(--amarelo)' : modo === 'excluir' ? 'cursor:pointer;border-color:var(--vermelho)' : ''}"
      onclick="clicarHorario(${h.id})">
      <div style="flex:1">
        <h4>${h.turmaNome}</h4>
        <p style="font-size:12px;color:var(--texto-mudo);">${DIAS[h.dia_semana]} · ${h.horario_inicio} às ${h.horario_fim}</p>
      </div>
    </div>
  `).join('');
}

function salvarHorario() {
  const turma_id = document.getElementById('hor-turma').value;
  const dia_semana = document.getElementById('hor-dia').value;
  const horario_inicio = document.getElementById('hor-inicio').value;
  const horario_fim = document.getElementById('hor-fim').value;
  if (!turma_id || dia_semana === '' || !horario_inicio || !horario_fim) {
    alert('Preencha todos os campos.'); return;
  }

  const payload = { turma_id, dia_semana, horario_inicio, horario_fim };
  const url = horEditandoId
    ? `${apiHor}UHORARIOS.php?jsn=${encodeURIComponent(JSON.stringify({ ...payload, id: horEditandoId }))}`
    : `${apiHor}IHORARIOS.php?jsn=${encodeURIComponent(JSON.stringify(payload))}`;

  fetch(url).then(r => r.json()).then(() => {
    if (horEditandoId) cancelarEdicao();
    else {
      document.getElementById('hor-turma').value = '';
      document.getElementById('hor-dia').value = '';
      document.getElementById('hor-inicio').value = '';
      document.getElementById('hor-fim').value = '';
    }
    carregarTudo();
  });
}

function cancelarEdicao() {
  horEditandoId = null;
  document.getElementById('form-hor-titulo').textContent = 'Novo horário';
  document.getElementById('btn-hor').innerHTML = '<i class="ti ti-plus" style="margin-right:6px"></i> Criar horário';
  document.getElementById('btn-cancelar-hor').style.display = 'none';
  document.getElementById('hor-turma').value = '';
  document.getElementById('hor-dia').value = '';
  document.getElementById('hor-inicio').value = '';
  document.getElementById('hor-fim').value = '';
}

function modoEditar() { modo = modo === 'editar' ? null : 'editar'; renderLista(); }
function modoExcluir() { modo = modo === 'excluir' ? null : 'excluir'; renderLista(); }

function clicarHorario(id) {
  if (modo === 'editar') {
    const h = horarios.find(x => x.id === id);
    horEditandoId = id;
    document.getElementById('hor-turma').value = h.turma_id;
    document.getElementById('hor-dia').value = h.dia_semana;
    document.getElementById('hor-inicio').value = h.horario_inicio;
    document.getElementById('hor-fim').value = h.horario_fim;
    document.getElementById('form-hor-titulo').textContent = 'Editar horário';
    document.getElementById('btn-hor').innerHTML = '<i class="ti ti-device-floppy" style="margin-right:6px"></i> Salvar horário';
    document.getElementById('btn-cancelar-hor').style.display = 'block';
    modo = null;
    renderLista();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else if (modo === 'excluir') {
    if (!confirm('Apagar este horário?')) { modo = null; renderLista(); return; }
    fetch(`${apiHor}DHORARIOS.php?jsn=${encodeURIComponent(JSON.stringify({ id }))}`)
      .then(r => r.json()).then(() => { modo = null; carregarTudo(); });
  }
}

window.onload = carregarTudo;