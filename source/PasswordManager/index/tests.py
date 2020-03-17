from django.test import TestCase
from django.utils import timezone
from . import models
from . import views


# for a in models.Account.objects.all():
#     print("delet => ", a.accountName, end="....")
#     a.delete()
#     print("成功")


for n in range(1, 101):
    account = models.Account()
    account.accountName = "账户{}".format(n)
    account.accountPassword = str(hash(n))
    account.createDate = timezone.now()
    account.updateDate = timezone.now()
    account.accountRemark = "测试账号的备注信息"
    account.save()
    classification = models.Classification.objects.get(name="测试分类2")
    account.classification.add(classification)
    print("Create account:", account)

    # name = "账户{}".format(n)
    # try:
    #     account = models.Account.objects.get(accountName=name)
    #     account.delete()
    #     print("Delete:", name, " OK")
    # except Exception:
    #     print("Delete:", name, " Error")