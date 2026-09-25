<?php
header('Content-Type: application/json');
require '../../app/conexao.php';
$pdo = Conexao::conectar();
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$sql = "
select
  mt.id, mt.matricula_id as matriculaId, mt.turma_id as turmaId,
  m.status as matriculaStatus, a.id as alunoId,
  a.nome as alunoNome, a.datanasc as nascimento
from matriculas_turmas mt
inner join matriculas m on m.id = mt.matricula_id
inner join alunos a on a.id = m.aluno_id;
";
$prp = $pdo->prepare($sql);
$prp->execute();
echo json_encode($prp->fetchall(PDO::FETCH_ASSOC));
Conexao::desconectar();