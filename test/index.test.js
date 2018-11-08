const { Application } = require('probot')
const myProbotApp = require('..')

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

  describe('adds assignees to issue when a /random comment is created', () => {
    test('when a maintainer is specified in a comment', async () => {
      const issueCommentCreatedPayload = require('./fixtures/issue-comment.created.json')
      issueCommentCreatedPayload.comment.body = '/random'

      await app.receive({
        name: 'issue_comment.created',
        payload: issueCommentCreatedPayload
      })

      expect(github.issues.addAssigneesToIssue).toHaveBeenCalledWith({
        number: 2,
        owner: 'hogesuke',
        repo: 'random-assign',
        assignees: ['hogesuke2']
      })
    })

    test('when a maintainer is not specified in a comment', async () => {
      const issueCommentCreatedPayload = require('./fixtures/issue-comment.created.json')
      issueCommentCreatedPayload.comment.body = '/random fugasuke1 fugasuke2'

      await app.receive({
        name: 'issue_comment.created',
        payload: issueCommentCreatedPayload
      })

      expect(github.issues.addAssigneesToIssue).toHaveBeenCalledWith({
        number: 2,
        owner: 'hogesuke',
        repo: 'random-assign',
        assignees: ['fugasuke2']
      })
    })
  })
})
