from flask import jsonify
from .Schema import User
from mongoengine import Document, StringField, EmailField, connect, ValidationError
import bcrypt
import datetime
import jwt


def register(data):
    try:
         print(data)
         passw = data['password'].encode('utf-8')
         hashpassword = bcrypt.hashpw(passw, bcrypt.gensalt())
         myobj = {**data, 'password': hashpassword}
         user = User(**myobj)
         user.save()
        #  return "happened successfully"
         return {'code': 200, 'message': 'Registered successfully'}
    except ValidationError as err:
        return {'code': 400, 'message': str(err)}

    except Exception as err:
        if str(err) == "Tried to save duplicate unique keys (E11000 duplicate key error collection: CodeQuanta.user index: email_1 dup key: { email: \"krish120@gmail.com\" }, full error: {'index': 0, 'code': 11000, 'errmsg': 'E11000 duplicate key error collection: CodeQuanta.user index: email_1 dup key: { email: \"krish120@gmail.com\" }', 'keyPattern': {'email': 1}, 'keyValue': {'email': 'krish120@gmail.com'}})":
            err = "Email already exists"
        return {'code': 500, 'message': str(err)}


def createToken(user):
    SECRET_KEY = 'CodeQuanta'
    payload = {
        'email': user.email,
        'name': user.name,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)  # Token expiration time
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm='HS256')

    return token


def decodeToken(token):
    SECRET_KEY = 'CodeQuanta'
    # print(token)
    obj = {'message': '', 'code': '', 'user': ''}

    # data = jwt.decode(token, SECRET_KEY, algorithms='HS256')
    try:
            decoded_data = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
            obj['message'] = 'Successfull'
            obj['code']=200
            obj['user']={
                     'name':decoded_data['name'],
                     'email':decoded_data['email'],
                     
                 }
              # Adjust according to your User model
    except jwt.ExpiredSignatureError:
            obj['message'] = 'Token expired'
            obj['code']=401
    except jwt.InvalidTokenError:
            obj['message'] = 'Token Invalid'
            obj['code']=401
    except Exception as err:
            obj['message'] = 'Error occured'
            obj['code']=500

    return obj

def login(recv):
    obj={'message':'', 'code':'','user':''}
    if(recv[1]==1):
        return decodeToken(recv[0])
    data=recv[0]
    password=data['password'].encode('utf-8')
    try:
         user=User.objects.get(email=data['email'])
         if(user is not None):
             result=bcrypt.checkpw(password,user.password)
             if(result):
                 tok=createToken(user)
                 obj['message']='Successfull'
                 obj['code']=200
                 obj['user']={
                     'name':user.name,
                     'email':user.email,
                     'token':tok
                 }
                 
                 return obj
                 

    except Exception as err:
        obj['message']=str(err)
        obj['status']=500
        return obj


    