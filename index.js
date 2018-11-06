module.exports = app => {
  app.on('issue_comment.created', async context => {
    if (context.isBot) {
      return
    }

    const contents = context.payload.comment.body.split(' ')
    const command = contents.shift()

    if (!/^\/random/.test(command)) {
      return
    }

    const config = await context.config('config.yml')
    const maintainers = contents.length > 0 ? contents : config.maintainers

    if (maintainers.length <= 0) {
      return
    }

    const randomMaintainer = maintainers[Math.floor(Math.random() * maintainers.length)]

    return context.github.issues.addAssigneesToIssue(
      context.issue({
        assignees: [ randomMaintainer ]
      })
    )
  })
}
