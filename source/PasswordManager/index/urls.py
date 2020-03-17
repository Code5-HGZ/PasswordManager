from django.urls import path
from . import views

urlpatterns = [
    path("", views.index),
    path("classification/update/<str:old>/<str:new>", views.updateClassification, name="classificationUpdate"),
    path("classification/add/<str:name>", views.addClassification, name="classificationAdd"),
    path("classification/remove/<str:name>", views.removeClassification, name="classificationRemove"),
    path("classification/all", views.classificationAll, name="classificationAll"),
    path("account/add", views.addAccount, name="addAccount"),
    path("account/remove", views.removeAccount, name="removeAccount"),
    path("account/update", views.updateAccount, name="updateAccount"),
    path("account/get/<str:classification>", views.getAccount, name="getAccount")
]