from json import loads as jsonLoads
from django.shortcuts import render
from django.http import JsonResponse
from django.utils import timezone
from . import models


from django.views.decorators.csrf import csrf_exempt


def _jsonLoads(content):
    try:
        result = jsonLoads(content)
    except Exception as err:
        return False
    return result

def _classificationManager(operation, name, newName=None):
    """ 分类管理器
        :operation: 操作类型[update, add, remove]
        :name: 已有分类的名称
        :newName: 新的分类名称, 操作类型为 update 时有效
    """
    # 检查操作类型的合法性
    operationWhitelist = ("update", "add", "remove")
    operation = operation.strip()
    if not operation and operation in operationWhitelist:
        return False

    # 检查分类名合法性
    name = name.strip()
    if not name:
        return False

    # 已存在的分类名称
    classificationList = list()
    for c in models.Classification.objects.all():
        classificationList.append(c.name)

    operation = operation.lower()
    if operation == "add":
        if name in classificationList:
            return False
        c = models.Classification()
        c.name = name
        c.save()
    elif operation == "remove":
        if not name in classificationList:
            return False
        c = models.Classification.objects.get(name=name)
        c.delete()
    elif operation == "update":
        if not name in classificationList:
            return False
        newName = newName.strip()
        if not newName:
            return False
        c = models.Classification.objects.get(name=name)
        c.name = newName
        c.save()

    return True


def _accountManger(operation, accountInformation, newAccountInformation=dict()):
    """ 账号管理器
        :operation: 操作方式[update, add, remove]
        :accountInformation: 已存在的账号信息
        :newAccountInformation: 新的账号信息, 操作方式为 update 时有效
    """
    # 检查操作类型的合法性
    operationWhitelist = ("update", "add", "remove")
    operation = operation.strip()
    if not operation and operation in operationWhitelist:
        return False

    operation = operation.lower()
    try:
        # 已存在的所有分类名称
        classificationList = list()
        for c in models.Classification.objects.all():
            classificationList.append(c.name)

        if operation == "add":
            a = models.Account()
            a.accountName = accountInformation["name"]
            a.accountPassword = accountInformation["password"]
            a.accountRemark = accountInformation["remark"]
            a.createDate = timezone.now()
            a.updateDate = timezone.now()
            a.save()

            # 一个账号至少属于一个分类
            if len(accountInformation["classification"]) >= 1:
                for ci in accountInformation["classification"]:
                    if ci in classificationList:
                        classification = models.Classification.objects.get(name=ci)
                        a.classification.add(classification)
                    else:
                        return False

            return a.pk

        elif operation == "remove":
            aid = accountInformation["aid"]
            a = models.Account.objects.get(pk=aid)
            if not a:
                return False
            a.delete()

        elif operation == "update":
            aid = accountInformation["aid"]
            a = models.Account.objects.get(pk=aid)
            if not a:
                return False
            a.accountName = newAccountInformation["name"]
            a.accountPassword = newAccountInformation["password"]
            a.accountRemark = newAccountInformation["remark"]
            a.updateDate = timezone.now()
            a.save()
            if len(newAccountInformation["classification"]) >= 1:
                # 清空所有关系集合
                a.classification.clear()
                # 添加新的关系
                for ci in newAccountInformation["classification"]:
                    if ci in classificationList:
                        classification = models.Classification.objects.get(name=ci)
                        a.classification.add(classification)
                    else:
                        return False

    except Exception as err:
        return False

    return True


@csrf_exempt
def updateClassification(request, old, new):
    result = dict()
    if _classificationManager("update", old, new):
        result["code"] = 0
        result["msg"] = "分类名称已更新"
    else:
        result["code"] = -1
        result["msg"] = "分类名称修改失败"
    return JsonResponse(result)


@csrf_exempt
def removeClassification(request, name):
    result = dict()
    if _classificationManager("remove", name):
        result["code"] = 0
        result["msg"] = "移除分类 {}".format(name)
    else:
        result["code"] = -1
        result["msg"] = "移除分类 {} 失败".format(name)
    return JsonResponse(result)


@csrf_exempt
def addClassification(request, name):
    result = dict()
    if _classificationManager("add", name):
        result["code"] = 0
        result["msg"] = "添加了分类 {}".format(name)
    else:
        result["code"] = -1
        result["msg"] = "添加分类 {} 失败".format(name)
    return JsonResponse(result)


@csrf_exempt
def classificationAll(request):
    allClassification = list()
    for c in models.Classification.objects.all():
        allClassification.append(c.name)
    
    result = dict()
    result["code"] = 0
    result["result"] = allClassification
    return JsonResponse(result)


@csrf_exempt
def addAccount(request):
    """ API: 添加账户
    """
    result = dict()
    json = _jsonLoads(request.body.decode())
    if not json:
        result["code"] = -1
        result["msg"] = "新建账户失败, 参数错误"
        return JsonResponse(result)

    aid =  _accountManger("add", json)
    if not aid:
        result["code"] = -1
        result["msg"] = "新建账户失败, 参数错误"
        return JsonResponse(result)
    
    result["code"] = 0
    result["msg"] = "账户 {} 添加成功".format(json["name"])
    result["aid"] = aid
    return JsonResponse(result)

@csrf_exempt
def removeAccount(request):
    """ API: 移除账户
    """
    result = dict()
    json = _jsonLoads(request.body.decode())
    if not json:
        result["code"] = -1
        result["msg"] = "删除账户失败, 参数错误"
        return JsonResponse(result)

    if not _accountManger("remove", json):
        result["code"] = -1
        result["msg"] = "删除账户失败, 参数错误"
        return JsonResponse(result)
    
    result["code"] = 0
    result["msg"] = "账户删除成功"
    return JsonResponse(result)

@csrf_exempt
def updateAccount(request):
    """ API: 更新账户数据
    """
    result = dict()
    json = _jsonLoads(request.body.decode())
    if not json:
        result["code"] = -1
        result["msg"] = "删除账户失败, 参数错误"
        return JsonResponse(result)

    try:
        old = json["old"]
        new = json["new"]
    except Exception:
        result["code"] = -1
        result["msg"] = "删除账户失败, 参数错误"
        return JsonResponse(result)

    if not _accountManger("update", old, new):
        result["code"] = -1
        result["msg"] = "修改账户信息失败, 参数错误"
        return JsonResponse(result)

    result["code"] = 0
    result["msg"] = "修改成功"
    return JsonResponse(result)

@csrf_exempt
def getAccount(request, classification):
    """ 根据分类获取账号信息
    """
    if classification == "all":
        result = list()
        for a in models.Account.objects.all():
            temporary = dict()
            temporary["aid"] = a.pk
            temporary["name"] = a.accountName
            temporary["password"] = a.accountPassword
            temporary["createDate"] = a.createDate.strftime("%Y-%m-%d %H:%M:%S")
            temporary["updateDate"] = a.updateDate.strftime("%Y-%m-%d %H:%M:%S")
            temporary["remark"] = a.accountRemark
            temporary["classification"] = list()
            for c in a.classification.all():
                temporary["classification"].append(c.name)
            result.append(temporary)

    return JsonResponse(dict(code=0, result=result))

    # 检查分类是否存在
    classificationList = list()
    for c in models.Classification.objects.all():
        classificationList.append(c.name)
    if not classification in classificationList:
        result = dict()
        result["code"] = -1
        result["msg"] = "分类不存在"
        return JsonResponse(result)

    c = models.Classification.objects.get(name=classification)
    result = list()
    for a in c.account_set.all():
        temporary = dict()
        temporary["aid"] = a.pk
        temporary["name"] = a.accountName
        temporary["password"] = a.accountPassword
        temporary["createDate"] = a.createDate.strftime("%Y-%m-%d %H:%M:%S")
        temporary["updateDate"] = a.updateDate.strftime("%Y-%m-%d %H:%M:%S")
        temporary["remark"] = a.accountRemark
        temporary["classification"] = list()
        for c in a.classification.all():
            temporary["classification"].append(c.name)
        result.append(temporary)

    return JsonResponse(dict(code=0, result=result))


def index(request):
    return render(request, "index/index.html", dict())