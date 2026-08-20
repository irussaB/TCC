<?php
header('Content-Type: application/json');
require '../../app/conexao.php';
$pdo = Conexao::conectar();
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$json = filter_input(INPUT_GET, 'jsn');
$data = json_decode($json, true);

$sql = "insert into matriculas (mataluid, matturid, matstatus, matdata) values (?,?,?,?);";
$prp = $pdo->prepare($sql);
$prp->execute([
    $data['aluid'] ?? null,
    $data['turid'] ?? null,
    $data['status'] ?? 'pendente',
    $data['data'] ?? date('Y-m-d'),
]);

echo json_encode(['id' => $pdo->lastInsertId()]);
Conexao::desconectar();
