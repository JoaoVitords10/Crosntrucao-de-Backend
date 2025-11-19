const supertest = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const request = supertest(app);

describe('/usuarios', () => {
  let id;
  let token;

  /* Aumenta para 30 segundos para garantir conexão*/
  jest.setTimeout(30000);

  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(`mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_HOST}/${process.env.MONGODB_DATABASE}`);
    }
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  test('POST /usuarios deve retornar 201 e um JSON', async () => {
    const response = await request.post('/usuarios')
      .send({ email: "usuario@email.com", senha: "abcd1234" });
    expect(response.status).toBe(201);
    expect(response.type).toBe('application/json');
    expect(response.body).toHaveProperty('_id');
    expect(response.body).toHaveProperty('email', 'usuario@email.com');
    id = response.body._id;
  });

  test('POST /usuarios sem JSON deve retornar 422', async () => {
    const response = await request.post('/usuarios');
    expect(response.status).toBe(422);
    expect(response.type).toBe('application/json');
    expect(response.body).toHaveProperty('msg', 'Email e Senha são obrigatórios');
  });

  test('POST /usuarios/login deve retornar 200 e token', async () => {
    const response = await request.post('/usuarios/login')
      .send({ usuario: "usuario@email.com", senha: "abcd1234" });
    expect(response.status).toBe(200);
    expect(response.type).toBe('application/json');
    expect(response.body).toHaveProperty('token');
    token = response.body.token;
  });

  test('POST /usuarios/login inválido deve retornar 401', async () => {
    const response = await request.post('/usuarios/login');
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('msg', 'Credenciais inválidas');
  });

  test('POST /usuarios/renovar com token deve retornar 200', async () => {
    const response = await request.post('/usuarios/renovar')
      .set('Authorization', token);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  });

  test('POST /usuarios/renovar token inválido deve retornar 401', async () => {
    const response = await request.post('/usuarios/renovar')
      .set('Authorization', 'Bearer 123456789');
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('msg', 'Token inválido');
  });

  test('DELETE /usuarios/:id deve retornar 204', async () => {
    const response = await request.delete(`/usuarios/${id}`)
      .set('Authorization', token);
    expect(response.status).toBe(204);
  });
});