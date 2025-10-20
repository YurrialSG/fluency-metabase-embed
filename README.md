# 🚀 Dashboard Metabase com Autenticação

Aplicação Node.js moderna para proteger o acesso ao dashboard do Metabase com autenticação por email e senha.

## ✨ Funcionalidades

- ✅ **Autenticação segura** com sessões
- ✅ **Interface moderna** e responsiva
- ✅ **Geração automática de token JWT** para Metabase
- ✅ **Auto-refresh** do token
- ✅ **Logout seguro**
- ✅ **Deploy rápido** na Vercel

## 🚀 Deploy Rápido na Vercel

### Opção 1: Deploy via GitHub (Recomendado)

1. **Crie um repositório** no GitHub
2. **Faça upload** dos arquivos
3. **Conecte na Vercel**:
   - Acesse [vercel.com](https://vercel.com)
   - Clique em "New Project"
   - Conecte seu repositório GitHub
   - Deploy automático! 🎉

### Opção 2: Deploy via Vercel CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login na Vercel
vercel login

# Deploy
vercel

# Deploy para produção
vercel --prod
```

## ⚙️ Configuração

### 1. Variáveis de Ambiente

Crie um arquivo `.env` baseado no `env.example`:

```bash
# Credenciais de acesso
ADMIN_EMAIL=seu-email@exemplo.com
ADMIN_PASSWORD=sua-senha-segura

# Configurações do Metabase
METABASE_URL=http://base-prod.fluencyacademy.io
METABASE_SECRET=sua-chave-secreta-do-metabase
DASHBOARD_ID=16
```

### 2. Configuração na Vercel

1. Vá para **Settings** → **Environment Variables**
2. Adicione as variáveis:
   - `ADMIN_EMAIL`
   - `ADMIN_PASSWORD`
   - `METABASE_URL`
   - `METABASE_SECRET`
   - `DASHBOARD_ID`

## 🏃‍♂️ Executar Localmente

### 1. Instalar Dependências

```bash
npm install
```

### 2. Configurar Variáveis

```bash
# Copie o arquivo de exemplo
cp env.example .env

# Edite as configurações
nano .env
```

### 3. Executar

```bash
# Desenvolvimento
npm run dev

# Produção
npm start
```

## 📁 Estrutura do Projeto

```
├── server.js              # Servidor principal
├── package.json           # Dependências
├── vercel.json           # Configuração Vercel
├── env.example           # Exemplo de variáveis
├── public/
│   ├── login.html        # Página de login
│   └── dashboard.html    # Página do dashboard
└── README.md
```

## 🔧 Personalização

### Alterar Credenciais

No arquivo `.env` ou nas variáveis da Vercel:

```bash
ADMIN_EMAIL=novo-email@exemplo.com
ADMIN_PASSWORD=nova-senha-segura
```

### Alterar Dashboard

```bash
DASHBOARD_ID=123  # ID do seu dashboard
```

### Alterar Tempo de Expiração

```bash
TOKEN_EXPIRATION=30  # 30 minutos
```

## 🎨 Interface

- **Design moderno** com gradientes
- **Responsivo** para mobile/tablet/desktop
- **Animações suaves**
- **Loading states**
- **Mensagens de erro/sucesso**

## 🔒 Segurança

- **Sessões seguras** com cookies
- **Tokens JWT** com expiração
- **Auto-refresh** para manter sessão
- **Logout seguro** com limpeza de sessão

## 📊 Monitoramento

### Logs da Aplicação

```bash
# Ver logs em tempo real
vercel logs

# Logs específicos
vercel logs --follow
```

### Métricas da Vercel

- **Analytics** automático
- **Performance** monitoring
- **Uptime** tracking

## 🚀 Vantagens sobre Apps Script

| Recurso            | Apps Script | Node.js + Vercel |
| ------------------ | ----------- | ---------------- |
| **Deploy**         | 2-3 minutos | 30 segundos      |
| **Performance**    | Lenta       | Rápida           |
| **Logs**           | Limitados   | Completos        |
| **Debugging**      | Difícil     | Fácil            |
| **Escalabilidade** | Limitada    | Ilimitada        |
| **Customização**   | Limitada    | Total            |

## 🆘 Solução de Problemas

### Erro de Login

1. Verifique as credenciais no `.env`
2. Confirme se as variáveis estão na Vercel
3. Teste localmente primeiro

### Dashboard não carrega

1. Verifique o `DASHBOARD_ID`
2. Confirme a `METABASE_SECRET`
3. Teste a URL do Metabase diretamente

### Deploy falha

1. Verifique se o `package.json` está correto
2. Confirme se o `vercel.json` existe
3. Veja os logs de build na Vercel

## 📞 Suporte

- **Logs**: `vercel logs`
- **Status**: Dashboard da Vercel
- **Debug**: Console do navegador

---

**🎉 Pronto! Sua aplicação está funcionando perfeitamente!**

**URL da aplicação**: [Sua URL da Vercel aparecerá aqui após o deploy]
