import {readFile, writeFile} from 'fs/promises'
const env = process.argv[2] ?? 'dev'

const prismaConfigPath = '../prisma/schema.prisma'
const packageJsonPath = '../package.json'

if (env==='dev') {
  let config = await readFile(prismaConfigPath, {encoding:'utf-8'})
  if (config.includes('postgres')) {
    config = config.replace('postgres','sqlite')
    await writeFile(prismaConfigPath, config, {encoding:'utf-8'})
  }
  let packageJson = await readFile(packageJsonPath, {encoding:'utf-8'})
  const {scripts} = JSON.parse(packageJson)
  if (scripts.postinstall) {
    delete scripts.postinstall
    packageJson.scripts = scripts
    await writeFile(packageJsonPath, JSON.stringify(packageJson,null,2), {encoding:'utf-8'})
  }
}

if (env==='prod') {
  let config = await readFile(prismaConfigPath, {encoding:'utf-8'})
  if (config.includes('sqlite')) {
    config = config.replace('sqlite','postgres')
    await writeFile(prismaConfigPath, config, {encoding:'utf-8'})
  }

  let packageJson = await readFile(packageJsonPath, {encoding:'utf-8'})
  const {scripts} = JSON.parse(packageJson)
  if (!scripts.postinstall) {
    scripts.postinstall = "prisma generate"
    packageJson.scripts = scripts
    await writeFile(packageJsonPath, JSON.stringify(packageJson,null,2), {encoding:'utf-8'})
  }
}