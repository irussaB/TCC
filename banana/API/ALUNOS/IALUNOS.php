<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }

require '../../app/conexao.php';
$pdo = Conexao::conectar();
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

// Aceita tanto POST (JSON no body) quanto GET (?jsn=...)
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
    $sql = "insert into alunos
        (nome, email, senha, cpf, sexo, datanasc, telefone, altura, peso,
         endereco, bairro, numero, cidade, uf, cep, psf,
         contatoemergencianome, contatoemergenciatelefone, contatoemergenciacpf,
         atestadomedico, autorizacaoresponsavel)
        values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);";

    $prp = $pdo->prepare($sql);
    $prp->execute([
        $data['nome'] ?? null,
        $data['email'] ?? null,
        $data['senha'] ?? null,
        $data['cpf'] ?? null,
        $data['sexo'] ?? null,
        $data['datanasc'] ?? null,
        $data['telefone'] ?? null,
        $data['altura'] ?? null,
        $data['peso'] ?? null,
        $data['endereco'] ?? null,
        $data['bairro'] ?? null,
        $data['numero'] ?? null,
        $data['cidade'] ?? null,
        $data['uf'] ?? null,
        $data['cep'] ?? null,
        $data['psf'] ?? null,
        $data['contatoemergencianome'] ?? null,
        $data['contatoemergenciatelefone'] ?? null,
        $data['contatoemergenciacpf'] ?? null,
        $data['atestadomedico'] ?? null,
        $data['autorizacaoresponsavel'] ?? null,
    ]);

    echo json_encode(['id' => $pdo->lastInsertId(), 'ok' => true]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['erro' => $e->getMessage()]);
}
Conexao::desconectar();