from bson.objectid import ObjectId
from flask import jsonify

def addSubmission(data, submissions):
    #problem_id, user_id, code, extension, verdict(initially pending)
    required_fields = ['problem_id', 'user_id', 'code', 'extension', 'verdict', 'status', 'timestamp']
    
    for rf in required_fields:
        if rf not in data:
            return {'code':400,'message':'Error in adding submission'}
    
    try:
        data['problem_id'] = ObjectId(data['problem_id'])
        data['user_id'] = ObjectId(data['user_id'])
        sub_id = submissions.insert_one(data).inserted_id
        sub_id = str(sub_id)
        return {'code':200, 'submission_id': sub_id}
    except Exception as error:
        return {'code': 500, 'message':str(error)}
    
        
def updateVerdict(data, submissions):
    required_fields = ['id','verdict', 'status']
    for rf in required_fields:
        if rf not in data:
            return {'code':400,'message':'Verdict update failed'}
    try:
        obj_id = ObjectId(data['id'])
        verdict = data['verdict']
        status = data['status']
        
        # Perform the update in the database
        result = submissions.update_one(
            {'_id': obj_id},
            {'$set': {'verdict': verdict, 'status': status}}
        )
        
        if result.matched_count == 0:
            return {'code': 404, 'message': 'Submission not found'}
        
        return {'code': 200, 'message': 'Verdict update successful'}
    
    except Exception as error:
        return {'code': 500, 'message': str(error)}

        

def getAllSubmissionUser(user_id, page, count, submissions):
    if user_id is None:
        return jsonify({"messae": "User id is missing"}), 400
    
    user_id = ObjectId(user_id)
    all_sub=[]
    try:
        if page is None:
            page = 0
        else:
            page -=1
        if count is None:
            count = 10

        pipeline = [
            {
                '$match': {
                    'user_id': user_id,
                }
            },
            {
                '$sort': {
                    'timestamp': -1
                }
            },
            {
                '$skip': page*count
            },
            {
                '$limit': count
            },
            {
                '$lookup': {
                    'from': 'problems',
                    'localField': 'problem_id',
                    'foreignField': '_id',
                    'as': 'problem_details'
                }
            },
            {
                '$unwind': '$problem_details'
            },
            {
                '$project': {
                    'code': 1,
                    'extension': 1,
                    'verdict': 1,
                    'status': 1,
                    'timestamp': 1,
                    "problem_id":1,
                    'user_id':1,
                    'problem_name': '$problem_details.statement'
                }
            }
        ]

        submissions_ = list(submissions.aggregate(pipeline))
        all_sub = [
            {
                "id": str(sub["_id"]),
                "problem_id": str(sub["problem_id"]),
                "user_id": str(sub["user_id"]),
                "code": sub["code"],
                "extension": sub["extension"],
                "verdict": sub["verdict"],
                "status": sub["status"],
                "timestamp": sub["timestamp"],
                "problem_name": sub["problem_name"]
            }

            for sub in submissions_
        ]
        return jsonify({'submissions':all_sub}), 200
    except Exception as err:
        return jsonify({'message':str(err)}), 500
        

def getAllSubmissionUserProblem(user_id, problem_id, submissions):
    if user_id is None:
        return jsonify({"messae": "User id is missing"}), 400
    if problem_id is None:
        return jsonify({"messae": "Problem id is missing"}), 400
    try:
            
        pipeline = [
            {
                '$match': {
                    'user_id': ObjectId(user_id),
                    'problem_id': ObjectId(problem_id)
                }
            },
            {
                '$sort': {
                    'timestamp': -1
                }
            },
            {
                '$lookup': {
                    'from': 'problems',
                    'localField': 'problem_id',
                    'foreignField': '_id',
                    'as': 'problem_details'
                }
            },
            {
                '$unwind': '$problem_details'
            },
            {
                '$project': {
                    'code': 1,
                    'extension': 1,
                    'verdict': 1,
                    'status': 1,
                    'timestamp': 1,
                    "problem_id":1,
                    'user_id':1,
                    'problem_name': '$problem_details.statement'
                }
            }
        ]

        submissions_ = list(submissions.aggregate(pipeline))
        all_sub = [
            {
                "id": str(sub["_id"]),
                "problem_id": str(sub["problem_id"]),
                "user_id": str(sub["user_id"]),
                "code": sub["code"],
                "extension": sub["extension"],
                "verdict": sub["verdict"],
                "status": sub["status"],
                "timestamp": sub["timestamp"],
                "problem_name": sub["problem_name"]
            }

            for sub in submissions_
        ]
        return jsonify({'submissions':all_sub}), 200
    except Exception as err:
        return jsonify({'message':str(err)}), 500
    
def updateUserSolvedProblem(problem_id, user_id, user, problems):
    try:
        problem_id=ObjectId(problem_id)
        user_id=ObjectId(user_id)
        
        update_operation = {
            '$addToSet': {
                'solved': problem_id
            }
        }
        result = user.update_one({'_id': user_id}, update_operation)
        
        if result.modified_count > 0: #updated
            problem = problems.find_one({'_id': problem_id}, {'difficulty': 1, '_id': 0})
            if problem:
                diff = problem['difficulty'].lower()
                if diff not in ['easy', 'medium', 'hard']:
                    return jsonify({'message': "Invalid difficluty"}), 500
                result = user.update_one(
                    {'_id': user_id},
                    {'$inc': {f'solvedCount.{diff}': 1}}
                )
                
        return jsonify({'message': "Solved count updated"}), 200
            
        pass
    except Exception as err:
        return jsonify({'message':str(err)}), 500
    
    
def checkAcceptedUser(user, data):
    try:
        req_fields = ["problem_id", "user_id"]
        
        for rf in req_fields:
            if rf not in data:
                return jsonify({'message': 'All fields are not passed'}), 400
            
        result = user.find_one({
            "_id": ObjectId(data["user_id"]),
            "solved": {'$in': [ObjectId(data["problem_id"])]}
        })
        
        if result:
            return {"ok": True}, 200
        else:
            return {"ok": False}, 200
        
    except Exception as err:
        return jsonify({'message':str(err)}), 500
    