## API文档

接口统一返回格式：
```json
{
    "code": "状态码0或-1, 0表示处理成功, -1代表处理失败",
    "msg": "状态码对应的提示消息"
}
```

##### `classification/update/<str:old>/<str:new>`
> 该接口用于更新分类信息
> 
> 请求方式: GET
> 
> 参数：
> - old: 需要修改的分类的名称
> - new: 新的分类名称

##### `classification/add/<str:name>`
> 该接口用于添加一个新的分类
>
> 请求方式: GET
>
> 参数：
>
> - name: 新分类的名称

##### `classification/remove/<str:name>`
> 该接口用于删除一个分类
>
> 请求方式: GET
>
> 参数：
>
> - name: 要删除的分类的名称

##### `account/add`
> 该接口用于添加一条账户记录
>
> 请求方式: POST
>
> 参数：
> ```json
> {
>     "name": "账户名称",
>     "password": "账户密码",
>     "remark": "账户备注信息",
>     "classification": [
>         "账户所属分类1",
>         "账户所属分类2",
>         "......."
>     ]
> }
> ```
>



#### `account/remove`

> 该接口用于删除一条账户记录
>
> 请求方式: POST
>
> 参数:
>
> ```json
> {
>     "aid": "账户的aid"
> }
> ```



#### `account/update`

> 该接口用于更新一条账户记录
>
> 请求方式: POST
>
> 参数:
>
> ```json
> {
>     "old":{
>         "aid": "需要更新的账户的aid"
>     },
>     "new":{
>         "name": "账户名称",
>         "password": "账户密码",
>         "remark": "账户备注信息",
>         "classification": [
>         "账户所属分类1",
>         "账户所属分类2",
>         "......."
>         ]
>     }
> }
> ```
>
> 