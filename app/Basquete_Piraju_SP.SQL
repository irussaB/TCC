-- 1. Usuários Base / Professores / Alunos
CREATE TABLE professores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    telefone VARCHAR(20)
) ENGINE=InnoDB;

CREATE TABLE alunos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    cpf VARCHAR(14) UNIQUE,
    sexo CHAR(1), -- 'M', 'F', 'O'
    data_nasc DATE,
    telefone VARCHAR(20),
    altura DECIMAL(3,2), -- ex: 1.95 m
    peso DECIMAL(5,2),   -- ex: 85.50 kg
    endereco VARCHAR(150),
    numero VARCHAR(10),
    cidade VARCHAR(100),
    uf CHAR(2),
    cep VARCHAR(9),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 2. Turmas e Horários
CREATE TABLE turmas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    professor_id INT NOT NULL,
    FOREIGN KEY (professor_id) REFERENCES professores(id)
) ENGINE=InnoDB;

CREATE TABLE horarios_treino (
    id INT AUTO_INCREMENT PRIMARY KEY,
    turma_id INT NOT NULL,
    dia_semana TINYINT NOT NULL COMMENT '1-Dom, 2-Seg, ..., 7-Sab',
    horario_inicio TIME NOT NULL,
    horario_fim TIME NOT NULL,
    FOREIGN KEY (turma_id) REFERENCES turmas(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE matriculas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    aluno_id INT NOT NULL,
    turma_id INT NOT NULL,
    data_matricula DATE NOT NULL,
    status ENUM('ativa', 'inativa', 'trancada') DEFAULT 'ativa',
    UNIQUE KEY uk_aluno_turma (aluno_id, turma_id),
    FOREIGN KEY (aluno_id) REFERENCES alunos(id),
    FOREIGN KEY (turma_id) REFERENCES turmas(id)
) ENGINE=InnoDB;

-- 3. Frequência / Chamada
CREATE TABLE chamadas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    aluno_id INT NOT NULL,
    turma_id INT NOT NULL,
    data_chamada DATE NOT NULL,
    presente BOOLEAN DEFAULT TRUE,
    UNIQUE KEY uk_aluno_turma_data (aluno_id, turma_id, data_chamada),
    FOREIGN KEY (aluno_id) REFERENCES alunos(id),
    FOREIGN KEY (turma_id) REFERENCES turmas(id)
) ENGINE=InnoDB;

-- 4. Planejamento de Treino e Exercícios
CREATE TABLE exercicios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    categoria VARCHAR(50) -- ex: 'Arremesso', 'Físico', 'Drible'
) ENGINE=InnoDB;

CREATE TABLE planos_mensais (
    id INT AUTO_INCREMENT PRIMARY KEY,
    turma_id INT NOT NULL,
    ano INT NOT NULL,
    mes TINYINT NOT NULL,
    objetivo TEXT,
    observacoes TEXT,
    FOREIGN KEY (turma_id) REFERENCES turmas(id)
) ENGINE=InnoDB;

CREATE TABLE planos_diarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    plano_mensal_id INT NOT NULL,
    turma_id INT NOT NULL,
    professor_id INT NOT NULL,
    data_plano DATE NOT NULL,
    observacao TEXT,
    FOREIGN KEY (plano_mensal_id) REFERENCES planos_mensais(id),
    FOREIGN KEY (turma_id) REFERENCES turmas(id),
    FOREIGN KEY (professor_id) REFERENCES professores(id)
) ENGINE=InnoDB;

CREATE TABLE exercicios_plano_diario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    plano_diario_id INT NOT NULL,
    exercicio_id INT NOT NULL,
    series INT DEFAULT 1,
    repeticoes_tempo VARCHAR(50) COMMENT 'Ex: 10 reps ou 2 min',
    ordem INT DEFAULT 1,
    FOREIGN KEY (plano_diario_id) REFERENCES planos_diarios(id) ON DELETE CASCADE,
    FOREIGN KEY (exercicio_id) REFERENCES exercicios(id)
) ENGINE=InnoDB;

-- 5. Tabela Principal: Armazena o aviso/anotação gerado pelo professor
CREATE TABLE anotacoes_professor (
    id INT AUTO_INCREMENT PRIMARY KEY,
    professor_id INT NOT NULL,
    titulo VARCHAR(100) NOT NULL,
    anotacao TEXT NOT NULL,
    data_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_validade DATE DEFAULT NULL COMMENT 'Data limite para exibição',
    exibir BOOLEAN DEFAULT TRUE,
    tipo_destino ENUM('TODOS', 'TURMA', 'ALUNOS_ESPECIFICOS') NOT NULL DEFAULT 'TODOS',
    turma_id INT DEFAULT NULL COMMENT 'Preenchido caso tipo_destino seja TURMA',
    FOREIGN KEY (professor_id) REFERENCES professores(id),
    FOREIGN KEY (turma_id) REFERENCES turmas(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 6. Tabela N:N: Armazena os destinatários quando o aviso for para alunos específicos
CREATE TABLE anotacao_alunos_destino (
    anotacao_id INT NOT NULL,
    aluno_id INT NOT NULL,
    lido BOOLEAN DEFAULT FALSE,
    data_leitura DATETIME DEFAULT NULL,
    PRIMARY KEY (anotacao_id, aluno_id),
    FOREIGN KEY (anotacao_id) REFERENCES anotacoes_professor(id) ON DELETE CASCADE,
    FOREIGN KEY (aluno_id) REFERENCES alunos(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 7. Exemplo de select turbinado
SELECT DISTINCT a.id, a.titulo, a.anotacao, a.data_registro, a.tipo_destino
FROM anotacoes_professor a
LEFT JOIN anotacao_alunos_destino ad ON a.id = ad.anotacao_id
LEFT JOIN matriculas m ON m.aluno_id = 10 AND m.status = 'ativa'
WHERE a.exibir = TRUE
  AND (a.data_validade IS NULL OR a.data_validade >= CURDATE())
  AND (
      a.tipo_destino = 'TODOS' 
      OR (a.tipo_destino = 'TURMA' AND a.turma_id = m.turma_id)
      OR (a.tipo_destino = 'ALUNOS_ESPECIFICOS' AND ad.aluno_id = 10)
  )
ORDER BY a.data_registro DESC;
