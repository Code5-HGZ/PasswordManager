# 莽夫的密码管理器 | MF PasswordManager
## 简介

这是一个使用 `Python3.7 + Django` 框架构建的密码管理器，支持密码的`增` `删` `查` `改` 以及对密码进行简单的`分类管理`。

![](https://github.com/Code5-HGZ/PasswordManager/blob/master/images/1.png)



## 支持的平台

由于使用Python的Web框架 `Django` 来构建，所以任何可以正常运行`Django`的平台都可以使用`莽夫的密码管理器`



## 如何安装使用

#### Windows平台

目前我已经在`Windows`平台下打包了`莽夫密码管理器`，如果你使用的是`Windows`操作系统，你可以下载项目中`package/Windows.zip`压缩包。

将该压缩包下载到您的`Windows`后解压，双击`start.bat`批处理脚本，此时将会打开一个`cmd`窗口并运行`莽夫的密码管理器`，接下来您可以在浏览器访问`127.0.0.1:1234`来使用`莽夫的密码管理器`。

如果你您不想看到这个`cmd`窗口，您可以双击`startToBackstage.vbs`VB脚本来后台运行`莽夫的密码管理器`。

`莽夫的密码管理器`默认使用端口`1234`， 如果你想更改端口，请编辑`start.bat`将

```powershell
python PasswordManager\manage.py runserver 0.0.0.0:1234
```

修改为

```powershell
python PasswordManager\manage.py runserver 0.0.0.0:您要设置的端口
```

#### MAC OS

在`MacOS` 平台下，我也打包了`莽夫的密码管理器`，如果你使用`MacOS`系统，您可以下载项目中`package/MacOS.zip`压缩包。

将该压缩包下载到您的`MacOS`后解压，切换到解压后的目录中，使用命令`/bin/bash ./start.sh`运行shell脚本，此时`莽夫的密码管理器`将会开启，接下来您可以在浏览器访问`127.0.0.1:1234`来使用`莽夫的密码管理器`。

如果你您想在后台运行`莽夫的密码管理器`，使用命令`/bin/bash ./startToBackstage.sh`，将`莽夫的密码管理器`开启并在后台运行

`莽夫的密码管理器`默认使用端口`1234`， 如果你想更改端口，请编辑`start.sh`将

```bash
python PasswordManager\manage.py runserver 0.0.0.0:1234
```

修改为

```bash
python PasswordManager\manage.py runserver 0.0.0.0:您要设置的端口
```

#### Linux或其他操作系统

因为Linux发行版众多，所以未提供打包后`莽夫密码管理器`，但提供了配置好的项目源代码，通过简单的环境配置即可通过项目源代码运行`莽夫的密码管理器`。

1. 下载项目源码压缩包`/source/PasswordManager.zip`。

2. 安装`Python3.7`或者`Python3的其他版本`。

3. 解压源代码压缩包

4. 使用`pip`根据项目的`requirements.txt`文件安装项目依赖

   ```bash
   pip install -r requirements.txt
   ```

5. 在项目目录下执行以下命令为项目进行初始化

   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

6. 然后您可以使用以下命令来启动`莽夫的密码管理器`

   ```
   python manage.py runserver 0.0.0.0:1234
   ```

   