const { Application } = require('probot')
const myProbotApp = require('..')

const issueCommentCreatedPayload = require('./fixtures/issue-comment.created.json')

describe('My Probot app', () => {
  let app, github

  beforeEach(() => {
    const mockMath = Object.create(global.Math)
    mockMath.random = jest.fn().mockReturnValue(0.5)
    global.Math = mockMath

    app = new Application()
    app.load(myProbotApp)

    github = {
      repos: {
        getContent: jest.fn().mockReturnValue(Promise.resolve({
          data: {
            content: Buffer.from(`maintainers:\n  - hogesuke1\n  - hogesuke2`).toString('base64')
          }
        }))
      },
      issues: {
        addAssigneesToIssue: jest.fn().mockReturnValue(Promise.resolve({}))
      }
    }

    app.auth = () => Promise.resolve(github)
  })

  test('adds assignees to issue when a comment is created', async () => {
    await app.receive({
      name: 'issue_comment.created',
      payload: issueCommentCreatedPayload
    })

    expect(github.issues.addAssigneesToIssue).toHaveBeenCalledWith({
      number: 2,
      owner: 'hogesuke',
      repo: 'random-assign',
      assignees: [ 'hogesuke2' ]
    })
  })
})
