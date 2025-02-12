import {readFile, writeFile} from 'fs/promises'
import {exec as execCb} from 'child_process'
import {promisify} from 'node:util'
import {resolve} from 'node:path'
const exec = promisify(execCb)

const env = process.argv[2] ?? 'dev'

const prismaConfigPath = resolve(import.meta.dirname,'..','prisma','schema.prisma')
const packageJsonPath = resolve(import.meta.dirname,'..','package.json') 

let prismaConfig = await readFile(prismaConfigPath, {encoding:'utf-8'})
let packageJson = JSON.parse(await readFile(packageJsonPath, {encoding:'utf-8'}))

if (['development','dev','d'].includes(env)) {
  if (prismaConfig.includes('postgres')) {
    prismaConfig = prismaConfig.replace('postgres','sqlite')
    await writeFile(prismaConfigPath, prismaConfig, {encoding:'utf-8'})
    console.info('✔ Set database provider to sqlite')
  }
  if (packageJson.scripts.postinstall) {
    delete packageJson.scripts.postinstall
    await writeFile(packageJsonPath, JSON.stringify(packageJson,null,4), {encoding:'utf-8'})
    console.info('✔ Removed postinstall script')
  }
}

if (['production','prod','p'].includes(env)) {
  if (prismaConfig.includes('sqlite')) {
    prismaConfig = prismaConfig.replace('sqlite','postgres')
    await writeFile(prismaConfigPath, prismaConfig, {encoding:'utf-8'})
    console.info('✔ Set database provider to postgres')
  }
  if (!packageJson.scripts.postinstall) {
    packageJson.scripts.postinstall = "prisma generate"
    await writeFile(packageJsonPath, JSON.stringify(packageJson,null,4), {encoding:'utf-8'})
    console.info('✔ Added postinstall script')
  }
}

const {stdout} = await exec('npm x prisma generate', {
  cwd: resolve(import.meta.dirname,'..'), 
  shell:'pwsh.exe'
})
if (stdout) {
  console.info('✔ Regenerated Prisma Client')
}



