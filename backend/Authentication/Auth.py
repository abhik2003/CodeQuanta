from flask import jsonify
from .Schema import User
from mongoengine import Document, StringField, EmailField, connect, ValidationError
import bcrypt
import datetime
import jwt
from bson.objectid import ObjectId


# function for creating the token
def createToken(user, admin, id):
    SECRET_KEY = 'CodeQuanta'
    payload = {
        'email': user.get('email'),
        'name': user.get('name'),
        'userName': user.get('userName'),
        'admin': admin,
        'id': id,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)  # Token expiration time
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm='HS256')

    return token

# function for registering


def register(data, user):

    try:
        #  print(data)
        # to check if email already exists
        checkUser=user.find_one({'email': data.get('email')})
        checkUser2=user.find_one({'userName': data.get('userName')})
        
        if (checkUser is None and checkUser2 is None ):
            passw = data['password'].encode('utf-8')
            hashpassword = bcrypt.hashpw(passw, bcrypt.gensalt())
            
            myobj = {**data, 'password': hashpassword,
                     'solvedCount': {
                         'easy': 0,
                         'medium': 0,
                         'hard': 0
                     }}
            myuser = user.insert_one(myobj)
            # registered successfully
            return {'code': 200, 'message': 'Registered successfully'}
        else:
            # email already exists
            if(checkUser is not None):
                return {'code': 500, 'message': 'Email already exists'}
            else:
                
                return {'code': 500, 'message': 'User Name already exists'}

    except ValidationError as err:
        # if any error occurs
        return {'code': 400, 'message': str(err)}


# function for decoding the token for JWT based authentication
def decodeToken(token):
    SECRET_KEY = 'CodeQuanta'
    # print(token)
    obj = {'message': '', 'code': '', 'user': ''}

    # data = jwt.decode(token, SECRET_KEY, algorithms='HS256')
    try:
        decoded_data = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        obj['message'] = 'Successfull'
        obj['code'] = 200
        obj['user'] = {
            'name': decoded_data['name'],
            'email': decoded_data['email'],
            'admin': decoded_data['admin'],
            'id': decoded_data['id'],
            'userName':decoded_data['userName']

        }
        # Adjust according to your User model
    except jwt.ExpiredSignatureError:
        obj['message'] = 'Token expired'
        obj['code'] = 401
    except jwt.InvalidTokenError:
        obj['message'] = 'Token Invalid'
        obj['code'] = 401
    except Exception as err:
        obj['message'] = 'Error occured'
        obj['code'] = 500

    return obj


def login(recv, user, admins):
    obj = {'message': '', 'code': '200', 'user': ''}
    if (recv[1] == 1):
        return decodeToken(recv[0])
    data = recv[0]
    password = data['password'].encode('utf-8')
    try:
        myuser = user.find_one({'email': data.get('email')})
        # print(myuser)

        if (myuser is not None):
            admin = admins.find_one({'email': data.get('email')})
            if (admin is None):
                admin = 0
            else:
                admin = 1
            result = bcrypt.checkpw(password, myuser.get('password'))
            if (result):
                
                tok = createToken(myuser, admin, str(myuser.get('_id')))
                obj['message'] = 'Successfull'
                obj['code'] = 200
                obj['user'] = {
                    'name': myuser.get('name'),
                    'email': myuser.get('email'),
                    'userName': myuser.get('userName'),
                    'admin': admin,
                    'id': str(myuser.get('_id')),
                    'token': tok
                }
            else:
                obj['message'] = 'Wrong password'
                obj['code'] = 400
        #  print(obj)
            return obj

        else:
            obj['message'] = 'Email does not exist'
            obj['code'] = 400
            return obj

    except Exception as err:
        obj['message'] = str(err)
        obj['code'] = 500
        return obj


def profile(userName, user):
    obj = {'code': 200}
    
    try:
        myuser = user.find_one({'userName': userName})
        if (myuser is not None):
            obj = {
                'name': myuser.get('name'),
                'email': myuser.get('email'),
                'userName':myuser.get('userName'),
                'id':str(myuser.get('_id')),
                'solvedCount': myuser.get('solvedCount'),
                'totalProblems': 10,
                'submissions': [
                    {'submissionId': '1', 'status': 1, 'verdict': 'Accepted'},
                    {'submissionId': '2', 'status': 0, 'verdict': 'Wrong Answer'},
                    {'submissionId': '1', 'status': 1, 'verdict': 'Accepted'},
                    {'submissionId': '8', 'status': 0,
                     'verdict': 'Runtime error'},
                    {'submissionId': '6', 'status': 0,
                     'verdict': 'Runtime error'},

                ],

            }
        else:
            obj['code'] = 400
        return obj
    except Exception as err:
        obj['code'] = 400
        obj['message'] = str(err)
        return obj


def addAdmin(data, admins, user):
    obj = {'code': 200, 'message': ''}
    try:
        me = admins.find_one({'userId': data.get('id')})
        userBeingAdded = user.find_one(
            {'email': data.get('userBeingAddedEmail')})
        ifadmin = admins.find_one({'email': data.get('userBeingAddedEmail')})
        if (ifadmin is not None):
            obj['code'] = 500
            obj['message'] = 'Person is already an admin'
        elif (me is None or userBeingAdded is None):
            obj['code'] = 500
            obj['message'] = 'User not found'
        else:
            admins.insert_one({
                'userID': str(userBeingAdded['_id']),
                'email': userBeingAdded['email'],
                'adminsAdded': [],
                'questionsAdded': {
                    'count': 0,
                    'questionId': []
                }
            })
            admins.update_one(
                {'userId': data.get('id')},
                {'$push': {'adminsAdded': str(userBeingAdded['_id'])}}
            )
            obj['message'] = 'Admin added successfully'
        return obj
    except Exception as err:
        obj['code'] = 400
        obj['message'] = str(err)
        return obj
