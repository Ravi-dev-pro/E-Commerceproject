from django.conf import settings
from twilio.rest import Client


def send_sms(to_number, body):
    try:
        client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
        message=client.messages.create(body=body,from_=settings.TWILIO_PHONE_NUMBER,to=to_number )
         
        return True
    except Exception as e:
        print(f"Failed to send SMS: {e}")
        return False
