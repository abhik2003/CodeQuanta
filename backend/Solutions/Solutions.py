from bson.objectid import ObjectId
from flask import jsonify

def submitSolution(solutions, data):
    required_fields = ['problem_id', 'user_id', 'solution', 'title','timestamp']
    
    for rf in required_fields:
        if rf not in data:
            return jsonify({'message':'All fields are not passed'}), 400
    
    try:
        data['problem_id'] = ObjectId(data['problem_id'])
        data['user_id'] = ObjectId(data['user_id'])
        
        solutions.insert_one(data)
        
        return jsonify({'message': "Solution added successfully"}), 200
    except Exception as err:
        return jsonify({'message':str(err)}), 500
    

def updateSolution(solutions, data):
    required_fields = ['solution_id', 'user_id', 'solution', 'title']
    
    for rf in required_fields:
        if rf not in data:
            return jsonify({'message': 'All fields are not passed'}), 400
    
    try:
        data['user_id'] = ObjectId(data['user_id'])
        data['solution_id'] = ObjectId(data['solution_id'])
        
        # Find the document to update
        filter_query = {
            '_id': data['solution_id'],
            'user_id': data['user_id']
        }
        
        # Update the solution document
        update_query = {
            '$set': {
                'solution': data['solution'],
                'title': data['title']
            }
        }
        
        result = solutions.update_one(filter_query, update_query)
        
        #if the solution_id and user_id do not match
        if result.matched_count == 0:
            return jsonify({'message': 'User has no access to update'}), 404
        
        return jsonify({'message': "Solution updated successfully"}), 200
    except Exception as err:
        return jsonify({'message': str(err)}), 500


def getAllSolutions(solutions,data,user):

    pid=data.get('problem_id')
    obj={'code':200,'message':''}
    if(pid is None):
        obj['code']=500
        obj['message']='Provide problem id'
        return obj
    try:
        probid=ObjectId(pid)
        sols=list(solutions.find({'problem_id':probid},{'user_id':1,'title':1, 'timestamp':1}).sort('timestamp', -1))
        for each in sols:
            user_ = user.find_one({'_id': each['user_id']}, {'userName': 1})
            each['userName'] = user_.get('userName')
            each['user_id']=str(each.get('user_id'))
            each['id']=str(each.get('_id'))
            del each['_id']
        
        obj['solutions']=sols
        # print(sols)
        return obj
    except Exception as err:
        obj['code']=500
        obj['message']=str(err)
        return obj


def getParticularSolution(solutions,data, user):
    sid=data.get('solution_id')
    obj={'code':200,'message':''}
    if(sid is None):
        obj['code']=500
        obj['message']='Provide solution id'
        return obj
    try:
        solid=ObjectId(sid)
        sols=solutions.find_one({'_id':solid},{'user_id':1,'title':1,'solution':1, 'timestamp':1})
        user_ = user.find_one({'_id': sols['user_id']}, {'userName': 1})
        sols['userName'] = user_.get('userName')
        sols['id']=str(sols.get('_id'))
        sols['user_id']=str(sols.get('user_id'))

        del sols['_id']
        
        # print(sols)
        obj['solution']=sols
        # print(sols)
        return obj
    except Exception as err:
        obj['code']=500
        obj['message']=str(err)
        return obj