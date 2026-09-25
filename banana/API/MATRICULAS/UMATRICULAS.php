<?php
header('Content-Type: application/json');
require '../../app/conexao.php';
$pdo = Conexao::conectar();
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$json = filter_input(INPUT_GET, 'jsn');
$data = json_decode($json, true);

if (isset($data['status']) && isset($data['id'])) {
    $sql = "update matriculas set status = ? where id = ?;";
    $prp = $pdo->prepare($sql);
    $prp->execute([$data['status'], $data['id']]);
}
echo json_encode(['ok' => true]);
Conexao::desconectar();