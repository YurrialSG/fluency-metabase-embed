const express = require('express');
const session = require('express-session');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const path = require('path');
const config = require('./config');
require('dotenv').config();

const app = express();
const PORT = config.app.port;

// Middleware
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public', {
  setHeaders: (res, path) => {
    // Adiciona headers de segurança
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('X-XSS-Protection', '1; mode=block');
  }
}));

// Configuração de sessão
app.use(session({
  secret: config.app.sessionSecret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Desabilitado para funcionar com HTTP na Vercel
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 horas
  }
}));

// Middleware de autenticação
const requireAuth = (req, res, next) => {
  console.log('🔐 Verificando autenticação:', {
    authenticated: req.session.authenticated,
    sessionId: req.sessionID,
    user: req.session.user
  });
  
  if (req.session.authenticated) {
    next();
  } else {
    console.log('❌ Usuário não autenticado, redirecionando para login');
    res.redirect('/login');
  }
};

// Função para gerar token JWT do Metabase
function generateMetabaseToken() {
  const payload = {
    resource: { dashboard: config.metabase.dashboardId },
    params: {},
    exp: Math.round(Date.now() / 1000) + (config.metabase.tokenExpiration * 60) // 10 minute expiration
  };
  
  console.log('Gerando token com payload:', payload);
  console.log('Secret key:', config.metabase.secret.substring(0, 10) + '...');
  
  const token = jwt.sign(payload, config.metabase.secret, { algorithm: 'HS256' });
  console.log('Token gerado:', token);
  
  return token;
}

// Rotas
app.get('/', (req, res) => {
  if (req.session.authenticated) {
    res.redirect('/dashboard');
  } else {
    res.redirect('/login');
  }
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.post('/login', async (req, res) => {
  const { password } = req.body;
  
  console.log('🔑 Tentativa de login:', {
    sessionId: req.sessionID,
    hasPassword: !!password,
    expectedPassword: config.admin.password
  });
  
  // Verifica credenciais
  if (password === config.admin.password) {
    req.session.authenticated = true;
    req.session.user = { loginTime: new Date() };
    
    console.log('✅ Login bem-sucedido:', {
      sessionId: req.sessionID,
      authenticated: req.session.authenticated,
      user: req.session.user
    });
    
    res.json({ success: true, redirect: '/dashboard' });
  } else {
    console.log('❌ Login falhou - senha incorreta');
    res.status(401).json({ 
      success: false, 
      message: 'Senha incorreta' 
    });
  }
});

app.get('/dashboard', requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

app.get('/api/metabase-token', requireAuth, (req, res) => {
  try {
    console.log('Solicitação de token recebida');
    console.log('Configurações:', {
      metabaseUrl: config.metabase.url,
      dashboardId: config.metabase.dashboardId,
      secretKey: config.metabase.secret.substring(0, 10) + '...'
    });
    
    const token = generateMetabaseToken();
    const iframeUrl = `${config.metabase.url}/embed/dashboard/${token}#bordered=true&titled=true`;
    
    console.log('URL do iframe gerada:', iframeUrl);
    
    res.json({ 
      success: true, 
      token, 
      iframeUrl,
      metabaseUrl: config.metabase.url
    });
  } catch (error) {
    console.error('Erro ao gerar token:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erro ao gerar token do Metabase',
      error: error.message 
    });
  }
});

app.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Erro ao fazer logout:', err);
      return res.status(500).json({ success: false });
    }
    res.json({ success: true, redirect: '/login' });
  });
});

// Rota de teste
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'API funcionando!', 
    timestamp: new Date().toISOString(),
    config: {
      metabaseUrl: config.metabase.url,
      dashboardId: config.metabase.dashboardId
    }
  });
});

// Rota para testar conectividade com Metabase
app.get('/api/test-metabase', async (req, res) => {
  try {
    const https = require('https');
    const url = require('url');
    
    const metabaseUrl = config.metabase.url;
    const parsedUrl = url.parse(metabaseUrl);
    
    const options = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port || 443,
      path: '/api/health',
      method: 'GET',
      timeout: 5000
    };
    
    const request = https.request(options, (response) => {
      let data = '';
      response.on('data', (chunk) => {
        data += chunk;
      });
      
      response.on('end', () => {
        res.json({
          success: true,
          metabaseUrl: metabaseUrl,
          status: response.statusCode,
          accessible: response.statusCode === 200,
          response: data
        });
      });
    });
    
    request.on('error', (error) => {
      res.json({
        success: false,
        metabaseUrl: metabaseUrl,
        error: error.message,
        accessible: false
      });
    });
    
    request.on('timeout', () => {
      request.destroy();
      res.json({
        success: false,
        metabaseUrl: metabaseUrl,
        error: 'Timeout',
        accessible: false
      });
    });
    
    request.setTimeout(5000);
    request.end();
    
  } catch (error) {
    res.json({
      success: false,
      error: error.message,
      accessible: false
    });
  }
});

// Rota de debug da sessão
app.get('/api/session-debug', (req, res) => {
  res.json({
    sessionId: req.sessionID,
    authenticated: req.session.authenticated,
    user: req.session.user,
    sessionData: req.session,
    headers: {
      cookie: req.headers.cookie,
      userAgent: req.headers['user-agent']
    }
  });
});

// Middleware de erro
app.use((err, req, res, next) => {
  console.error('Erro:', err);
  res.status(500).json({ 
    success: false, 
    message: 'Erro interno do servidor' 
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📊 Dashboard: http://localhost:${PORT}`);
  console.log(`🔐 Login: http://localhost:${PORT}/login`);
  console.log(`⚙️  Configurações:`);
  console.log(`   - Dashboard ID: ${config.metabase.dashboardId}`);
  console.log(`   - Metabase URL: ${config.metabase.url}`);
});

module.exports = app;
