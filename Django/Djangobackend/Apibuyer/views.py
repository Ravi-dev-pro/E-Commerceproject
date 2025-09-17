import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.generics import ListAPIView,RetrieveAPIView,ListCreateAPIView,RetrieveUpdateDestroyAPIView
from rest_framework.permissions import IsAuthenticated
from Apibuyer.models import Buyer,Products
from Apibuyer.serializers import BuyerSerializer,ProductsSerializer
from rest_framework.permissions import AllowAny
from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Otp
from django.conf import settings
from twilio.rest import Client
import logging

client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)

@csrf_exempt
def userlogin(request):
    if request.method=='POST':
        try:
              data=json.loads(request.body)
              phone=data.get("Phone_number")

              if not Otp.objects.filter(Phone_number=phone).exists :
               return JsonResponse({"error":"You are not registered"},status=400)
              verification = client.verify.v2.services(settings.TWILIO_VERIFY_SID) \
                .verifications \
                .create(to=f"+91{phone}", channel="sms")
              return JsonResponse({"message": "OTP sent successfully"}, status=200)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"message": "Invalid request method"}, status=405)

@csrf_exempt
def user_verify_otp_login(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            phone = data.get("Phone_number")
            otp = data.get("otp")
  
            verification_check = client.verify.v2.services(settings.TWILIO_VERIFY_SID) \
                .verification_checks \
                .create(to=f"+91{phone}", code=otp)

            if verification_check.status == "approved":
                user=Otp.objects.filter(Phone_number=phone).first()

                if user:
                    return JsonResponse({
                        "message": "Login successful",
                        "id": user.id,
                        "name": user.full_name,
                        "phone": user.Phone_number
                    }, status=200)
            else:
                return JsonResponse({"message": "Invalid OTP"}, status=400)
    
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"message": "Invalid request method"}, status=405)



@csrf_exempt
def Otpverification(request):
    if request.method=="POST":
        data= json.loads(request.body)
        phone=data.get("Phone_number")

        if Otp.objects.filter(Phone_number=phone).exists():
            print("number already registered ")
            return JsonResponse({"message":"Phone number already registered"},status=400)
        try:
            verification = client.verify.v2.services(settings.TWILIO_VERIFY_SID) \
                .verifications \
                .create(to=f"+91{phone}", channel="sms")

            return JsonResponse({"message": "OTP sent", "status": verification.status})
        except Exception as e:
            logging.error(f"Error in Otpverification: {e}", exc_info=True)
            return JsonResponse({"error":str(e)},status=500)
    return JsonResponse({'error': 'Invalid request method. Please use POST.'}, status=400)   

@csrf_exempt
def verifyotpfull(request):
    if request.method=="POST":
        try:
            data = json.loads(request.body)
            phone = data.get("Phone_number")
            user_otp = data.get("otp")
            
            # otp_record=Otp.objects.get(Phone_number=phone)
            verification_check = client.verify.v2.services(settings.TWILIO_VERIFY_SID) \
                .verification_checks \
                .create(to=f"+91{phone}", code=user_otp)
            print("Verification Status:", verification_check.status)
            if verification_check.status == "approved":
                return JsonResponse({"message":"Otp verify successfully"},status=200)
            else:
                return JsonResponse({"message":"invalid otp"},status=400)


        except Exception as e:
            import traceback
            print("OTP Verification Error:", str(e))
            traceback.print_exc()
            return JsonResponse({"error":str(e)},status=500)

    else:
        return JsonResponse({"message":"invalid request method "},status=405)   

@csrf_exempt
def registeruser(request):
    if request.method=="POST":
        try:
            data=json.loads(request.body)
            name=data.get("full_name")  
            phone=data.get("Phone_number")  

            if not name or not phone :
                return JsonResponse({"error":"phone and name is required"},status=400)
            if Otp.objects.filter(Phone_number=phone).exists():
                return JsonResponse({"error": "Phone number already registered"},status=400) 

            user= Otp.objects.create(Phone_number=phone,full_name=name)
            return JsonResponse({"message": "User registered successfully","id":user.id}, status=201)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Invalid request method"}, status=405)

class BuyerListView(ListCreateAPIView):
    queryset=Buyer.objects.all()
    serializer_class=BuyerSerializer
    permission_classes=[AllowAny]
    def create(self,request,*args, **kwargs):
        phone=request.data.get("phone_number")
        if Buyer.objects.filter(phone_number=phone).exists():
            return Response(
                {"error": "Phone number already registered. -----"},
                status=status.HTTP_400_BAD_REQUEST
            )
        try:
            verification = client.verify.v2.services(settings.TWILIO_VERIFY_SID) \
                .verifications \
                .create(to=f"+91{phone}", channel="sms")

            return JsonResponse({"message": "OTP sent", "status": verification.status})
        except Exception as e:
            logging.error(f"Error in Otpverification: {e}", exc_info=True)
            return JsonResponse({"error":str(e)},status=500)
            

class BuyerDetailView(RetrieveAPIView):
    queryset=Buyer.objects.all()
    serializer_class=BuyerSerializer
    permission_classes=[IsAuthenticated]
    permission_classes=[AllowAny]

class ProductView(ListCreateAPIView):
    serializer_class=ProductsSerializer
    permission_classes=[IsAuthenticated]
    permission_classes=[AllowAny]
    def get_queryset(self):
        sellerid = self.kwargs.get("buyer_id")     
        return Products.objects.filter(buyer_id=sellerid)

class ProductDetailView(ListAPIView):
    queryset = Products.objects.all()
    serializer_class = ProductsSerializer 
    permission_classes=[AllowAny]   

otp_store={}

@csrf_exempt
def check_user(request):
    if request.method == 'POST':
        try:  
            data = json.loads(request.body.decode("utf-8"))
            phone=data.get('phone_number')
            
            if not Buyer.objects.filter(phone_number=phone).exists() :
               return JsonResponse({"error":"You are not registered"},status=400)
            verification = client.verify.v2.services(settings.TWILIO_VERIFY_SID) \
                .verifications \
                .create(to=f"+91{phone}", channel="sms")
            return JsonResponse({"success": True,"message": "OTP sent successfully"}, status=200)

        except Buyer.DoesNotExist:
            print(f"{phone} is not registered, please register yourself")   
            return JsonResponse({"status":"not_registered"}) 
    return JsonResponse({"status":"error","message":"invalid_user"})    

@csrf_exempt
def otpverify(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            phone = data.get("phone_number")
            entered_otp = data.get("otp")
            if not phone or not entered_otp:
                return JsonResponse({"success": False, "message": "Phone number and OTP are required."}, status=400)
            verification_check = client.verify.v2.services(settings.TWILIO_VERIFY_SID) \
                .verification_checks \
                .create(to=f"+91{phone}", code=entered_otp)

            if verification_check.status == "approved":
                user=Buyer.objects.filter(phone_number=phone).first()
                if user:

                    return JsonResponse({
                    "success": True,"message": "OTP verified successfully","id": user.id,   
                    "full_name": user.full_name,
                    "phone_number": user.phone_number
                },status=200)
                else:
                    return JsonResponse({"success":False,"message":"user not found"},status=404)

    
            else:
                return JsonResponse({"success": False, "message": "Invalid OTP. Please try again."}, status=400)              
        except Exception as e:
            return JsonResponse({"success": False, "message": str(e)}, status=500)
    return JsonResponse({"status":"error","message":"invalid request"})  

@csrf_exempt
@api_view(["POST"])
@permission_classes([AllowAny])
@parser_classes([MultiPartParser, FormParser])      
def Setproducts(request):
    if request.method == "POST":
        try:
           buyer_id = request.data.get("buyer_id")
           buyer = Buyer.objects.get(id=buyer_id)

           product = Products.objects.create(
                 buyer_id = buyer,
                item_name = request.data.get("item_name"),
                company_name = request.data.get("company_name"),
                model_number = request.data.get("model_number"),
                model_name = request.data.get("model_name"),
                description = request.data.get("description"),
                selling_price = request.data.get("selling_price"),
                mrp = request.data.get("mrp"),
                quantity = request.data.get("quantity"),
                image = request.FILES.get("image"),
                image2 = request.FILES.get("image2"),
                image3 = request.FILES.get("image3"),
                image4 = request.FILES.get("image4"),
                image5 = request.FILES.get("image5"),
                image6 = request.FILES.get("image6"),
                pack_of=request.data.get("pack_of"),
                fssai_number=request.data.get("fssai_number"),
                maxmium_shelf_life=request.data.get("maxmium_shelf_life"),
                size=request.data.get("size"),
                object_form=request.data.get("object_form"),
                container=request.data.get("container_type"),

            )
           return JsonResponse({"status": "success", "id": product.id}, status=201)

        except Buyer.DoesNotExist:
            return JsonResponse({"status": "error", "message": "Buyer not found"}, status=404)

        except Exception as e:
            return JsonResponse({"status": "error", "message": str(e)}, status=400)

    return JsonResponse({"status": "error", "message": "Invalid request method"}, status=405)
            


  


