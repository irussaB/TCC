<?php
header('Content-Type: application/json');
require '../../app/conexao.php';
$pdo = Conexao::conectar();
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$sql = "
select
  c.chaid as id,
  c.chamatid as matid,
  c.chadata as data,
  c.chastatus as status,
  m.matturid as turid,
  t.turnome as turmaNome,
  a.alunome as alunoNome
from chamadas c
inner join matriculas m on m.matid = c.chamatid
inner join alunos a on a.aluid = m.mataluid
left join turmas t on t.turid = m.matturid
order by c.chadata desc, t.turnome;
";
$prp = $pdo->prepare($sql);
$prp->execute();
$data = $prp->fetchall(PDO::FETCH_ASSOC);
echo json_encode($data);
Conexao::desconectar();
