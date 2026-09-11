const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const multer = require('multer')
const jwt = require('jsonwebtoken')
const { createClient } = require('@supabase/supabase-js')

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

const upload = multer({ storage: multer.memoryStorage() })
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY)

// =====================
// MIDDLEWARE DE AUTENTICAÇÃO
// =====================
function verificarToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) return res.status(401).json({ error: 'Token não fornecido' })

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Token inválido ou expirado' })
    req.admin = decoded
    next()
  })
}

// =====================
// LOGIN
// =====================
app.post('/admin/login', (req, res) => {
  const { email, senha } = req.body

  if (email === process.env.ADMIN_EMAIL && senha === process.env.ADMIN_SENHA) {
    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '8h' })
    return res.json({ token })
  }

  res.status(401).json({ error: 'Credenciais inválidas' })
})

// =====================
// EVENTOS
// =====================

app.get('/eventos', async (req, res) => {
  const { data, error } = await supabase.from('eventos').select('*')
  if (error) return res.status(500).json({ error })
  res.json(data)
})

app.post('/admin/evento', verificarToken, async (req, res) => {
  const { titulo, data } = req.body
  const { error } = await supabase.from('eventos').insert({ titulo, data })
  if (error) return res.status(500).json({ error })
  res.json({ mensagem: 'Evento adicionado!' })
})

app.delete('/admin/evento/:id', verificarToken, async (req, res) => {
  const { id } = req.params
  const { error } = await supabase.from('eventos').delete().eq('id', id)
  if (error) return res.status(500).json({ error })
  res.json({ mensagem: 'Evento removido!' })
})

// =====================
// FOTOS
// =====================

app.get('/fotos', async (req, res) => {
  const { data, error } = await supabase.from('fotos').select('*')
  if (error) return res.status(500).json({ error })
  res.json(data)
})

app.post('/admin/foto', verificarToken, upload.single('foto'), async (req, res) => {
  const { alt, nome } = req.body
  const file = req.file

  console.log('arquivo:', file)
  console.log('alt:', alt)
  console.log('nome:', nome)

  if (!file) return res.status(400).json({ error: 'Nenhum arquivo enviado' })

  const { error: uploadError } = await supabase.storage
    .from('fotos')
    .upload(nome, file.buffer, { contentType: file.mimetype })

  if (uploadError) {
    console.log('erro upload:', uploadError)
    return res.status(500).json({ error: uploadError })
  }

  const { data } = supabase.storage.from('fotos').getPublicUrl(nome)

  const { error } = await supabase.from('fotos').insert({ url: data.publicUrl, alt })
  if (error) {
    console.log('erro insert:', error)
    return res.status(500).json({ error })
  }

  res.json({ mensagem: 'Foto adicionada!' })
})

app.delete('/admin/foto/:id', verificarToken, async (req, res) => {
  const { id } = req.params
  const { error } = await supabase.from('fotos').delete().eq('id', id)
  if (error) return res.status(500).json({ error })
  res.json({ mensagem: 'Foto removida!' })
})

app.listen(process.env.PORT, () => {
  console.log(`Servidor rodando na porta ${process.env.PORT}`)
})