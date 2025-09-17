from rest_framework import serializers
from .models import Buyer,Products

class BuyerSerializer(serializers.ModelSerializer):
    class Meta:
        model=Buyer
        fields='__all__'

class ProductsSerializer(serializers.ModelSerializer):
    # image = serializers.ImageField(use_url=True)
    class Meta:
        model=Products
        fields='__all__'        