from django.db import models



class Classification(models.Model):
    class Meta():
        verbose_name = "账户分类"
        verbose_name_plural = verbose_name
    
    # 分类名称
    name = models.CharField()
    # name.primary_key = True
    name.max_length = 100
    name.verbose_name = "分类名称"

    def __str__(self):
        return self.name


class Account(models.Model):
    class Meta():
        verbose_name = "账户信息"
        verbose_name_plural = verbose_name
    
    # 账户名
    accountName = models.CharField()
    accountName.max_length = 100
    accountName.verbose_name = "账户名称"
    
    # 账户密码
    accountPassword = models.CharField()
    accountPassword.max_length = 200
    accountPassword.verbose_name = "账户密码"

    # 创建日期
    createDate = models.DateTimeField()
    createDate.verbose_name = "创建日期"

    # 最后修改日期
    updateDate = models.DateTimeField()
    updateDate.verbose_name = "最后一次修改日期"

    # 账户备注
    accountRemark = models.TextField()
    accountRemark.verbose_name = "账户备注信息"

    # 与分类表建立多对多关系
    classification = models.ManyToManyField("Classification")
    classification.verbose_name = "此账户所属分类"

    def __str__(self):
        return self.accountName