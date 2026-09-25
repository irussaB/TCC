<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }

require '../../app/conexao.php';
$pdo = Conexao::conectar();
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (!$data) {
    $json = filter_input(INPUT_GET, 'jsn');
    $data = json_decode($json, true);
}

if (!$data) {
    echo json_encode(['erro' => 'Nenhum dado recebido']);
    exit;
}

try {
    $sql = "insert into matriculas (aluno_id, data_matricula, status) values (?,?,?);";
    $prp = $pdo->prepare($sql);
    $prp->execute([
        $data['aluno_id'] ?? null,
        $data['data_matricula'] ?? date('Y-m-d'),
        $data['status'] ?? 'pendente',
    ]);
    echo json_encode(['id' => $pdo->lastInsertId(), 'ok' => true]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['erro' => $e->getMessage()]);
}
Conexao::desconectar();