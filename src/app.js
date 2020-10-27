const express = require("express");
const cors = require("cors");

const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

/**
 * Valida se o Id informado e do tipo UUID.
 * 
 * @param {*} request 
 * @param {*} response 
 * @param {*} next 
 */
function validateRepositoryId(request, response, next) {
  const { id } = request.params;

  if (!isUuid(id)) {
    return response.status(400).json({ error: "Repositorie id invalid." });
  }

  return next();
}

app.use("/repositories/:id", validateRepositoryId);

/**
 * Retornar todas os repositórios.
 * 
 */
app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

/**
 * Salva uma instância de repositório.
 * 
 */
app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repositorie = { id: uuid(), title, url, techs, likes: 0 };

  repositories.push(repositorie);

  return response.json(repositorie);
});

/**
 * Altera uma instância de repositório.
 * 
 */
app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repoIndex = repositories.findIndex(repositorie => repositorie.id == id);

  if (repoIndex < 0) {
    return response.status(400).json({ error: "Repository not found." });
  }

  const repositorie = { id, title, url, techs, likes: repositories[repoIndex].likes };

  repositories[repoIndex] = repositorie;

  return response.json(repositorie);
});

/**
 * Excluiu uma instância de repositório.
 * 
 */
app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repoIndex = repositories.findIndex(repositorie => repositorie.id == id);

  if (repoIndex < 0) {
    return response.status(400).json({ error: "Repository not found." });
  }

  repositories.splice(repoIndex, 1);

  return response.status(204).send();
});

/**
 *  Aumentar o número de likes do repositório.
 * 
 */
app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repoIndex = repositories.findIndex(repositorie => repositorie.id == id);

  if (repoIndex < 0) {
    return response.status(400).json({ error: "Repository not found." });
  }

  repositories[repoIndex].likes += 1;

  return response.json(repositories[repoIndex]);
});

module.exports = app;
