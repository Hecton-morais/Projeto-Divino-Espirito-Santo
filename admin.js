const API = 'https://projeto-divino-espirito-santo.onrender.com'

// =====================
// LOGIN / LOGOUT
// =====================
async function fazerLogin() {
  const email = document.getElementById('login-email').value
  const senha = document.getElementById('login-senha').value

  try {
    const res = await fetch(`${API}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha })
    })

    if (!res.ok) {
      document.getElementById('login-erro').textContent = 'E-mail ou senha incorretos!'
      return
    }

    const { token } = await res.json()
    localStorage.setItem('admin_token', token)

    document.getElementById('login-screen').style.display = 'none'
    document.getElementById('admin-panel').style.display = 'block'
    carregarEventos()
    carregarFotos()
  } catch (err) {
    document.getElementById('login-erro').textContent = 'Erro ao conectar com o servidor.'
  }
}

function fazerLogout() {
  localStorage.removeItem('admin_token')
  document.getElementById('login-screen').style.display = 'flex'
  document.getElementById('admin-panel').style.display = 'none'
}

// Helper: pega o token salvo e monta os headers de autenticação
function authHeaders(extra = {}) {
  const token = localStorage.getItem('admin_token')
  return { ...extra, 'Authorization': `Bearer ${token}` }
}

// Verifica se já tem sessão salva ao carregar a página
window.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('admin_token')
  if (token) {
    document.getElementById('login-screen').style.display = 'none'
    document.getElementById('admin-panel').style.display = 'block'
    carregarEventos()
    carregarFotos()
  }
})

// =====================
// EVENTOS
// =====================
async function carregarEventos() {
  const res = await fetch(`${API}/eventos`)
  const eventos = await res.json()
  const lista = document.getElementById('lista-eventos')

  if (eventos.length === 0) {
    lista.innerHTML = '<p style="opacity:0.5">Nenhum evento cadastrado.</p>'
    return
  }

  lista.innerHTML = eventos.map(e => `
    <div class="item-card">
      <span>${e.titulo} — ${e.data}</span>
      <button onclick="removerEvento('${e.id}')">Remover</button>
    </div>
  `).join('')
}

async function adicionarEvento() {
  const titulo = document.getElementById('evento-titulo').value
  const data = document.getElementById('evento-data').value

  if (!titulo || !data) return alert('Preencha todos os campos!')

  const res = await fetch(`${API}/admin/evento`, {
    method: 'POST',
    headers: authHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({ titulo, data })
  })

  if (res.status === 401) {
    alert('Sessão expirada, faça login novamente.')
    fazerLogout()
    return
  }

  document.getElementById('evento-titulo').value = ''
  document.getElementById('evento-data').value = ''
  carregarEventos()
}

async function removerEvento(id) {
  const res = await fetch(`${API}/admin/evento/${id}`, {
    method: 'DELETE',
    headers: authHeaders()
  })

  if (res.status === 401) {
    alert('Sessão expirada, faça login novamente.')
    fazerLogout()
    return
  }

  carregarEventos()
}

// =====================
// FOTOS
// =====================
async function carregarFotos() {
  const res = await fetch(`${API}/fotos`)
  const fotos = await res.json()
  const lista = document.getElementById('lista-fotos')

  if (fotos.length === 0) {
    lista.innerHTML = '<p style="opacity:0.5">Nenhuma foto cadastrada.</p>'
    return
  }

  lista.innerHTML = fotos.map(f => `
    <div class="item-card">
      <img src="${f.url}" class="foto-preview">
      <span>${f.alt}</span>
      <button onclick="removerFoto('${f.id}', '${f.url}')">Remover</button>
    </div>
  `).join('')
}

async function adicionarFoto() {
  const file = document.getElementById('foto-file').files[0]
  const alt = document.getElementById('foto-alt').value

  if (!file || !alt) return alert('Selecione uma foto e adicione uma descrição!')

  const nomeArquivo = `${Date.now()}_${file.name}`

  const formData = new FormData()
  formData.append('foto', file)
  formData.append('alt', alt)
  formData.append('nome', nomeArquivo)

  const res = await fetch(`${API}/admin/foto`, {
    method: 'POST',
    headers: authHeaders(), // sem Content-Type aqui, o FormData define sozinho
    body: formData
  })

  if (res.status === 401) {
    alert('Sessão expirada, faça login novamente.')
    fazerLogout()
    return
  }

  document.getElementById('foto-file').value = ''
  document.getElementById('foto-alt').value = ''
  carregarFotos()
}

async function removerFoto(id, url) {
  const res = await fetch(`${API}/admin/foto/${id}`, {
    method: 'DELETE',
    headers: authHeaders()
  })

  if (res.status === 401) {
    alert('Sessão expirada, faça login novamente.')
    fazerLogout()
    return
  }

  carregarFotos()
}