<?php
header('Content-Type: application/json');
require '../../app/conexao.php';
$pdo = Conexao::conectar();
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$sql = "
select
  m.matid as id,
  m.mataluid as aluid,
  m.matturid as turid,
  m.matstatus as status,
  m.matdata as data,
  t.turnome as turmaNome,
  a.alunome as nome,
  a.alusexo as sexo,
  a.aludatanasc as nascimento,
  a.alupeso as peso,
  a.alualtura as altura,
  a.alucpf as cpf,
  a.aluemail as email,
  a.alutelefone as telefone,
  a.aluendereco as endereco,
  a.alunumero as numero,
  a.alubairro as bairro,
  a.alucidade as cidade,
  a.aluuf as uf,
  a.alurespnome as respNome,
  a.aluresptel as respTelefone,
  a.alurespemail as respEmail
from matriculas m
inner join alunos a on a.aluid = m.mataluid
left join turmas t on t.turid = m.matturid
order by m.matid desc;
";
$prp = $pdo->prepare($sql);
$prp->execute();
$data = $prp->fetchall(PDO::FETCH_ASSOC);
echo json_encode($data);
Conexao::desconectar();
