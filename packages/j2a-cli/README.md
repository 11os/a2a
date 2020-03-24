# j2a-cli

json to any

```sh

$ ts-node src/index.ts --help
Usage: index [options]

Options:
  -V, --version        output the version number
  -i, --input <path>   json source directory path
  -o, --output <path>  export directory path
  -t, --type <type>    typescript(default) or dart
  -h, --help           display help for command

$ ts-node src/index.ts -i demo/input -o demo/output -t typescript
$ ts-node src/index.ts -i demo/input -o demo/output -t dart
```
