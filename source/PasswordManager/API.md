## API文档

##### `classification/update/<str:old>/<str:new>`
> 该接口用于更新某一个分类的名称
> 
> 请求方式: GET
> 
> 参数：
> - old: 需要修改的分类的名称
> - new: 新的分类名称

> 返回 JSON： 
>
> ```json
> {
>     "code": "状态码，0代表成功，-1代表失败",
>     "msg": "状态码对应消息"
> }
> ```



##### `classification/add/<str:name>`
> 该接口用于添加一个新的分类
>
> 请求方式: GET
>
> 参数：
>
> - name: 新分类的名称

> 返回 JSON:
>
> ```json
> {
>     "code": "0/-1 0表示成功 -1表示失败",
>     "msg": "d"
> }
> ```



##### `classification/remove/<str:name>`
> 该接口用于删除一个分类
>
> 请求方式: GET
>
> 参数：
>
> - name: 要删除的分类的名称

> 返回 JSON: {
>
> ​    code: 状态码，0代表成功，-1代表失败，
>
> ​    msg: 状态码对应消息 
>
> }



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

> 返回JSON：
>
> ```json
> {
>     "code": "0/-1 0表示成功 -1表示失败",
>     "msg": "状态码对应消息",
>     "aid": "新账号的aid"
> }
> ```
>
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

> 返回 JSON： 
>
> ```json
> {
>     code: "状态码，0代表成功，-1代表失败"，
>     msg: "状态码对应消息"
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

> 返回 JSON： 
>
> ```json
> {
>     code: "状态码，0代表成功，-1代表失败"，
>     msg: "状态码对应消息"
> }
> ```



#### `account/get/<str:classification>`

> 该接口用户获取指定分类的账户数据
>
> 请求方式: GET
>
> 请求参数：
>
> - classification: 分类名称，这里有个特殊分类**all**，当分类名为**all**的时候忽略分类，返回所有账户数据

> 返回 JSON:
>
> ```json
> {
>     "code": "状态码",
>     "msg": "提示消息",
>     "result": [
>         {"账号一"}
>     ]
> }
> ```
>
> 
