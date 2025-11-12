const request = require('supertest');
const app = require('../app');

describe('Testes da API de Autenticação e Produtos', () => {
    let token;
    let newToken; 

    test('GET /produtos deve retornar 401 (Não autorizado) se o token não for fornecido', async () => {
        const res = await request(app).get('/produtos');
        expect(res.statusCode).toEqual(401);
        expect(res.body).toHaveProperty('msg', 'Não autorizado');
    });

   
    test('GET /produtos deve retornar 401 (Token inválido) se o token for inválido', async () => {
        const res = await request(app)
            .get('/produtos')
            .set('Authorization', 'Bearer 123456789'); 
        expect(res.statusCode).toEqual(401);
        expect(res.body).toHaveProperty('msg', 'Token inválido');
    });

    test('POST /usuarios/login deve retornar 200 e um token', async () => {
        const res = await request(app)
            .post('/usuarios/login')
            .send({
                usuario: 'email@exemplo.com', 
                senha: 'abcd1234'
            });
        
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('token');
        
        token = res.body.token; 
    });

    test('GET /produtos deve retornar 200 com um token válido', async () => {
        const res = await request(app)
            .get('/produtos')
            .set('Authorization', `Bearer ${token}`); 
        
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBe(true); 
    });

    test('POST /usuarios/renovar deve retornar 200 e um novo token', async () => {
        const res = await request(app)
            .post('/usuarios/renovar')
            .set('Authorization', `Bearer ${token}`); 
        
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('token');
        
        newToken = res.body.token;
        expect(newToken).not.toEqual(token);
    });


    test('GET /produtos deve retornar 200 com o novo token (renovado)', async () => {
        const res = await request(app)
            .get('/produtos')
            .set('Authorization', `Bearer ${newToken}`); 
        
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBe(true);
    });
});