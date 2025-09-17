from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator
from django.contrib.auth.models import BaseUserManager, AbstractBaseUser
import random
import string
from django.utils import timezone
from datetime import timedelta

# class OTP(models.Model):
#     email = models.EmailField(null=True, blank=True)
#     phone_number = models.CharField(max_length=15, null=True, blank=True)
#     code = models.CharField(max_length=6)
#     created_at = models.DateTimeField(auto_now_add=True)
#     is_verified = models.BooleanField(default=False)

#     def is_expired(self):
#         return timezone.now() > self.created_at + timedelta(minutes=5)  # 5 min expiry

#     @staticmethod
#     def generate_otp(length=6):
#         return ''.join(random.choices(string.digits, k=length))

# class UserManager(BaseUserManager):
#      def create_user(self, email=None, phone_number=None, password=None):
#         if not email and not phone_number:
#             raise ValueError("please provide either mail or phone number")
#         user = self.model(
#             email=self.normalize_email(email) if email else None,
#             phone_number=phone_number
#         )
#         user.set_password(password)
#         user.save(using=self._db)
#         return user
     
# class User(AbstractBaseUser):
#     email = models.EmailField(unique=True, null=True, blank=True)
#     phone_number = models.CharField(max_length=15, unique=True, null=True, blank=True)
#     is_active = models.BooleanField(default=True)
#     Name=models.CharField(max_length=20, null= True , blank=True, )

#     USERNAME_FIELD = 'email'  
#     REQUIRED_FIELDS = ['phone_number']

#     objects = UserManager()     
#     def __str__(self):
#         return self.email if self.email else self.phone_number
class Otp(models.Model):
    full_name=models.CharField(max_length=40)
    Phone_number=models.PositiveIntegerField( unique=True)
    def __str__(self):
        return f"{self.full_name} ({self.Phone_number})"

class Buyer(models.Model):  
    full_name=models.CharField(max_length=24)
    Email=models.CharField(max_length=50)
    phone_number=models.IntegerField(max_length=10, null=False, blank=False, unique=True)
    Company_name=models.CharField(max_length=100, null=False,blank=False)
    pin_code=models.IntegerField(max_length=10, null=False,blank=False,)
    district_name=models.CharField(max_length=30,)
    State=models.CharField(max_length=24, null=False, )
    agreeToTerms = models.BooleanField(default=False)
    def __str__(self):
        return self.full_name

class Products(models.Model):
    buyer_id=models.ForeignKey(Buyer, on_delete=models.CASCADE, related_name="items")
    image=models.ImageField( upload_to="Products/", height_field=None, width_field=None, max_length=None)
    item_name=models.CharField(max_length=20)
    company_name=models.CharField(max_length=40,null=False,blank=False)
    model_number=models.CharField(max_length=40)
    model_name=models.CharField( max_length=50)
    description=models.TextField(max_length=400)
    selling_price = models.DecimalField(max_digits=10, decimal_places=2)
    mrp = models.DecimalField(max_digits=10, decimal_places=2)
    quantity=models.CharField(max_length=10,null=False,blank=False)
    pack_of=models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(9999)], null=True, blank=True)
    fssai_number=models.IntegerField(max_length=40 , null=True, blank=True)
    maxmium_shelf_life=models.IntegerField(max_length=10 , null=True, blank=True)
    size=models.IntegerField(max_length=3 , null=True, blank=True)
    object_form=models.CharField(max_length=20 , null=True, blank=True)
    container=models.CharField((""), max_length=50 , null=True, blank=True)
    image2=models.ImageField( upload_to="Products/", height_field=None, width_field=None, max_length=None , null=True, blank=True)
    image3=models.ImageField( upload_to="Products/", height_field=None, width_field=None, max_length=None , null=True, blank=True)
    image4=models.ImageField( upload_to="Products/", height_field=None, width_field=None, max_length=None , null=True, blank=True)
    image5=models.ImageField( upload_to="Products/", height_field=None, width_field=None, max_length=None , null=True, blank=True)
    image6=models.ImageField( upload_to="Products/", height_field=None, width_field=None, max_length=None , null=True, blank=True)

    def __str__(self):
        return self.item_name
