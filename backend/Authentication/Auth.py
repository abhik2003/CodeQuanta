from flask import jsonify 
from .Schema import User
from mongoengine import Document, StringField, EmailField, connect, ValidationError
import bcrypt

def register(data):
    try:
         print(data)
         passw=data['password'].encode('utf-8')
         hashpassword=bcrypt.hashpw(passw,bcrypt.gensalt())
         myobj={**data,'password':hashpassword}
         user = User(**myobj)
         user.save()
        #  return "happened successfully"
         return {'code':200,'message':'Registered successfully'}
    except ValidationError as err:
        return {'code':400,'message':str(err)}

    except Exception as err:
        if str(err)=="Tried to save duplicate unique keys (E11000 duplicate key error collection: CodeQuanta.user index: email_1 dup key: { email: \"krish120@gmail.com\" }, full error: {'index': 0, 'code': 11000, 'errmsg': 'E11000 duplicate key error collection: CodeQuanta.user index: email_1 dup key: { email: \"krish120@gmail.com\" }', 'keyPattern': {'email': 1}, 'keyValue': {'email': 'krish120@gmail.com'}})":
            err="Email already exists"
        return {'code':500,'message':str(err)}


def login(data):
    password=data['password'].encode('utf-8')
    obj={'message':'', 'code':'','user':''}
    try:
         user=User.objects.get(email=data['email'])
         if(user is not None):
             result=bcrypt.checkpw(password,user.password)
             if(result):
                 obj['message']='Successfull'
                 obj['code']=200
                 obj['user']={
                     'name':user.name,
                     'email':user.email
                 }
                 return obj
                 

    except Exception as err:
        obj['message']=str(err)
        obj['status']=500
        return obj


    