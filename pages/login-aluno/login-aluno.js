    let cliquesTema = 0, temporizadorTema = null;

    function alternarTema() {
      cliquesTema++;
      clearTimeout(temporizadorTema);
      temporizadorTema = setTimeout(() => cliquesTema = 0, 1500);

      if (cliquesTema >= 5) {
        cliquesTema = 0;
        document.body.classList.add('tema-escuro');
        const ativo = document.body.classList.toggle('tema-time');
        document.getElementById('icone-tema').className = ativo ? 'ti ti-flame' : 'ti ti-sun';
        localStorage.setItem('tema', ativo ? 'time' : 'escuro');
        return;
      }

      if (document.body.classList.contains('tema-time')) return;

      const escuro = document.body.classList.toggle('tema-escuro');
      document.getElementById('icone-tema').className = escuro ? 'ti ti-sun' : 'ti ti-moon';
      localStorage.setItem('tema', escuro ? 'escuro' : 'claro');
    }
    (function() {
      const salvo = localStorage.getItem('tema');
      if (salvo === 'time') {
        document.body.classList.add('tema-escuro', 'tema-time');
      } else if (salvo === 'escuro') {
        document.body.classList.add('tema-escuro');
      }
      document.addEventListener('DOMContentLoaded', function() {
        const ic = document.getElementById('icone-tema');
        if (!ic) return;
        if (salvo === 'time') ic.className = 'ti ti-flame';
        else if (salvo === 'escuro') ic.className = 'ti ti-sun';
      });
    })();

    function toggleSenha() {
      const campo = document.getElementById('senha');
      const icone = document.getElementById('icone-olho');
      const visivel = campo.type === 'text';
      campo.type = visivel ? 'password' : 'text';
      icone.className = visivel ? 'ti ti-eye' : 'ti ti-eye-off';
    }

    const alunos = [
      { email: 'lucas.ferreira@email.com', senha: '12345678', nome: 'Lucas Ferreira', matricula: '#0042' },
    ];

    function fazerLogin(e) {
      e.preventDefault();
      const email = document.getElementById('email').value.trim().toLowerCase();
      const senha = document.getElementById('senha').value;
      const alerta = document.getElementById('alerta-erro');
      const textoErro = document.getElementById('texto-erro');
      const aluno = alunos.find(a => a.email === email && a.senha === senha);
      if (aluno) {
        localStorage.setItem('aluno-logado', JSON.stringify(aluno));
        alerta.style.display = 'none';
        window.location.href = 'pages/aluno.html';
      } else {
        textoErro.textContent = 'E-mail ou senha incorretos. Tente novamente.';
        alerta.style.display = 'flex';
        document.getElementById('senha').focus();
      }
    }