# j2a

json to any

- [x] typescript
- [x] dart
- [ ] java
- [ ] swift

## demo

- [json2dart.surge.sh](//json2dart.surge.sh)
- [json2ts.surge.sh](//json2ts.surge.sh/)

## directory

```
j2a
  package
    core          core
    j2a-cli       cli
    json2dart     cra
    json2ts       next
```

## installation

```sh
$ yarn global add @j2a/cli # or npm i -g @j2a/cli
```

## usage

```sh
$ j2a -i path/to/json -o path/to/dist -t typescript # convert json to any

$ j2a --help
Usage: j2a [options]

convert path/to/*.json to path/to/*.any

Options:
  -V, --version        output the version number
  -i, --input <path>   json source directory path
  -o, --output <path>  export directory path
  -t, --type <type>    typescript dart (default: "typescript")
  -w, --watch          watch mode
  -h, --help           display help for command
```
