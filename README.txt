    Instruction To Run Application

1.Backend Environment Configuration
i.Navigate to your backend directory:
Bash
cd backend

ii.Run installation to pull core dependencies:
Bash
npm install

iii.Create a .env configuration file in the backend root directory and supply your local parameters:

Code snippet
PORT=5000
JWT_SECRET=your_secure_jwt_secret_phrase
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_root_password
DB_NAME=store_rating_db

iv.Boot the server using Nodemon development mode:

Bash
npm run dev

3. Frontend App Launch
i.Open a new terminal instance and navigate to your frontend workspace directory:
Bash
cd frontend

ii.Install client dependencies:

Bash
npm install

iii.Launch your interactive React application:

Bash
npm run dev

Press ->o+enter