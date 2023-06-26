const chai = require("chai")
const expect = chai.expect
const request = require('chai-http');
const app = require('../../index');
const { it } = require("mocha");
const URL = '/api/v1'

chai.use(request)
const userData = {
    fullName: 'Mr Tester',
    accountNumber: '21939218',
    emailAddress: 'tester@mail.com',
    registrationNumber: '1010101010',
    userName: 'yaboitester',
    password: 'goodolpassword'
}


describe('Account controller test', () => {
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

    it('should login successfully and return token', async () => {
        expect(token).to.not.be.null
    })
    it('should return error when login is invalid', async () => {
        const res = await chai
            .request(app)
            .post(`${URL}/account/login`)
            .send({ username: userData.userName, password: 'invalidpass' })
        expect(res).to.have.status(400)
        expect(res.body.message).to.equal("Invalid username/password")
    })

    it('should create new account', async () => {
        const data = {
            userName: "user1",
            password: "pass",
        }

        const res = await chai.request(app)
            .post(`${URL}/account`)
            .send(data)
            .set('Authorization', `Bearer ${token}`)
        expect(res).to.have.status(201)
        expect(res).to.be.an("object")

        const deleteData = await chai.request(app)
            .delete(`${URL}/account/${res.body.data.accountId}`)
            .set('Authorization', `Bearer ${token}`)
        expect(deleteData).to.have.status(200)
    })

    it('should return account data based on id', async () => {
        const allAcc = await chai
            .request(app)
            .get(`${URL}/account`)
            .set('Authorization', `Bearer ${token}`)
            expect(allAcc).to.have.status(200)
    
        accountId = allAcc.body.data[0].accountId
        const res = await chai
            .request(app)
            .get(`${URL}/account/${accountId}`)
            .set('Authorization', `Bearer ${token}`)

        expect(res).to.have.status(200)
        expect(res.body.data).to.be.an('object')
    })
    it('should return all account data', async () => {
        const res = await chai
            .request(app)
            .get(`${URL}/account`)
            .set('Authorization', `Bearer ${token}`)

        expect(res).to.have.status(200)
        expect(res.body.data).to.be.an('array')
    })

    it('should delete user by id', async () => {
        const data = {
            userName: "user1",
            password: "pass",
        }

        const create = await chai.request(app)
            .post(`${URL}/account`)
            .send(data)
            .set('Authorization', `Bearer ${token}`)
        expect(create).to.have.status(201)
        expect(create).to.be.an("object")

        const res = await chai.request(app)
            .delete(`${URL}/account/${create.body.data.accountId}`)
            .set('Authorization', `Bearer ${token}`)
        expect(res).to.have.status(200)
        expect(res.body.message).to.equal(`Successfully deleted account with id : ${create.body.data.accountId}`)
    })

    it('should update password', async () => {
        const data = {
            userName: "user1",
            password: "pass",
        }

        const create = await chai.request(app)
            .post(`${URL}/account`)
            .send(data)
            .set('Authorization', `Bearer ${token}`)
        expect(create).to.have.status(201)
        expect(create).to.be.an("object")

        const res = await chai.request(app)
        .patch(`${URL}/account/${create.body.data.accountId}`)
        .send({password: "newpass"})
        .set('Authorization', `Bearer ${token}`)

        expect(res).to.have.status(200)
        expect(res.body.message).to.equal('Password successfully updated')

        const deleteData = await chai.request(app)
            .delete(`${URL}/account/${create.body.data.accountId}`)
            .set('Authorization', `Bearer ${token}`)
        expect(deleteData).to.have.status(200)
    })

})