<h1>Neuro-access</h1>
The core concept of NeuroAccess is Adaptive Web Transformation: rather than forcing users to adapt to inaccessible websites, NeuroAccess adapts the website to match the user's specific cognitive and visual needs <br><br>

<img height="400" alt="Screenshot 2026-09-27 143037" src="https://github.com/user-attachments/assets/c9a28d6d-8e6e-4c82-99d3-9fb4427b6fe6" />

<hr>
<h2>Required Programs : </h2>
<ul>
  <li> <a href="https://nodejs.org/en/download">Node.js (LTS Version) </a></li>
  <li> <a href="https://www.mongodb.com/try/download/community-kubernetes-operator"> MongoDB Community Server </a></li>
  <li> <a href="https://aistudio.google.com/api-keys"> Google AI Studio (Gemini API Key) </a></li>
</ul>

<hr>

<h2>Step 1 : Clone the Repository</h2>
Open cmd and type the following code :

```

git clone https://github.com/Skanda098/neuro-access.git
cd neuro-access
```

<h2>Step 2 : </h2>
Inside the server Folder Create a .env File consisting of :

```

PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/neuroaccess
GEMINI_API_KEY=YOUR_ACTUAL_GEMINI_API_KEY_HERE
```

Replace the API_KEY with your actual api key from Google AI Studio

<h2>Step 3 : </h2>
Close all the existing cmd tabs <br>
Open a new cmd inside the neuro-access folder <br>
then type the following commands one by one to start the backend :

```

cd server
npm install
npm run dev
```

<h2>Step 4 : </h2>
Open a new cmd inside the neuro-access folder <br>
then type the following commands one by one to start the frontend :

```

cd client
npm install
npm run dev
```
<h2>Step 5 : </h2>
Open   

```http://localhost:3000``` 
in Google Chrome, paste an article link, and click Adapt Content.
