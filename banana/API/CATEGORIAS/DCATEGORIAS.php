<?php
header('Content-Type: application/json');
require '../../app/conexao.php';
$pdo = Conexao::conectar();
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$json = filter_input(INPUT_GET, 'jsn');
$data = json_decode($json, true);

try {
    $sql = "delete from categorias where id = ?;";
    $prp = $pdo->prepare($sql);
    $prp->execute([$data['id'] ?? null]);
    echo json_encode(['ok' => true]);
} catch (Exception $e) {
    echo json_encode(['erro' => 'Categoria não pode ser excluída pois algum exercício a utiliza.']);
}
Conexao::desconectar();