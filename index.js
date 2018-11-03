module.exports = app => {
  // Your code here
  app.log('Yay, the app was loaded!')

  app.on('issue_comment.created', async context => {
    if (context.isBot) { return; }

    const contents = context.payload.comment.body.split(' ');
    const command  = contents.shift();
    const users    = contents;

    if (!/^\/random/.test(command) && users.length <= 0) { return; }

    const randomUser = users[Math.floor(Math.random() * users.length)]

    console.log('randomUser', randomUser);

    // const issueComment = context.issue({ body: 'New comment' })
    // return context.github.issues.createComment(issueComment)

    return context.github.issues.addAssigneesToIssue(context.issue({assignees: [randomUser]}));
  })

  // For more information on building apps:
  // https://probot.github.io/docs/

  // To get your app running against GitHub, see:
  // https://probot.github.io/docs/development/
}
