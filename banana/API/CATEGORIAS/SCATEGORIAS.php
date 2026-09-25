<?php
header('Content-Type: application/json');
require '../../app/conexao.php';
$pdo = Conexao::conectar();
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$sql = "select id, nome from categorias order by nome;";
$prp = $pdo->prepare($sql);
$prp->execute();
echo json_encode($prp->fetchall(PDO::FETCH_ASSOC));
Conexao::desconectar();