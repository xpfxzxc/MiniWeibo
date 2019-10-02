# Mini Weibo

## 描述

一个基于 NestJS 框架的练手项目。

## 安装

```
$ npm install
```

## 配置

1. 添加名为 `miniweibo` 的数据库，准备好一个开启了 SMTP 的邮箱账号。
2. 在根目录下创建一个 `.env` 文件，根据 `src/config` 里文件中出现的环境变量添加内容。

## 运行

```
# 以 watch mode 开发
$ npm run start:dev
```

## 测试

尽管开发过程中创建了测试文件（`.spec.ts`），但始终未修改过它们。因此运行 `$ npm run test` 之类的命令可能测试不通过。
