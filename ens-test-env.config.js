require('dotenv').config({ path: process.env.INIT_CWD + '/.env.local' })
require('dotenv').config({
  path: process.env.INIT_CWD + '/.env',
  override: true,
})
require('dotenv').config({
  path: process.env.INIT_CWD + '/.env.development.local',
  override: true,
})

process.env.ADDRESS_ETH_REGISTRAR = '0xE33B47752dd355Cd6E2b85A036Bb108c86FEa6AF'
process.env.ADDRESS_NAME_WRAPPER = '0x2285865fd0C40534555eF0744008867Cf06fdf6C'
process.env.BATCH_GATEWAY_URLS = JSON.stringify([
  // 'https://universal-offchain-unwrapper.ens-cf.workers.dev/',
])

/**
 * @type {import('@ensdomains/ens-test-env').ENSTestEnvConfig}
 **/
module.exports = {
  deployCommand: 'pnpm hardhat deploy',
  buildCommand: 'pnpm build:glocal',
  scripts: [
    {
      command: 'pnpm start',
      name: 'nextjs',
      prefixColor: 'magenta.bold',
    },
    {
      command: `pnpm wait-on http://localhost:3000 && ${
        process.env.CI ? 'pnpm synpress:ci' : 'pnpm synpress:start'
      }`,
      name: 'synpress',
      prefixColor: 'yellow.bold',
      env: process.env,
      finishOnExit: true,
    },
  ],
  paths: {
    data: './data',
  },
}
