const apiUrlMatriculas = 'http://localhost/legal/api/MATRICULAS/';

let matriculas = [];
let filtroAtual = 'todas';
let buscaAtual = '';
let modalId = null;

function carregarMatriculas() {
  fetch(`${apiUrlMatriculas}SMATRICULAS.php`)
    .then(r => r.json())
    .then(data => {
      matriculas = data;
      renderLista();
      atualizarContadores();
    });
}

function renderLista() {
  const lista = document.getElementById('lista-matriculas');
  const vazio = document.getElementById('estado-vazio');
  lista.innerHTML = '';

  const filtradas = matriculas.filter(m => {
    const okStatus = filtroAtual === 'todas' || m.status === filtroAtual;
    const okBusca = (m.nome || '').toLowerCase().includes(buscaAtual.toLowerCase());
    return okStatus && okBusca;
  });

  if (filtradas.length === 0) { vazio.style.display = 'block'; return; }
  vazio.style.display = 'none';

  filtradas.forEach(m => {
    const inicial = (m.nome || '?').charAt(0).toUpperCase();
    const labelStatus = { pendente: 'Pendente', aprovada: 'Aprovada', recusada: 'Recusada' }[m.status] || m.status;
    const acoes = m.status === 'pendente'
      ? `<button class="btn-aceitar" onclick="aceitar(${m.id})"><i class="ti ti-check"></i> Aceitar</button>
         <button class="btn-recusar" onclick="recusar(${m.id})"><i class="ti ti-x"></i> Recusar</button>`
      : '';

    lista.innerHTML += `
      <div class="card" style="padding:16px 20px;display:flex;align-items:center;gap:16px;flex-wrap:wrap;">
        <div style="width:44px;height:44px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:700;background:var(--laranja-dim);color:var(--laranja);flex-shrink:0;">${inicial}</div>
        <div style="flex:1;min-width:180px;">
          <div style="font-size:15px;font-weight:600;">${m.nome || '—'}</div>
          <div style="display:flex;gap:12px;flex-wrap:wrap;margin-top:4px;font-size:12px;color:var(--texto-mudo);">
            <span><i class="ti ti-users"></i> ${m.turmaNome || 'Sem turma definida'}</span>
            <span><i class="ti ti-calendar"></i> ${formatarData(m.data)}</span>
          </div>
        </div>
        <span class="badge badge-${m.status === 'aprovada' ? 'verde' : m.status === 'recusada' ? 'vermelho' : 'laranja'}">${labelStatus}</span>
        <div style="display:flex;gap:8px;">
          ${acoes}
          <button class="btn-detalhes" onclick="abrirModal(${m.id})"><i class="ti ti-eye"></i> Ver</button>
        </div>
      </div>`;
  });
}

function formatarData(iso) {
  if (!iso) return '—';
  const [ano, mes, dia] = iso.split('-');
  return `${dia}/${mes}/${ano}`;
}

function atualizarContadores() {
  document.getElementById('count-todas').textContent = matriculas.length;
  document.getElementById('count-pendente').textContent = matriculas.filter(m => m.status === 'pendente').length;
  document.getElementById('count-aprovada').textContent = matriculas.filter(m => m.status === 'aprovada').length;
  document.getElementById('count-recusada').textContent = matriculas.filter(m => m.status === 'recusada').length;
}

function filtrarAba(aba, btn) {
  filtroAtual = aba;
  document.querySelectorAll('.abas-wrap .chip').forEach(b => b.classList.remove('selecionado'));
  btn.classList.add('selecionado');
  renderLista();
}

function buscarAluno(valor) {
  buscaAtual = valor;
  renderLista();
}

function atualizarStatus(id, status) {
  fetch(`${apiUrlMatriculas}UMATRICULAS.php?jsn=${encodeURIComponent(JSON.stringify({ id, status }))}`)
    .then(r => r.json())
    .then(() => carregarMatriculas());
}

function aceitar(id) {
  atualizarStatus(id, 'aprovada');
  toast('Matrícula aprovada!', 'sucesso');
  fecharModalBtn();
}
function recusar(id) {
  atualizarStatus(id, 'recusada');
  toast('Matrícula recusada.', 'erro');
  fecharModalBtn();
}

function abrirModal(id) {
  const m = matriculas.find(x => x.id === id);
  if (!m) return;
  modalId = id;

  document.getElementById('modal-nome').textContent = m.nome || '—';
  document.getElementById('modal-sub').textContent = `${m.turmaNome || 'Sem turma'} · Solicitado em ${formatarData(m.data)}`;
  document.getElementById('md-nascimento').textContent = formatarData(m.nascimento);
  document.getElementById('md-sexo').textContent = m.sexo === 'F' ? 'Feminino' : 'Masculino';
  document.getElementById('md-fisico').textContent = `${m.peso || '—'} kg / ${m.altura || '—'} cm`;
  document.getElementById('md-cpf').textContent = m.cpf || '—';
  document.getElementById('md-email').textContent = m.email || '—';
  document.getElementById('md-telefone').textContent = m.telefone || '—';
  document.getElementById('md-endereco').textContent = m.endereco ? `${m.endereco}, ${m.numero || 's/n'} - ${m.bairro || ''}` : '—';
  document.getElementById('md-cidade').textContent = m.cidade ? `${m.cidade}/${m.uf || ''}` : '—';
  document.getElementById('md-resp-nome').textContent = m.respNome || '—';
  document.getElementById('md-resp-tel').textContent = m.respTelefone || '—';
  document.getElementById('md-resp-email').textContent = m.respEmail || '—';

  const acoes = document.getElementById('modal-acoes');
  acoes.innerHTML = m.status === 'pendente'
    ? `<button class="btn-aceitar" style="flex:1;justify-content:center;" onclick="aceitar(${m.id})"><i class="ti ti-check"></i> Aceitar matrícula</button>
       <button class="btn-recusar" style="flex:1;justify-content:center;" onclick="recusar(${m.id})"><i class="ti ti-x"></i> Recusar</button>`
    : '';

  document.getElementById('modal').classList.add('aberto');
}

function fecharModal(e) { if (e.target.id === 'modal') fecharModalBtn(); }
function fecharModalBtn() { document.getElementById('modal').classList.remove('aberto'); modalId = null; }

function toast(msg, tipo) {
  const wrap = document.getElementById('toasts');
  const el = document.createElement('div');
  el.className = `toast ${tipo}`;
  el.innerHTML = `<i class="ti ti-${tipo === 'sucesso' ? 'check' : 'x'}"></i> ${msg}`;
  wrap.appendChild(el);
  setTimeout(() => el.remove(), 3000);
}

window.onload = carregarMatriculas;
