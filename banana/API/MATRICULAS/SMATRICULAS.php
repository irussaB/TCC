<?php
header('Content-Type: application/json');
require '../../app/conexao.php';
$pdo = Conexao::conectar();
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$sql = "
select
  m.id, m.aluno_id, m.status, m.data_matricula,
  a.nome, a.sexo, a.datanasc, a.peso, a.altura, a.cpf, a.email, a.telefone,
  a.endereco, a.numero, a.bairro, a.cidade, a.uf, a.cep,
  a.contatoemergencianome, a.contatoemergenciatelefone, a.contatoemergenciacpf,
  a.atestadomedico, a.autorizacaoresponsavel,
  (select group_concat(t.nome separator ', ')
     from matriculas_turmas mt
     inner join turmas t on t.id = mt.turma_id
     where mt.matricula_id = m.id) as turmaNome
from matriculas m
inner join alunos a on a.id = m.aluno_id
order by a.nome;
";
$prp = $pdo->prepare($sql);
$prp->execute();
echo json_encode($prp->fetchall(PDO::FETCH_ASSOC));
Conexao::desconectar();