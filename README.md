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
$ j2a -i path/json/input -o path/output -t typescript # convert json to any

$ j2a --help
Usage: j2a [options]

Options:
  -V, --version        output the version number
  -i, --input <path>   json source directory path
  -o, --output <path>  export directory path
  -t, --type <type>    typescript(default) or dart
  -h, --help           display help for command
```
