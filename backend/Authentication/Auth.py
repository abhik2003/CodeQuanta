from flask import jsonify
from .Schema import User
from mongoengine import Document, StringField, EmailField, connect, ValidationError
import bcrypt
import datetime
import jwt



#function for creating the token
def createToken(user):
    SECRET_KEY = 'CodeQuanta'
    payload = {
        'email': user.get('email'),
        'name': user.get('name'),
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)  # Token expiration time
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm='HS256')

    return token

#function for registering 
def register(data,user):
    
    try:
        #  print(data)
         #to check if email already exists
         if(user.find_one({'email':data.get('email')})is  None):
            passw = data['password'].encode('utf-8')
            hashpassword = bcrypt.hashpw(passw, bcrypt.gensalt())
            myobj = {**data, 'password': hashpassword,'solvedCount':0}
            myuser = user.insert_one(myobj)
            #registered successfully
            return {'code': 200, 'message': 'Registered successfully'}
         else: 
            #email already exists
            return {'code': 500, 'message': 'Email already exists'}
    except ValidationError as err:
        #if any error occurs
        return {'code': 400, 'message': str(err)}

    


#function for decoding the token for JWT based authentication
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


def login(recv,user):
    obj={'message':'', 'code':'200','user':''}
    if(recv[1]==1):
        return decodeToken(recv[0])
    data=recv[0]
    password=data['password'].encode('utf-8')
    try:
        myuser=user.find_one({'email':data.get('email')})
        
        print(myuser)
        if(myuser is not None):
             result=bcrypt.checkpw(password,myuser.get('password'))
             if(result):
                 tok=createToken(myuser)
                 obj['message']='Successfull'
                 obj['code']=200
                 obj['user']={
                     'name':myuser.get('name'),
                     'email':myuser.get('email'),
                     'token':tok
                 }
             else:
                obj['message']='Wrong password'
                obj['code']=400
            #  print(obj)
             return obj
                 
        else:
              obj['message']='Email does not exist'
              obj['code']=400
              return obj
             
    except Exception as err:
        obj['message']=str(err)
        obj['code']=500
        return obj
