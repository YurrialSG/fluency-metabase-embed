// Configurações da aplicação
module.exports = {
  // Credenciais de acesso (ALTERE AQUI)
  admin: {
    password: process.env.ADMIN_PASSWORD || "BF2025!"
  },
  
  // Configurações do Metabase
  metabase: {
    url: "http://base-prod.fluencyacademy.io",
    secret: "67f7e6a92f6622653521d95070259fb9b14a512d667c2b24be5caa3b19f26476",
    dashboardId: 16,
    tokenExpiration: 10
  },
  
  // Configurações da aplicação
  app: {
    port: process.env.PORT || 3000,
    sessionSecret: process.env.SESSION_SECRET || "sua-chave-secreta-super-segura",
    nodeEnv: process.env.NODE_ENV || "development"
  }
};
