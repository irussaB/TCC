<?php
header('Content-Type: application/json');
require '../../app/conexao.php';
$pdo = Conexao::conectar();
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$sql = "
select h.id, h.turma_id, h.dia_semana, h.horario_inicio, h.horario_fim,
       t.nome as turmaNome
from horarios_treino h
inner join turmas t on t.id = h.turma_id
order by h.dia_semana, h.horario_inicio;
";
$prp = $pdo->prepare($sql);
$prp->execute();
echo json_encode($prp->fetchall(PDO::FETCH_ASSOC));
Conexao::desconectar();