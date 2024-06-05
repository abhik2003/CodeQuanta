from mongoengine import Document, StringField, EmailField, connect, ValidationError,BinaryField

class User(Document):
    name = StringField(required=True, max_length=50)
    email = EmailField(required=True, unique=True)
    password= BinaryField(required=True)
