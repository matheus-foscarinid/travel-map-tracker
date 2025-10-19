# Travel Map Tracker

Aplicação web interativa para registrar, visualizar e acompanhar os países visitados. Esta aplicação permite aos usuários marcar países que já visitaram em um mapa interativo, visualizar estatísticas de viagem e gerenciar seu histórico de viagens.

## Tecnologias Utilizadas

### Backend
- **Flask** (Python) - Framework web para desenvolvimento da API REST
- **SQLAlchemy** - ORM para interação com banco de dados
- **Flask-Migrate** - Gerenciamento de migrações do banco de dados
- **Flask-CORS** - Configuração de CORS para comunicação com frontend
- **PostgreSQL/SQLite** - Banco de dados relacional

### Frontend
- **React** - Biblioteca JavaScript para construção da interface do usuário
- **React Router** - Roteamento para aplicação single-page
- **Leaflet/React-Leaflet** - Biblioteca para mapas interativos
- **Axios** - Cliente HTTP para comunicação com a API

### Banco de Dados
- **PostgreSQL** (produção) - Banco de dados relacional robusto
- **SQLite** (desenvolvimento) - Banco de dados leve para desenvolvimento local

## Arquitetura

A aplicação segue uma **arquitetura modular client-server**, separando claramente as responsabilidades entre frontend e backend:

- **Backend (Flask)**: Fornece API REST para gerenciamento de dados de viagens, países visitados e estatísticas
- **Frontend (React)**: Interface do usuário responsiva com mapa interativo e funcionalidades de visualização
- **Comunicação**: Frontend e backend se comunicam via API REST com JSON

## Pré-requisitos

Antes de executar a aplicação, certifique-se de ter instalado:

- **Python 3.8+** - Para o backend Flask
- **Node.js 16+** e **npm** - Para o frontend React
- **PostgreSQL** (opcional) - Para produção, ou SQLite para desenvolvimento

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

### 2. Configuração do Frontend (React)

```bash
# Navegue para o diretório do frontend
cd frontend

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp env.example .env
# Edite o arquivo .env com suas configurações

# Execute o servidor de desenvolvimento
npm start
```

O frontend estará disponível em `http://localhost:3000`

### 3. Configuração do Banco de Dados

#### Opção 1: SQLite (Desenvolvimento)
```bash
# No diretório backend
flask db init
flask db migrate -m "Initial migration"
flask db upgrade
```

#### Opção 2: PostgreSQL (Produção)
```bash
# Crie um banco de dados PostgreSQL
createdb travel_map_tracker

# Configure a DATABASE_URL no arquivo .env
# DATABASE_URL=postgresql://username:password@localhost:5432/travel_map_tracker

# Execute as migrações
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
├── frontend/                   # Aplicação React (Frontend)
│   ├── src/                   # Código fonte React
│   ├── public/                # Arquivos públicos (HTML, manifest)
│   ├── package.json          # Dependências Node.js
│   └── env.example           # Exemplo de variáveis de ambiente
├── .gitignore                 # Arquivos ignorados pelo Git
└── README.md                  # Este arquivo
```

## Desenvolvimento

### Executando em Modo de Desenvolvimento

1. **Backend**: Execute `flask run` no diretório `backend/`
2. **Frontend**: Execute `npm start` no diretório `frontend/`

### Variáveis de Ambiente

#### Backend (.env)
```env
DATABASE_URL=sqlite:///travel_map_tracker.db
FLASK_APP=app
FLASK_ENV=development
SECRET_KEY=your-secret-key-here
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

#### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_API_TIMEOUT=10000
REACT_APP_MAP_TILE_URL=https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
REACT_APP_MAP_ATTRIBUTION=© OpenStreetMap contributors
```

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.
