/**
 * Fichier : server.ts
 * Description : Point d'entrée pour le serveur DenoJS gérant l'API "votes" et "inscrits".
 * Auteur : [Votre nom ou pseudonyme]
 * Date : [Date de création]
 *
 * Ce serveur DenoJS utilise express.
 * Il offre plusieurs endpoints pour récupérer, et mettre à jour les "votes" et "inscrits".
 * La constante POST_SECRET_KEY est utilisée pour sécuriser la mise à jour.
 * 
 * Pour plus d'informations, veuillez consulter le fichier README.md.
 */

import express from "express";
import { Server } from "npm:socket.io";
import cors from "npm:cors";
import kv from "./src/db/db.ts";
import { removeVotesDuplicates, removeInscritsDuplicates } from "./src/utils.ts";

// Constant
const MAX_VERSIONSTAMP_HISTORY = 100;
const POST_SECRET_KEY = Deno.env.get("POST_SECRET_KEY");

const app = express();
const server = app.listen(Deno.env.get('PORT'));

// Enable CORS for specific origins
app.use(cors());

// Other middleware and routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const io = new Server(server, {
  cors: {
    origin: "*", // Allow requests from any origin
    methods: ["GET", "POST"], // Allow only GET and POST requests
    allowedHeaders: ["Authorization"], // Allow specific headers
    credentials: true // Allow sending cookies along with requests
  }
});
/*
app.get("/clear", (request: any, response: any) => {
  kv.delete(["votes"]);
  kv.delete(["inscrits"]);
});
*/

app.post("/update-votes/:id", async (request: any, response: any) => {
  if (request.params.id) {
    if (request.params.id === POST_SECRET_KEY) {
      const votes = request.body;
      const _result = await kv.set(["votes"], removeVotesDuplicates(votes));
      
      response.sendStatus(200);
    }
    else {
      console.log("Unauthorized: received invalid POST_SECRET_KEY: " + request.params.id)

      response.send("Unauthorized: Invalid POST_SECRET_KEY");
    }
  }
  else {    
    console.log("Unauthorized: MISSING POST_SECRET_KEY")

    response.send("Unauthorized: MISSING POST_SECRET_KEY");
  }
});


app.post("/update-inscrits/:id", async (request: any, response: any) => {
  if (request.params.id) {
    if (request.params.id === POST_SECRET_KEY) {
      const inscrits_cumule = request.body;
      const _result = await kv.set(["inscrits"], removeInscritsDuplicates(inscrits_cumule));
      
      response.sendStatus(200);
    }
    else {
      console.log("Unauthorized: received invalid POST_SECRET_KEY: " + request.params.id)

      response.send("Unauthorized: Invalid POST_SECRET_KEY");
    }
  }
  else {
    console.log("Unauthorized: MISSING POST_SECRET_KEY")

    response.send("Unauthorized: MISSING POST_SECRET_KEY");
  }
});

// Handle io connection
io.on("connection", async (socket) => {
  console.log("🧦 A user connected");
  
  socket.on("get-votes", async () => {
    console.log("Sending votes after receiving 'get-votes' request...");
    const _res = await kv.get(["votes"], { consistency: "eventual" });
    console.debug("Emitting votes...", _res.value);
    io.emit("votes", _res.value);
  });

  socket.on("get-inscrits", async() => {
    console.log("Sending inscrits after receiving 'get-inscrits' request...");
    const _res = await kv.get(["inscrits"], { consistency: "eventual" });
    console.debug("Emitting inscrits...", _res.value);
    io.emit("inscrits", _res.value);
  });
  
  let votes_versionstamp:[] = [];
  let inscrits_versionstamp:[] = [];

  const stream = kv.watch([["votes"], ["inscrits"]]);
  for await (const entries of stream) {
    if (entries[0].versionstamp !== null && !votes_versionstamp.includes(entries[0].versionstamp)) {
      console.log('Vote changed');
      votes_versionstamp.push(entries[0].versionstamp);
      if (votes_versionstamp.length > MAX_VERSIONSTAMP_HISTORY) {
          votes_versionstamp.shift(); // Remove the oldest element
      }
      console.debug("Emitting votes...", entries[0].value);
      io.sockets.emit("votes", entries[0].value);
    }
    if (entries[1].versionstamp !== null && !votes_versionstamp.includes(entries[1].versionstamp)) {
      console.log('Inscrits changed');
      votes_versionstamp.push(entries[1].versionstamp);
      if (votes_versionstamp.length > MAX_VERSIONSTAMP_HISTORY) {
          votes_versionstamp.shift(); // Remove the oldest element
      }
      console.debug("Emitting inscrits...", entries[1].value);
      io.sockets.emit("inscrits", entries[1].value);
    }
  }
});

// Handle disconnection
io.on("disconnect", () => {
  console.log("User disconnected");
});

console.log("Express http server started...");
