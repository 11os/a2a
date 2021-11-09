import { generate, ParseTypeEnum } from '@a2a/sdk'
import * as fs from 'fs'

export const fileSuffix = {
  [ParseTypeEnum.typescript]: 'ts',
  [ParseTypeEnum.dart]: 'dart'
}

export function j2a(input: fs.PathLike, output: fs.PathLike, type: ParseTypeEnum) {
  try {
    // input dir
    const inputFiles: fs.Dirent[] = fs.readdirSync(input, {
      withFileTypes: true
    })
    // console.log(`inputFiles = `, inputFiles);
    // output dir
    // const outputFiles: fs.Dirent[] = fs.readdirSync(output, {
    //   withFileTypes: true
    // })
    // console.log(`outputFiles =`, outputFiles);
    // start
    inputFiles.forEach((file) => {
      j2aFile(input, file.name, output, type)
    })
  } catch (error) {
    console.log(error)
  }
}

export function j2aFile(input: fs.PathLike, fileName: string, output: fs.PathLike, type: ParseTypeEnum) {
  try {
    const json = fs.readFileSync(`${input}/${fileName}`, 'utf8')
    const prefix = fileName.split('.')[0]
    const result = generate({
      json,
      clazz: prefix,
      type
    })
    fs.writeFileSync(`${output}/${prefix}.${fileSuffix[type]}`, result)
    console.log(`generate ${output}/${prefix}.${fileSuffix[type]} success`)
  } catch (error) {
    console.log(error)
  }
}
