// This is the main file for the Netlify Build plugin stepzen.
const chalk = require('chalk')
const stepzen = require('@stepzen/sdk')

module.exports = {
  async onPreBuild( args ) {
    console.log('PreBuild')

    // Optional Plugin Values

    // args
    console.log('args', args)

    // end Optional Plugin Values

    args.utils.status.show({ summary: 'Success!' })
    let buildEnv = "react"

    // Better environment variables to set as conditional?


      console.log('args.packageJson.dependencies', args.packageJson.dependencies);
    if(!args.packageJson.dependencies.next) {
      console.log('its not here')
    }
    if(args.packageJson.dependencies.next) {
      buildEnv = "next"
    }
    if(args.packageJson.dependencies.gatsby) {
      buildEnv = "gatsby"
    }
  },
  async onBuild( args ) {
    console.log('buildEnv', buildEnv);
    console.log('Build')
    if(buildEnv = "react") {
      if(!args.netlifyConfig.build.environment.STEPZEN_ADMIN_KEY) {
        return args.utils.build.failBuild('Failed finding the STEPZEN_ADMIN_KEY in the Netlify Environment Variables.')
      }
      const stepzenSecret = args.netlifyConfig.build.environment.STEPZEN_ADMIN_KEY
      if(!args.netlifyConfig.build.environment.STEPZEN_ACCOUNT) {
        return utils.build.failBuild('Failed finding the STEPZEN_ADMIN_KEY in the Netlify Environment Variables.')
      }
    }
    if(buildEnv = "next") {
      if(!args.netlifyConfig.build.environment.NEXT_PUBLIC_STEPZEN_API_KEY) {
        return args.utils.build.failBuild('Failed finding the NEXT_PUBLIC_STEPZEN_API_KEY in the Netlify Environment Variables.')
      }
      if(!args.netlifyConfig.build.environment.NEXT_PUBLIC_STEPZEN_URI) {
        return utils.build.failBuild('Failed finding the NEXT_PUBLIC_STEPZEN_URI in the Netlify Environment Variables.')
      }
    }
    const stepzenAccount = args.netlifyConfig.build.environment.STEPZEN_ACCOUNT
    const stepzenSchema = args.netlifyConfig.build.environment.STEPZEN_SCHEMA_NAME || 'schema'
    const stepzenEndpoint = args.netlifyConfig.build.environment.STEPZEN_ENDPOINT || 'endpoint'
    const stepzenConfiguration = args.netlifyConfig.build.environment.STEPZEN_CONFIGURATIONSETS || 'configuration'
    const stepzenFolder = args.netlifyConfig.build.environment.STEPZEN_FOLDER || 'netlify'

    console.log(chalk.white(`using ${stepzenAccount}`))
    console.log('update for testing deploy')
    console.log(chalk.white(`pushing schema to ${stepzenFolder}/${stepzenSchema}, and deploying to ${stepzenFolder}/${stepzenEndpoint} using ${stepzenFolder}/${stepzenConfiguration}`))
    const client = await stepzen.client({
      account: stepzenAccount,
      adminkey: stepzenSecret,
    })
    await client.upload.schema(`${stepzenFolder}/${stepzenSchema}`, "stepzen")
    await client.deploy(
      `${stepzenFolder}/${stepzenEndpoint}`,
      {
        configurationsets: [`${stepzenFolder}/${stepzenConfiguration}`],
        schema: `${stepzenFolder}/${stepzenSchema}`,
      },
    )
    args.utils.status.show({summary: 'Success!'})
  },
  async onPostBuild( args ) {},
  async onSuccess( args ) {},
  async onError( args ) {},
  async onEnd( args ) {},
}
