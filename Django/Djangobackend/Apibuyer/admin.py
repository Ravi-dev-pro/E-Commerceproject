from django.contrib import admin
from .models import Buyer,Products,Otp

@admin.register(Buyer)
class BuyerAdmin(admin.ModelAdmin):
    list_display = ("id", "full_name", "Email","phone_number","Company_name","district_name")   
    search_fields = ("full_name", "email")        


@admin.register(Products)
class ProductsList(admin.ModelAdmin):
    list_display = ("buyer_id", "item_name", "selling_price", "quantity")
    search_fields=("item_name",)

@admin.register(Otp)
class userlogin(admin.ModelAdmin):
    list_display=("full_name","Phone_number")
    search_fields=("Phone_number",)    