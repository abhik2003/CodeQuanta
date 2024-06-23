from bson.objectid import ObjectId
from flask import jsonify

def submitSolution(solutions, data):
    required_fields = ['problem_id', 'user_id', 'solution','timestamp']
    
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
    required_fields = ['solution_id', 'user_id', 'solution']
    
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
                'solution': data['solution']
            }
        }
        
        result = solutions.update_one(filter_query, update_query)
        
        #if the solution_id and user_id do not match
        if result.matched_count == 0:
            return jsonify({'message': 'User has no access to update'}), 404
        
        return jsonify({'message': "Solution updated successfully"}), 200
    except Exception as err:
        return jsonify({'message': str(err)}), 500
