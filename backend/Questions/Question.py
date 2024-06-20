from bson.objectid import ObjectId


def addquestions(data, problems, admins):
    if ('statement' not in data or 'description' not in data or 'test_cases' not in data or 'difficulty' not in data or 'checker_code' not in data):
        return {'code': 500, 'message': 'Error adding the problem'}
    else:
        try:
            uid = data['id']
            del data['id']
            
            # myadmin=admins.find_one({'email':email})
            pb = problems.insert_one(data)
            print(str(pb.inserted_id))
            admins.update_one(
                {'userId': uid},
                {
                    # Increment the count by 1
                    '$inc': {'questionsAdded.count': 1},
                    # Add the new question ID to the list
                    '$push': {'questionsAdded.questionId': str(pb.inserted_id)}
                }
            )
            # myadmin['questionsAdded']['count']+=1
            # myadmin['questionsAdded']['questionId'].append(str(pb.inserted_id))
            # print(pb.inserted_id)
            return {'code': 200, 'message': 'Successfully added the question'}
        except Exception as err:
            return {'code': 500, 'message': str(err)}


def getAllQuestions(problems, page):
    qt = []
    try:
        questions = list(problems.find(
            {}, {"statement": 1, 'description': 1, 'difficulty': 1}).skip(page*10).limit(10))
        qt = [
            {
                "id": str(question["_id"]),
                "statement": question["statement"],
                "description": question["description"],
                "difficulty": question["difficulty"]
            }
            for question in questions
        ]
        totalCount=problems.count_documents({})
        return {'questions': qt, 'code': 200,'totalCount':totalCount}
    except Exception as err:
        return {'code': 500, 'message': str(err)}


def getParticularQuestion(problems, id):
    if (id is None):
        return {'code': 400, 'message': 'specify the question id'}
    try:
        obj_id = ObjectId(id)
        # print(obj_id)
        question = problems.find_one(
            {"_id": obj_id}, {"statement": 1, 'description': 1, 'difficulty': 1})
        # print(question)
        if (question is None):
            return {'code': 400, 'message': 'question not found'}
        question["id"] = str(question["_id"])
        del question["_id"]

        return {'code': 200, 'question': question}
    except Exception as err:
        return {'code': 500, 'message': str(err)}


def getProblemDetails(problems, id):
    if (id is None):
        return {'code': 400, 'message': 'specify the question id'}
    try:
        obj_id = ObjectId(id)
        # print(obj_id)
        question = problems.find_one(
            {"_id": obj_id}, {"test_cases": 1, 'checker_code': 1})
        # print(question)
        if (question is None):
            return {'code': 400, 'message': 'question not found'}
        # question["id"]=str(question["_id"])
        del question["_id"]

        return {'code': 200, 'question': question}
    except Exception as err:
        return {'code': 500, 'message': str(err)}

def getTotalProblem(probelms,id):
    obj={'code':200,'message':''}
    if(id is None):
        obj['code']=400
        obj['message']='Id not found'
        return obj
    try:
        obj_id=ObjectId(id)
        pb=probelms.find_one({'_id':obj_id},{})
        if(pb is None):
            obj['code']=400
            obj['message']='Id not found'
            return obj
        pb['id']=str(pb['_id'])
        del pb['_id']
        obj['question']=pb
        return obj
    except Exception as err:
        obj['code']=500
        obj['message']=str(err)
        return obj


def updateProblem(probelms,data):
    obj={'code':200,'message':''}
    if(data.get('id') is None):
        obj['code']=400
        obj['message']='Id not found'
        return obj
    try:
        obj_id=ObjectId(data.get('id'))
        question=data.get('question')
        question['_id']=obj_id
        
        item=probelms.find_one({'_id':obj_id},{})
        print(item)
        pb=probelms.replace_one({'_id':obj_id},question)
        print(pb)
        if(pb.modified_count>0):
            obj['message']='Updated question successfully'
        else:
            obj['code']=500
            obj['message']='Question not found'
        return obj
    except Exception as err:
        obj['code']=500
        obj['message']=str(err)
        return obj
def getTotalProblemsCount(problems):
    try:
        totalCount=problems.count_documents({})
        return {'code': 200, 'total-count': totalCount}
    except Exception as err:
        return {'code': 500, 'message': str(err)}

# {
#   "statement": "Calculate the Factorial of a Number",
#   "description": "Given a non-negative integer, your task is to compute its factorial. The factorial of a non-negative integer n is the product of all positive integers less than or equal to n. It is denoted by n!. For example, 5! = 5 × 4 × 3 × 2 × 1 = 120.",
#   "test_cases": [
#     {"input": 0},
#     {"input": 1},
#     {"input": 2},
#     {"input": 3},
#     {"input": 4},
#     {"input": 5},
#     {"input": 6},
#     {"input": 7},
#     {"input": 8},
#     {"input": 9},
#     {"input": 10}
#   ],
#   "difficulty": "Easy",
#   "checker_code": {
#     "code":"def check_factorial(input_value, output_value):\n    import math\n    return math.factorial(input_value) == output_value",
#     "language":"python"
#   }
# }
'''
 {
        "checker_code": {
            "code": "def calculate_sum(input_array):\\n    return sum(input_array)",
            "language": "py"
        },
        "description": "Given an array of integers, your task is to calculate the sum of its elements. \nExample:\nInput: [1, 2, 3]\nOutput: 5",
        "difficulty": "medium",
        "id": "666ab05a2e8f8388e66f4f73",
        "statement": "Calculate the Sum of an Array",
        "test_cases": [
            {
                "input": "[1, 2, 3, 4, 5]"
            },
            {
                "input": "[-1, 2, 5]"
            },
            {
                "input": "[5]"
            }
        ]
    }'''
