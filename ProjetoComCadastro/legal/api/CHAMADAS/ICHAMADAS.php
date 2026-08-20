<?php
header('Content-Type: application/json');
require '../../app/conexao.php';
$pdo = Conexao::conectar();
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$json = filter_input(INPUT_GET, 'jsn');
$data = json_decode($json, true);

// Evita duplicar chamada da mesma matricula na mesma data: apaga o que já existir antes de inserir
$sqlDel = "delete from chamadas where chamatid = ? and chadata = ?;";
$prpDel = $pdo->prepare($sqlDel);
$prpDel->execute([$data['matid'] ?? null, $data['data'] ?? null]);

$sql = "insert into chamadas (chamatid, chadata, chastatus) values (?,?,?);";
$prp = $pdo->prepare($sql);
$prp->execute([
    $data['matid'] ?? null,
    $data['data'] ?? null,
    $data['status'] ?? 'presente',
]);

echo json_encode(['id' => $pdo->lastInsertId()]);
Conexao::desconectar();
