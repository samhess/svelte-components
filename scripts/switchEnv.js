import {readFile, writeFile} from 'fs/promises'
import {exec as execCb} from 'child_process'
import {promisify} from "node:util"
const exec = promisify(execCb)

const env = process.argv[2] ?? 'dev'

const prismaConfigPath = '../prisma/schema.prisma'
const packageJsonPath = '../package.json'

let prismaConfig = await readFile(prismaConfigPath, {encoding:'utf-8'})
let packageJson = JSON.parse(await readFile(packageJsonPath, {encoding:'utf-8'}))

if (env==='dev') {
  if (prismaConfig.includes('postgres')) {
    prismaConfig = prismaConfig.replace('postgres','sqlite')
    await writeFile(prismaConfigPath, prismaConfig, {encoding:'utf-8'})
  }
  if (packageJson.scripts.postinstall) {
    delete packageJson.scripts.postinstall
    await writeFile(packageJsonPath, JSON.stringify(packageJson,null,4), {encoding:'utf-8'})
  }
}

if (env==='prod') {
  if (prismaConfig.includes('sqlite')) {
    prismaConfig = prismaConfig.replace('sqlite','postgres')
    await writeFile(prismaConfigPath, prismaConfig, {encoding:'utf-8'})
  }
  if (!packageJson.scripts.postinstall) {
    packageJson.scripts.postinstall = "prisma generate"
    await writeFile(packageJsonPath, JSON.stringify(packageJson,null,4), {encoding:'utf-8'})
  }
}

const {error, stdout, stderr} = await exec('cd .. && npx prisma generate')
console.log(stdout)

  