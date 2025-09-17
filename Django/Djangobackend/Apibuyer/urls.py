from django.urls import path
from . import views


urlpatterns = [
    path("buyer/",views.BuyerListView.as_view()),
    path('buyers/<int:pk>/', views.BuyerDetailView.as_view()),
    path('check_user/',views.check_user,name='check_user'),
    path('otpverify/', views.otpverify, name="otpverify"),
    path('product/<int:buyer_id>/',views.ProductView.as_view(), name="product-list"),
    path('items/',views.Setproducts,name="add_item"),
    path("productslist/", views.ProductDetailView.as_view(), name="product-detail"), 
    path("sendotp/",views.Otpverification, name='sendotpfull'),
    path("userverifyotp/",views.verifyotpfull, name='verifyotpfull'),
    path("register_user/",views.registeruser, name='register'),
    path("usersendotp/",views.userlogin, name='userlogin'),
    path("userverifylogin/",views.user_verify_otp_login, name='userverifyotp'),
    


]
