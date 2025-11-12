const supertest = require('supertest');
const app = require('../app');
const request = supertest(app);

let id;

describe('API de Produtos', () => {

    test('POST /produtos (sucesso)', async () => {
        const res = await request.post('/produtos')
            .send({ nome: 'Laranja', preco: 10.0 });
        
        expect(res.status).toBe(201);
        expect(res.type).toBe('application/json');
        expect(res.body).toHaveProperty('_id');
        expect(res.body.nome).toBe('Laranja');
        expect(res.body.preco).toBe(10.0);


        id = res.body._id;
    });

    test('POST /produtos (validação)', async () => {
        const res = await request.post('/produtos').send({}); 
        expect(res.status).toBe(422);
        expect(res.type).toBe('application/json');
        expect(res.body.msg).toBe('Nome e preço do produto são obrigatórios');
    });

    test('GET /produtos', async () => {
        const res = await request.get('/produtos');
        expect(res.status).toBe(200);
        expect(res.type).toBe('application/json');
        expect(Array.isArray(res.body)).toBe(true);
    });

    test('GET /produtos/:id (sucesso)', async () => {
        const res = await request.get(`/produtos/${id}`);
        expect(res.status).toBe(200);
        expect(res.type).toBe('application/json');
        expect(res.body._id).toBe(id);
        expect(res.body.nome).toBe('Laranja');
    });

    test('GET /produtos/0 (parâmetro inválido)', async () => {
        const res = await request.get('/produtos/0');
        expect(res.status).toBe(400);
        expect(res.body.msg).toBe('Parâmetro inválido');
    });

    test('GET /produtos/000000000000000000000000 (não encontrado)', async () => {
        const res = await request.get('/produtos/000000000000000000000000');
        expect(res.status).toBe(404);
        expect(res.body.msg).toBe('Produto não encontrado');
    });

    test('PUT /produtos/:id (sucesso)', async () => {
        const res = await request.put(`/produtos/${id}`)
            .send({ nome: 'Laranja Pera', preco: 18.0 });
        
        expect(res.status).toBe(200);
        expect(res.type).toBe('application/json');
        expect(res.body._id).toBe(id);
        expect(res.body.nome).toBe('Laranja Pera');
        expect(res.body.preco).toBe(18.0);
    });

    test('PUT /produtos/:id (validação)', async () => {
        const res = await request.put(`/produtos/${id}`).send({});
        expect(res.status).toBe(422);
        expect(res.body.msg).toBe('Nome e preço do produto são obrigatórios');
    });

    test('PUT /produtos/0 (parâmetro inválido)', async () => {
        const res = await request.put('/produtos/0');
        expect(res.status).toBe(400);
        expect(res.body.msg).toBe('Parâmetro inválido');
    });

    test('PUT /produtos/000000000000000000000000 (não encontrado)', async () => {
        const res = await request.put('/produtos/000000000000000000000000')
            .send({ nome: 'Laranja Fantasma', preco: 99 });
        expect(res.status).toBe(404);
        expect(res.body.msg).toBe('Produto não encontrado');
    });

    test('DELETE /produtos/:id (sucesso)', async () => {
        const res = await request.delete(`/produtos/${id}`);
        expect(res.status).toBe(204);
        expect(res.body).toEqual({});
    });

    test('DELETE /produtos/0 (parâmetro inválido)', async () => {
        const res = await request.delete('/produtos/0');
        expect(res.status).toBe(400);
        expect(res.body.msg).toBe('Parâmetro inválido');
    });

    test('DELETE /produtos/:id (não encontrado)', async () => {
        const res = await request.delete(`/produtos/${id}`);
        expect(res.status).toBe(404);
        expect(res.body.msg).toBe('Produto não encontrado');
    });
});