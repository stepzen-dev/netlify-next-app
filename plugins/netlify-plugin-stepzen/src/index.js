// This is the main file for the Netlify Build plugin stepzen.
const chalk = require('chalk')
const stepzen = require('@stepzen/sdk')

async function run(args) {
  // args
  console.log('args', args)

  let stepzenSecret = ''
  let stepzenAccount = ''
  let stepzenSchema = 'schema'
  let stepzenEndpoint = 'endpoint'
  let stepzenConfiguration = 'configuration'
  let stepzenFolder = 'netlify'
  let buildEnv = 'react'

  if (args.packageJson.dependencies.next) {
    buildEnv = 'next'
    stepzenAccount =
      args.netlifyConfig.build.environment.NEXT_PUBLIC_STEPZEN_ACCOUNT
    stepzenSchema =
      args.netlifyConfig.build.environment.NEXT_PUBLIC_STEPZEN_SCHEMA ||
      'schema'
    stepzenEndpoint =
      args.netlifyConfig.build.environment.NEXT_PUBLIC_STEPZEN_ENDPOINT ||
      'endpoint'
    stepzenConfiguration =
      args.netlifyConfig.build.environment.STEPZEN_CONFIGURATIONSETS ||
      'configuration'
    stepzenFolder =
      args.netlifyConfig.build.environment.NEXT_PUBLIC_STEPZEN_FOLDER ||
      'netlify'
  } else if (args.packageJson.dependencies.gatsby) {
    buildEnv = 'gatsby'
    stepzenSecret = args.netlifyConfig.build.environment.STEPZEN_API_KEY
    stepzenAccount = args.netlifyConfig.build.environment.STEPZEN_ACCOUNT
    stepzenSchema =
      args.netlifyConfig.build.environment.STEPZEN_SCHEMA || 'schema'
    stepzenEndpoint =
      args.netlifyConfig.build.environment.STEPZEN_ENDPOINT || 'endpoint'
    stepzenConfiguration =
      args.netlifyConfig.build.environment.STEPZEN_CONFIGURATIONSETS ||
      'configuration'
    stepzenFolder =
      args.netlifyConfig.build.environment.STEPZEN_FOLDER || 'netlify'
  } else {
    buildEnv = 'react'
  }

  console.log(
    chalk.white(
      `pushing schema to ${stepzenFolder}/${stepzenSchema}, and deploying to ${stepzenFolder}/${stepzenEndpoint} using ${stepzenFolder}/${stepzenConfiguration}`,
    ),
  )
  const client = await stepzen.client({
    account: stepzenAccount,
    adminkey: stepzenSecret,
  })
  await client.upload.configurationset(
    `${stepzenFolder}/${stepzenConfiguration}`,
    'stepzen/config.yaml',
  )
  await client.upload.schema(`${stepzenFolder}/${stepzenSchema}`, 'stepzen')
  await client.deploy(`${stepzenFolder}/${stepzenEndpoint}`, {
    configurationsets: [
      `${stepzenFolder}/${stepzenConfiguration}`,
      'stepzen/default',
    ],
    schema: `${stepzenFolder}/${stepzenSchema}`,
  })
}

module.exports = {
  async onPreBuild(args) {
    console.log('PreBuild')
    await run(args)
    args.utils.status.show({ summary: 'Success!' })
  },
  async onBuild(args) {
    console.log('Build')
    args.utils.status.show({ summary: 'Success!' })
  },
  async onPostBuild(args) {},
  async onSuccess(args) {},
  async onError(args) {},
  async onEnd(args) {},
}
