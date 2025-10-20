# 📍Travel Map Tracker

Aplicação web interativa para registrar, visualizar e acompanhar os países visitados. Esta aplicação permite aos usuários marcar países que já visitaram em um mapa interativo, visualizar estatísticas de viagem e gerenciar seu histórico de viagens.
## ⭐ Tecnologias Utilizadas

### 🏗️ Backend
- **Flask**
- **SQLAlchemy**
- **SQLite**

### 🌅 Frontend
- **React 19**
- **React-Leaflet v5**
- **Tailwind CSS**
- **TypeScript**

## Arquitetura

A aplicação segue uma arquitetura modular cliente/servidor**, separando claramente as responsabilidades:

- **Backend (Flask)**: Fornece API REST para gerenciamento de dados de viagens, países visitados e estatísticas
- **Frontend (React)**: Interface do usuário responsiva com mapa interativo e funcionalidades de visualização

## Pré-requisitos
- **Python** - Para o backend Flask
- **Node.js 18+** e **npm** - Para o frontend React

## ⬇️ Instalação/Execução

### 1. Configuração do Backend (Flask)

```bash
# Navegue para o diretório do backend
cd backend

# Crie um ambiente virtual Python
python -m venv venv

# Ative o ambiente virtual
# No Windows:
venv\Scripts\activate
# No macOS/Linux:
source venv/bin/activate

# Instale as dependências
pip install -r requirements.txt

# Configure as variáveis de ambiente
cp env.example .env
# Edite o arquivo .env com as configs

# Execute o servidor Flask
flask run
```

O backend estará disponível em `http://localhost:5000`

### 2. Configuração do Frontend (React Router v7)

```bash
# Navegue para o diretório do frontend
cd frontend

# Instale as dependências
npm install

# Execute o servidor de desenvolvimento
npm run dev
```

O frontend estará disponível em `http://localhost:5173`

## Estrutura do Projeto

```
travel-map-tracker/
├── backend/                    # Aplicação Flask (Backend)
│   ├── app/                    # Módulo principal da aplicação
│   ├── instance/              # Arquivos de instância (banco de dados local)
│   ├── tests/                 # Testes unitários e de integração
│   ├── requirements.txt       # Dependências Python
│   └── env.example           # Exemplo de variáveis de ambiente
├── frontend/                   # Aplicação React Router v7 (Frontend)
│   ├── app/                   # Código fonte da aplicação
│   │   ├── components/       # Componentes reutilizáveis
│   │   ├── routes/           # Páginas da aplicação
│   │   ├── app.css           # Estilos globais
│   │   ├── root.tsx          # Componente raiz
│   │   └── routes.ts         # Configuração de rotas
│   ├── public/                # Arquivos públicos (favicon, etc.)
│   ├── package.json          # Dependências Node.js
│   ├── tsconfig.json         # Configuração TypeScript
│   ├── vite.config.ts        # Configuração Vite
│   └── react-router.config.ts # Configuração React Router
├── .gitignore                 # Arquivos ignorados pelo Git
└── README.md                  # Este arquivo
```

## Desenvolvimento

### Modo de Desenvolvimento

1. **Backend**: Execute `flask run` no diretório `backend/`
2. **Frontend**: Execute `npm run dev` no diretório `frontend/`
#### Frontend (React Router v7)
O frontend não requer variáveis de ambiente específicas no momento, pois utiliza:
- **Mapas**: OpenStreetMap tiles (gratuitos)
- **API**: Configuração será adicionada quando o backend for integrado
- **SSR**: Desabilitado para evitar conflitos com Leaflet
