# Travel Map Tracker

Aplicação web interativa para registrar, visualizar e acompanhar os países visitados. Esta aplicação permite aos usuários marcar países que já visitaram em um mapa interativo, visualizar estatísticas de viagem e gerenciar seu histórico de viagens.
## Tecnologias Utilizadas

### Backend
- **Flask** (Python) - Framework web para desenvolvimento da API REST
- **SQLAlchemy** - ORM para interação com banco de dados
- **Flask-Migrate** - Gerenciamento de migrações do banco de dados
- **SQLite** - Banco de dados relacional

### Frontend
- **React 19** - Biblioteca JavaScript para construção da interface do usuário
- **React Router v7** - Roteamento moderno para aplicação single-page
- **React-Leaflet v5** - Componentes React para mapas interativos
- **Leaflet** - Biblioteca para mapas interativos
- **Tailwind CSS** - Framework CSS para estilização
- **TypeScript** - Superset do JavaScript com tipagem estática

### Banco de Dados
- **PostgreSQL** (produção) - Banco de dados relacional robusto
- **SQLite** (desenvolvimento) - Banco de dados leve para desenvolvimento local

## Arquitetura

A aplicação segue uma **arquitetura modular cliente/servidor**, separando claramente as responsabilidades:

- **Backend (Flask)**: Fornece API REST para gerenciamento de dados de viagens, países visitados e estatísticas
- **Frontend (React)**: Interface do usuário responsiva com mapa interativo e funcionalidades de visualização

## Pré-requisitos

Antes de executar a aplicação, certifique-se de ter instalado:

- **Python** - Para o backend Flask
- **Node.js 18+** e **npm** - Para o frontend React

## Instalação e Execução

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
# Edite o arquivo .env com suas configurações

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

### 3. Configuração do Banco de Dados

#### SQLite
```bash
# No diretório backend
flask db init
flask db migrate -m "Initial migration"
flask db upgrade
```

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
│   │   │   └── WorldMap.tsx  # Componente do mapa interativo
│   │   ├── routes/           # Páginas da aplicação
│   │   │   ├── home.tsx      # Página inicial com mapa
│   │   │   └── config.tsx    # Página de configuração
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

### Executando em Modo de Desenvolvimento

1. **Backend**: Execute `flask run` no diretório `backend/`
2. **Frontend**: Execute `npm run dev` no diretório `frontend/`

## Funcionalidades do Frontend

### Páginas Disponíveis

#### 🏠 Página Inicial (`/`)
- **Mapa Interativo**: Mapa mundial com países clicáveis usando Leaflet
- **Interatividade**: Clique em qualquer país (BR, AR, etc.) para interagir
- **Efeitos Visuais**: Hover effects e tooltips com nomes dos países
- **Design Responsivo**: Interface adaptável para diferentes tamanhos de tela

#### ⚙️ Página de Configuração (`/config`)
- **Interface Limpa**: Página em branco para futuras configurações
- **Design Consistente**: Mantém o padrão visual da aplicação

### Tecnologias do Frontend

- **React Router v7**: Roteamento moderno com SSR desabilitado
- **React-Leaflet v5**: Componentes React para mapas interativos
- **Tailwind CSS**: Estilização utilitária e responsiva
- **TypeScript**: Tipagem estática para melhor desenvolvimento
- **Vite**: Build tool rápido e moderno

### Variáveis de Ambiente

#### Backend (.env)
```env
DATABASE_URL=sqlite:///travel_map_tracker.db
FLASK_APP=app
FLASK_ENV=development
SECRET_KEY=your-secret-key-here
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

#### Frontend (React Router v7)
O frontend não requer variáveis de ambiente específicas no momento, pois utiliza:
- **Mapas**: OpenStreetMap tiles (gratuitos)
- **API**: Configuração será adicionada quando o backend for integrado
- **SSR**: Desabilitado para evitar conflitos com Leaflet
