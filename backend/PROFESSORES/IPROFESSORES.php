<?php
header('Content-Type: application/json');
require '../../app/conexao.php';
$pdo = Conexao::conectar();
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$json = filter_input(INPUT_GET, 'jsn');
$data = json_decode($json, true);

$sql = "insert into professores (pronome, proemail, protelefone, prosenha) values (?,?,?,?);";
$prp = $pdo->prepare($sql);
$prp->execute([
    $data['nome'] ?? null,
    $data['email'] ?? null,
    $data['telefone'] ?? null,
    $data['senha'] ?? null,
]);

echo json_encode(['id' => $pdo->lastInsertId()]);
Conexao::desconectar();
