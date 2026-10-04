// Cliente que fala com o NOSSO servidor.
// No seu PC: localhost:3000. Online: VITE_API_URL, preenchida pelo Render na hora do build.
// O Render manda só o NOME do serviço ("norteens-api", sem domínio), então completamos
// o ".onrender.com" e o "https://" quando faltarem.
function enderecoCompleto(valor) {
  if (valor.startsWith('http')) return valor;
  return `https://${valor.includes('.') ? valor : `${valor}.onrender.com`}`;
}
const API_URL = enderecoCompleto(import.meta.env.VITE_API_URL || 'http://localhost:3000');

// No plano gratuito do Render a API "dorme" sem uso e leva ~1 min para acordar. Chamar isto
// assim que o site abre faz ela ir acordando enquanto a pessoa ainda lê a página ou digita a senha.
export function acordarServidor() {
  fetch(`${API_URL}/`, { cache: 'no-store' }).catch(() => { /* só um aviso para acordar; erro não importa */ });
}

export const norteens = {
  // faz login e guarda o token (crachá) no navegador
  async login(email, senha) {
    const resposta = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha })
    });

    const dados = await resposta.json();

    if (!resposta.ok) {
      throw new Error(dados.erro || 'Erro ao fazer login');
    }

    localStorage.setItem('token', dados.token);
    return dados.usuario;
  },
  
  // cria uma conta nova e já loga em seguida
  async register(nome, email, senha) {
    const resposta = await fetch(`${API_URL}/usuarios`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, email, senha })
    });
    const dados = await resposta.json();
    if (!resposta.ok) {
      throw new Error(dados.erro || 'Erro ao criar conta');
    }
    return await this.login(email, senha);
  },

  // pergunta ao servidor quem é o usuário logado
  async me() {
    const token = localStorage.getItem('token');
    if (!token) return null;
    const resposta = await fetch(`${API_URL}/me`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!resposta.ok) {
      localStorage.removeItem('token');
      return null;
    }
    return await resposta.json();
  },

  // atualiza dados do próprio usuário
  async updateMe(campos) {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Não autenticado');
    const resposta = await fetch(`${API_URL}/me`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(campos)
    });
    const dados = await resposta.json();
    if (!resposta.ok) {
      throw new Error(dados.erro || 'Erro ao atualizar');
    }
    return dados;
  },

  // verifica se tem alguém logado
  async isAuthenticated() {
    const usuario = await this.me();
    return usuario !== null;
  },

  // desloga: joga o crachá fora
  logout() {
    localStorage.removeItem('token');
  },

  // envia as respostas do teste comportamental e recebe o usuário com o perfil calculado
  async calcularTeste(respostas) {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Não autenticado');
    const resposta = await fetch(`${API_URL}/teste/calcular`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ respostas })
    });
    const dados = await resposta.json();
    if (!resposta.ok) throw new Error(dados.erro || 'Erro ao calcular o resultado do teste');
    return dados;
  },

  // lista todas as profissões
  async listarProfissoes() {
    const resposta = await fetch(`${API_URL}/profissoes`);
    if (!resposta.ok) throw new Error('Erro ao buscar profissões');
    return await resposta.json();
  },

  // busca uma profissão pelo id
  async getProfissao(id) {
    const resposta = await fetch(`${API_URL}/profissoes/${id}`);
    if (!resposta.ok) throw new Error('Profissão não encontrada');
    return await resposta.json();
  },

  // lista os famosos de uma profissão
  async getFamosos(id) {
    const resposta = await fetch(`${API_URL}/profissoes/${id}/famosos`);
    if (!resposta.ok) throw new Error('Erro ao buscar famosos');
    return await resposta.json();
  },

// lista TODOS os famosos
  async listarFamosos() {
    const resposta = await fetch(`${API_URL}/famosos`);
    if (!resposta.ok) throw new Error('Erro ao buscar famosos');
    return await resposta.json();
  },

  // envia uma imagem (post ou foto de perfil) e devolve a URL pública dela
  async uploadImagem(file) {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Não autenticado');
    const formData = new FormData();
    formData.append('imagem', file);
    const resposta = await fetch(`${API_URL}/upload`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData
    });
    const dados = await resposta.json();
    if (!resposta.ok) throw new Error(dados.erro || 'Erro ao enviar imagem');
    return dados.url;
  },

  // pede o e-mail de redefinição de senha (sempre "sucesso", exista o e-mail ou não)
  async esqueciSenha(email) {
    const resposta = await fetch(`${API_URL}/esqueci-senha`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    const dados = await resposta.json();
    if (!resposta.ok) throw new Error(dados.erro || 'Erro ao pedir redefinição de senha');
    return dados;
  },

  // troca a senha usando o token recebido por e-mail
  async resetarSenha(token, novaSenha) {
    const resposta = await fetch(`${API_URL}/resetar-senha`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, novaSenha })
    });
    const dados = await resposta.json();
    if (!resposta.ok) throw new Error(dados.erro || 'Erro ao redefinir senha');
    return dados;
  },

  // lista o feed de posts
  async listarPosts() {
    const resposta = await fetch(`${API_URL}/posts`);
    if (!resposta.ok) throw new Error('Erro ao buscar posts');
    return await resposta.json();
  },

 // cria um post novo (precisa estar logado)
  async criarPost(texto, imagem) {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Não autenticado');
    const resposta = await fetch(`${API_URL}/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ texto, imagem })
    });
    const dados = await resposta.json();
    if (!resposta.ok) throw new Error(dados.erro || 'Erro ao criar post');
    return dados;
  },

  // curtir/descurtir um post (alterna)
  async curtir(postId) {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Não autenticado');
    const resposta = await fetch(`${API_URL}/posts/${postId}/curtir`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const dados = await resposta.json();
    if (!resposta.ok) throw new Error(dados.erro || 'Erro ao curtir');
    return dados;
  },

 // pega a contagem de curtidas de um post (e se você curtiu)
  async getCurtidas(postId) {
    const token = localStorage.getItem('token');
    const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
    const resposta = await fetch(`${API_URL}/posts/${postId}/curtidas`, { headers });
    if (!resposta.ok) throw new Error('Erro ao buscar curtidas');
    return await resposta.json();
  },

  // lista os comentários de um post
  async getComentarios(postId) {
    const resposta = await fetch(`${API_URL}/posts/${postId}/comentarios`);
    if (!resposta.ok) throw new Error('Erro ao buscar comentários');
    return await resposta.json();
  },

  // comenta em um post (precisa estar logado)
  async comentar(postId, texto) {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Não autenticado');
    const resposta = await fetch(`${API_URL}/posts/${postId}/comentarios`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ texto })
    });
    const dados = await resposta.json();
    if (!resposta.ok) throw new Error(dados.erro || 'Erro ao comentar');
    return dados;
  },

  // apaga um post (só o dono)
  async apagarPost(postId) {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Não autenticado');
    const resposta = await fetch(`${API_URL}/posts/${postId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const dados = await resposta.json();
    if (!resposta.ok) throw new Error(dados.erro || 'Erro ao apagar');
    return dados;
  },
// apaga um comentário (só o dono)
  async apagarComentario(comentarioId) {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Não autenticado');
    const resposta = await fetch(`${API_URL}/comentarios/${comentarioId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const dados = await resposta.json();
    if (!resposta.ok) throw new Error(dados.erro || 'Erro ao apagar comentário');
    return dados;
  },

  // troca a própria senha (precisa da senha atual)
  async trocarSenha(senhaAtual, senhaNova) {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Não autenticado');
    const resposta = await fetch(`${API_URL}/me/senha`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ senhaAtual, senhaNova })
    });
    const dados = await resposta.json();
    if (!resposta.ok) throw new Error(dados.erro || 'Erro ao trocar senha');
    return dados;
  },

  // apaga a própria conta
  async apagarConta() {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Não autenticado');
    const resposta = await fetch(`${API_URL}/me`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const dados = await resposta.json();
    if (!resposta.ok) throw new Error(dados.erro || 'Erro ao excluir conta');
    return dados;
  },

  // [ADMIN] cria uma profissão
  async criarProfissao(dados) {
    const token = localStorage.getItem('token');
    const resposta = await fetch(`${API_URL}/profissoes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(dados)
    });
    const r = await resposta.json();
    if (!resposta.ok) throw new Error(r.erro || 'Erro ao criar profissão');
    return r;
  },

  // [ADMIN] edita uma profissão
  async editarProfissao(id, dados) {
    const token = localStorage.getItem('token');
    const resposta = await fetch(`${API_URL}/profissoes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(dados)
    });
    const r = await resposta.json();
    if (!resposta.ok) throw new Error(r.erro || 'Erro ao editar profissão');
    return r;
  },

  // [ADMIN] apaga uma profissão
  async apagarProfissao(id) {
    const token = localStorage.getItem('token');
    const resposta = await fetch(`${API_URL}/profissoes/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const r = await resposta.json();
    if (!resposta.ok) throw new Error(r.erro || 'Erro ao apagar profissão');
    return r;
  },

  // [ADMIN] cria um famoso
  async criarFamoso(dados) {
    const token = localStorage.getItem('token');
    const resposta = await fetch(`${API_URL}/famosos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(dados)
    });
    const r = await resposta.json();
    if (!resposta.ok) throw new Error(r.erro || 'Erro ao criar famoso');
    return r;
  },

  // [ADMIN] edita um famoso
  async editarFamoso(id, dados) {
    const token = localStorage.getItem('token');
    const resposta = await fetch(`${API_URL}/famosos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(dados)
    });
    const r = await resposta.json();
    if (!resposta.ok) throw new Error(r.erro || 'Erro ao editar famoso');
    return r;
  },

// [ADMIN] apaga um famoso
  async apagarFamoso(id) {
    const token = localStorage.getItem('token');
    const resposta = await fetch(`${API_URL}/famosos/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const r = await resposta.json();
    if (!resposta.ok) throw new Error(r.erro || 'Erro ao apagar famoso');
    return r;
  },

  // cria um feedback (precisa estar logado)
  async criarFeedback(texto, autorizarExibicao) {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Não autenticado');
    const resposta = await fetch(`${API_URL}/feedbacks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ texto, autorizar_exibicao: autorizarExibicao })
    });
    const dados = await resposta.json();
    if (!resposta.ok) throw new Error(dados.erro || 'Erro ao enviar feedback');
    return dados;
  },

  // lista os feedbacks autorizados a aparecer na tela inicial (público)
  async listarFeedbacksPublicos() {
    const resposta = await fetch(`${API_URL}/feedbacks-publicos`);
    if (!resposta.ok) throw new Error('Erro ao buscar feedbacks');
    return await resposta.json();
  },

  // [ADMIN] lista todos os feedbacks recebidos
  async listarFeedbacksAdmin() {
    const token = localStorage.getItem('token');
    const resposta = await fetch(`${API_URL}/feedbacks-admin`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const r = await resposta.json();
    if (!resposta.ok) throw new Error(r.erro || 'Erro ao listar feedbacks');
    return r;
  },

  // [EQUIPE] destaca (ou tira o destaque de) um feedback na página inicial
  async destacarFeedback(id, destaque) {
    const token = localStorage.getItem('token');
    const resposta = await fetch(`${API_URL}/feedbacks/${id}/destaque`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ destaque })
    });
    const r = await resposta.json();
    if (!resposta.ok) throw new Error(r.erro || 'Erro ao destacar feedback');
    return r;
  },

  // [ADMIN] apaga um feedback
  async apagarFeedback(id) {
    const token = localStorage.getItem('token');
    const resposta = await fetch(`${API_URL}/feedbacks/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const r = await resposta.json();
    if (!resposta.ok) throw new Error(r.erro || 'Erro ao apagar feedback');
    return r;
  },

  // [ADMIN] lista todos os usuários
  async listarUsuarios() {
    const token = localStorage.getItem('token');
    const resposta = await fetch(`${API_URL}/usuarios-admin`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const r = await resposta.json();
    if (!resposta.ok) throw new Error(r.erro || 'Erro ao listar usuários');
    return r;
  },

  // [ADMIN] muda o papel de um usuário
  async mudarPapel(userId, papel) {
    const token = localStorage.getItem('token');
    const resposta = await fetch(`${API_URL}/usuarios/${userId}/papel`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ papel })
    });
    const r = await resposta.json();
    if (!resposta.ok) throw new Error(r.erro || 'Erro ao mudar papel');
    return r;
  }
};