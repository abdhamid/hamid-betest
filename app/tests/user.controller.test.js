const chai = require("chai")
const expect = chai.expect
const request = require('chai-http');
const app = require('../../index');
const URL = '/api/v1'
let token, userId

chai.use(request)
const userData = {
    fullName: 'Mr Tester',
    accountNumber: '21939218',
    emailAddress: 'tester@mail.com',
    registrationNumber: '1010101010',
    userName: 'yaboitester',
    password: 'goodolpassword'
}

describe('User controller test', () => {
    beforeEach(async () => {
        const res = await chai.request(app).post(`${URL}/user`).send(userData)
        expect(res).to.have.status(201)
        userId = res.body.data.userId
    })

    beforeEach(async () => {
        const res = await chai
            .request(app)
            .post(`${URL}/account/login`)
            .send({ username: userData.userName, password: userData.password })
        expect(res).to.have.status(200)
        token = res.body.accessToken
    })

    afterEach(async () => {
        const res = await chai
            .request(app)
            .delete(`${URL}/user/${userId}`)
            .set('Authorization', `Bearer ${token}`)
        expect(res).to.have.status(200)
    })

    it('should create a new user', async () => {
        const data = {
            fullName: 'User 1',
            accountNumber: '1010101010101',
            emailAddress: 'user1@mail.com',
            registrationNumber: '123457832499',
            userName: 'userone',
            password: 'password',
        }

        const res = await chai.request(app)
            .post(`${URL}/user`)
            .send(data)

        expect(res).to.have.status(201)
        expect(res).to.be.an('object')

        const deleteData = await chai
            .request(app)
            .delete(`${URL}/user/${res.body.data.userId}`)
            .set('Authorization', `Bearer ${token}`)
        expect(deleteData).to.have.status(200)
    })

    it('should return error when called with empty body', async () => {
        const data = {}

        const res = await chai.request(app)
            .post(`${URL}/user`)
            .send(data)
    })

    it('should return user data based on id', async () => {
        const res = await chai
            .request(app)
            .get(`/api/v1/user/${userId}`)
            .set('Authorization', `Bearer ${token}`)

        expect(res).to.have.status(200)
    })
    it('should return all users data', async () => {
        const res = await chai
            .request(app)
            .get('/api/v1/user')
            .set('Authorization', `Bearer ${token}`)

        expect(res).to.have.status(200)
        expect(res.body.data).to.be.an('array')
    })
    it('should return user data based on registrationNumber', async () => {
        const res = await chai
            .request(app)
            .get(`/api/v1/user/registration-number/${userData.registrationNumber}`)
            .set('Authorization', `Bearer ${token}`)

        expect(res).to.have.status(200)
    })
    it('should return user data based on account number', async () => {
        const res = await chai
            .request(app)
            .get(`/api/v1/user/account-number/${userData.accountNumber}`)
            .set('Authorization', `Bearer ${token}`)

        expect(res).to.have.status(200)
    })

    it('should create a new user', async () => {
        const data = {
            fullName: 'User 1',
            accountNumber: '1010101010101',
            emailAddress: 'user1@mail.com',
            registrationNumber: '123457832499',
            userName: 'userone',
            password: 'password',
        }

        const create = await chai.request(app)
            .post(`${URL}/user`)
            .send(data)

        expect(create).to.have.status(201)

        const update = {
            fullName: 'User 2'
        }

        const res = await chai.request(app)
        .patch(`${URL}/user/${create.body.data.userId}`)
        .send(update)
        .set('Authorization', `Bearer ${token}`)

        expect(res).to.have.status(200)
        expect(res.body.data.fullName).to.equal(update.fullName)

        const deleteData = await chai
            .request(app)
            .delete(`${URL}/user/${create.body.data.userId}`)
            .set('Authorization', `Bearer ${token}`)
        expect(deleteData).to.have.status(200)
    })

    it('should delete user by id', async () => {
        const data = {
            fullName: 'User 1',
            accountNumber: '1010101010101',
            emailAddress: 'user1@mail.com',
            registrationNumber: '123457832499',
            userName: 'userone',
            password: 'password',
        }

        const create = await chai.request(app)
            .post(`${URL}/user`)
            .send(data)

        expect(create).to.have.status(201)

        const res = await chai
            .request(app)
            .delete(`${URL}/user/${create.body.data.userId}`)
            .set('Authorization', `Bearer ${token}`)
        expect(res).to.have.status(200)
        expect(res.body.message).to.equal(`Successfully deleted user with id : ${create.body.data.userId}`)
    })
    
})