<?php
header('Content-Type: application/json');
require '../../app/conexao.php';
$pdo = Conexao::conectar();
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$json = filter_input(INPUT_GET, 'jsn');
$data = json_decode($json, true);

$sql = "update planos_diarios set plano_mensal_id=?, turma_id=?, data=?, observacao=? where id=?;";
$prp = $pdo->prepare($sql);
$prp->execute([
    $data['plano_mensal_id'] ?? null, $data['turma_id'] ?? null,
    $data['data'] ?? null, $data['observacao'] ?? null, $data['id'] ?? null,
]);
echo json_encode(['ok' => true]);
Conexao::desconectar();