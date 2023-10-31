const express = require('express');
const { body, validationResult } = require('express-validator');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('consultorio.db');
const app = express();

app.use(express.json());

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS consultas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      data TEXT NOT NULL,
      horario TEXT NOT NULL,
      paciente TEXT NOT NULL,
      medico TEXT NOT NULL,
      status TEXT NOT NULL
    )
  `);
});

app.get('/consultas', (req, res) => {
  db.all('SELECT * FROM consultas', (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao listar consultas' });
    }
    res.json(rows);
  });
});

app.post('/consultas', [
  body('data').custom(value => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      throw new Error('A data deve estar no formato AAAA-MM-DD.');
    }
    return true;
  }),
  body('horario').custom(value => {
    if (!/^\d{2}:\d{2}$/.test(value)) {
        throw new Error('O horário deve estar no formato HH:MM.');
    }
    return true;
  }),
  body('paciente').isLength({ min: 2 }).withMessage('O nome do paciente deve ter pelo menos 2 caracteres.'),
  body('medico').isLength({ min: 2 }).withMessage('O nome do médico deve ter pelo menos 2 caracteres.'),
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { data, horario, paciente, medico } = req.body;
  const status = 'marcada';

  const agora = new Date();
  const dataHorarioConsulta = new Date(data + 'T' + horario);

  if (dataHorarioConsulta <= agora) {
    return res.status(400).json({ error: 'Não é possível agendar consultas no passado.' });
  }

  db.get('SELECT id FROM consultas WHERE data = ? AND horario = ? AND medico = ? AND status = "marcada"', [data, horario, medico], (err, row) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao verificar disponibilidade' });
    }
    if (row) {
      return res.status(400).json({ error: 'Já existe uma consulta agendada para este horário com o mesmo médico.' });
    }

    db.run('INSERT INTO consultas (data, horario, paciente, medico, status) VALUES (?, ?, ?, ?, ?)', [data, horario, paciente, medico, status], (err) => {
      if (err) {
        return res.status(500).json({ error: 'Erro ao agendar a consulta' });
      }

      res.json({ mensagem: 'Consulta agendada com sucesso' });
    });
  });
});

app.delete('/consultas/:id', (req, res) => {
  const idConsulta = req.params.id;

  db.get('SELECT * FROM consultas WHERE id = ? AND status = "marcada"', [idConsulta], (err, row) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao verificar consulta agendada' });
    }

    if (!row) {
      return res.status(404).json({ error: 'Consulta não encontrada ou já foi cancelada' });
    }

    db.run('UPDATE consultas SET status = "cancelada" WHERE id = ?', [idConsulta], (err) => {
      if (err) {
        return res.status(500).json({ error: 'Erro ao cancelar a consulta' });
      }
      
      res.json({ mensagem: 'Consulta cancelada com sucesso' });
    });
  });
});

app.listen(3000, () => {
  console.log('Servidor iniciado na porta 3000');
});
