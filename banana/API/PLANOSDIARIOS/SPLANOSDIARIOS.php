<?php
header('Content-Type: application/json');
require '../../app/conexao.php';
$pdo = Conexao::conectar();
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$sql = "
select pd.id, pd.plano_mensal_id, pd.turma_id, pd.data, pd.observacao,
       pm.nome as planoNome, t.nome as turmaNome
from planos_diarios pd
inner join planos_mensais pm on pm.id = pd.plano_mensal_id
inner join turmas t on t.id = pd.turma_id
order by pd.data desc;
";
$prp = $pdo->prepare($sql);
$prp->execute();
echo json_encode($prp->fetchall(PDO::FETCH_ASSOC));
Conexao::desconectar();