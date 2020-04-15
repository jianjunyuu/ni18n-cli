# ni18n-cli
主要提供一下功能：

  1. 读取当前目录下的语言包并解析到指定目录
  2. 读取远程文件并解析到指定目录
  3. 支持第三方接口，以配置文件形式`.ni18nrc`请求数据，解析到指定目录
## Installing

For the latest stable version:

```bash
npm install -g ni18n-cli
```

## Documentation

## Building

Clone a copy of the repo:

```bash
git clone https://github.com/mryujianjun/ni18n-cli.git
```

## Usage

```bash
ni18n [command] [option]
```

#### Commands:
 - Major 主命令（可执行本地文件`language.xlsx`,或者执行配置文件`.ni18nrc`;如果同时存在后者优先级大于前者）<br />
```bash
> ni18n [option]
```
 - Cpath 读取本地文件路径<br />
  `eg: ni18n <path> [option]`
```bash
> ni18n ./**/*.<excel|csv>
``` 
 - Curl 读取远程文件路径链接<br />
  `eg: ni18n curl <url> [option]`
```bash
> ni18n curl https://example.com/excel.xlsx
``` 
 - init 初始化配置文件`.ni18nrc`, 目前仅提供给第三方接口方式<br />
```bash
> ni18n init
``` 

#### Options:
```bash
-v, --version           output the current version
-t, --type <type>       specify the file output type. (default: "json")
-l, --lang <languages>  list of languages. (default: "zh-CN,en")
-d, --dest <directory>  output directory. (default: "lang")
--no-clear              don't clear directory.
-h, --help              display help for command
```

#### .ni18nrc（读取配置文件情况下：`-l, -lang` option 将失效）
```bash
{
  "name": <project name>, // 项目名，可随意填写
  "token": <Authorization>, // 请求接口的签名
  "lang": { // 导出的语言包：key会作为导出文件的文件名，value即返回JSON数据的接口（目前仅支持json）
    "zh-CN": "https://example/**/zh-CN/**",
    "en": "https://example/**/en/**"
    ...more
  }
}
```
