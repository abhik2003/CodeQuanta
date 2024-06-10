from bson.objectid import ObjectId

def addSubmission(data, submissions):
    #problem_id, user_id, code, extension, verdict(initially pending)
    required_fields = ['problem_id', 'user_id', 'code', 'extension', 'verdict', 'status']
    
    for rf in required_fields:
        if rf not in data:
            return {'code':400,'message':'Error in adding submission'}
    
    try:
        data['problem_id'] = ObjectId(data['problem_id'])
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

        



