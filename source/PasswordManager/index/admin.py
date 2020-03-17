from django.contrib import admin
from . import models



class AccountAdmin(admin.ModelAdmin):
    readonly_fields = ("createDate", "updateDate")
    list_display = ("accountName", "createDate", "updateDate")
    list_per_page = 10
    search_fields = ("accountName",)


admin.site.register(models.Classification)
admin.site.register(models.Account, AccountAdmin)