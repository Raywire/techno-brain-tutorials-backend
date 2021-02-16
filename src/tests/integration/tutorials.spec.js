const chai = require('chai')
const chaiHttp = require('chai-http')
const app = require('../../app')

const { expect } = chai
let id

chai.use(chaiHttp)

describe('Tutorials actions', () => {
  it('Should return 201 when a tutorial is created', async () => {
    const res = await chai
      .request(app)
      .post('/api/tutorials')
      .send({
        title: 'React Native',
        description: 'A short course on react native'
      })

    expect(res).to.have.status(201)
    expect(res.body).to.include.keys('statusCode', 'success', 'tutorial')
  })

  it('Should return 200 when tutorials are fetched', async () => {
    const res = await chai
      .request(app)
      .get('/api/tutorials')
    id = res.body.tutorials[0].id

    expect(res).to.have.status(200)
    expect(res.body).to.include.keys('statusCode', 'success', 'tutorials')
  })

  it('Should return 200 when a single tutorial is fetched', async () => {
    const res = await chai
      .request(app)
      .get(`/api/tutorials/${id}`)

    expect(res).to.have.status(200)
    expect(res.body).to.include.keys('statusCode', 'success', 'tutorial')
  })

  it('Should return 404 when a single tutorial does not exist', async () => {
    const res = await chai
      .request(app)
      .get('/api/tutorials/1000000')

    expect(res).to.have.status(404)
    expect(res.body).to.include.keys('statusCode', 'success', 'errors')
  })

  it('Should return 200 when a tutorial is updated', async () => {
    const res = await chai
      .request(app)
      .put(`/api/tutorials/${id}`)
      .send({
        title: 'React Native Updated',
        description: 'A short course on react native',
        published: false
      })

    expect(res).to.have.status(200)
    expect(res.body).to.include.keys('statusCode', 'success', 'tutorial')
  })

  it('Should return 204 when a tutorial is deleted', async () => {
    const res = await chai
      .request(app)
      .delete(`/api/tutorials/${id}`)

    expect(res).to.have.status(204)
  })
})
