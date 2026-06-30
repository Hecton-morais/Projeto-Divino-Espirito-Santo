const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const { createClient } = require('@supabase/supabase-js')

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY)

// =====================
// EVENTOS
// =====================

app.get('/eventos', async (req, res) => {
  const { data, error } = await supabase.from('eventos').select('*')
  if (error) return res.status(500).json({ error })
  res.json(data)
})

app.post('/admin/evento', async (req, res) => {
  const { titulo, data } = req.body
  const { error } = await supabase.from('eventos').insert({ titulo, data })
  if (error) return res.status(500).json({ error })
  res.json({ mensagem: 'Evento adicionado!' })
})

app.delete('/admin/evento/:id', async (req, res) => {
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

app.delete('/admin/foto/:id', async (req, res) => {
  const { id } = req.params
  const { error } = await supabase.from('fotos').delete().eq('id', id)
  if (error) return res.status(500).json({ error })
  res.json({ mensagem: 'Foto removida!' })
})

app.listen(process.env.PORT, () => {
  console.log(`Servidor rodando na porta ${process.env.PORT}`)
})