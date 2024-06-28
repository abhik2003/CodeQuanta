from flask import Flask, request, jsonify
from compiler import compiler
from mongoengine import Document, StringField, EmailField, connect, ValidationError
from Authentication import Auth
from flask_cors import CORS
import pymongo
from Questions import Question
from dotenv import load_dotenv
import os
import random
from CodeJudge import CodeJudge
from Submissions import Submissions
from Solutions import Solutions
from datetime import datetime


# Load environment variables from the .env file
load_dotenv()
MONGODB_URL = os.getenv('MONGODB_URL')
app = Flask(__name__)
CORS(app)

# In-memory storage for the example
data_store = {
    "message": "Hello, World! Nice to see you :)"
}

myclient = pymongo.MongoClient(MONGODB_URL)
mydb = myclient["CodeQuanta"]
user = mydb["user"]#collection for storing users
problems = mydb["problems"]#collection for storing problems
submissions = mydb["submissions"]#collection for storing submissions
admins=mydb["admins"]#collection for admins
solutions=mydb["solutions"] #collection for solutions

# Testing purpose
@app.route('/', methods=['GET'])
def get_data():
    return jsonify(data_store), 200

#registration
@app.route('/register',methods=['POST'])
def reg():
    data=request.json
    val=Auth.register(data,user)
    print(val)
    return jsonify(val['message']),val['code']

#login
@app.route('/login',methods=['POST'])
def login():
    data=request.headers.get('Authorization')
    value=''
    if(data is not None):
        
        data=data.split(' ')[1]
        value=Auth.login([data,1],user,admins)
    else:
        data=request.json
        value=Auth.login([data,0],user,admins)

    # print(value)
    return jsonify(**value),value['code']


#user-profile
@app.route('/user-profile',methods=['POST'])
def userProfile():
    
    userName=request.json.get('userName')
    value=Auth.profile(userName,user)
    return jsonify(**value),value.get('code')


#add admin
@app.route('/add-admin',methods=['POST'])
def addnewadmin():
    data=request.json
    value=Auth.addAdmin(data,admins,user)
    return jsonify(**value),value['code']

#get problem for update by admin
@app.route('/get-problem-admin',methods=['POST'])
def gtproblemadmin():
    data=request.json
    value=Question.getTotalProblem(problems,data.get('id'))
    return jsonify(**value),value['code']

#update problem
@app.route('/update-problem-admin',methods=['POST'])
def updproblemadmin():
    data=request.json
    # print(data)
    value=Question.updateProblem(problems,data)
    return jsonify(**value),value['code']
    # return jsonify(message='ok'),200


# Compile the code and get output
@app.route('/compile', methods=['POST'])
def compile():
    if not request.json :
        return jsonify({"error": "Invalid data"}), 400
    req = request.json
    if 'code' not in req or 'input' not in req or 'submission_id' not in req or 'extension' not in req or 'time_limit' not in req:
        res = {
            "message" : "Something is missing in request"
        }
        return jsonify(res), 400
    
    result = compiler.compile_and_run(req['code'],req['input'],req['submission_id'],req['extension'],req['time_limit'])
    res = {
        "status": result[0],
        "verdict": result[1]
    }
    return jsonify(res), 200


#add problems to the problems set
@app.route('/add-problems', methods=['POST'])
def addpb():
    data=request.json
    # print(data)
    # return jsonify(message='ok'),200
    value=Question.addquestions(data,problems,admins)
    return jsonify(**value),value.get('code')


#GET all questions
#http://127.0.0.1:5000/questions?page=0
@app.route('/questions', methods=['GET'])
def getpb():
    page=0
    if(request.args.get('page')is not None):
        page=int(request.args.get('page'))
    qvalue=Question.getAllQuestions(problems,page)
    # print(jsonify(**qvalue))
    # return jsonify(message='ok'),200

    return jsonify(**qvalue),qvalue.get('code')

#get particular question
@app.route('/get-question', methods=['POST'])
def getparticularpb():
    data=request.json
    qvalue=Question.getParticularQuestion(problems,data.get('id'))
    # print(jsonify(**qvalue))
    # return jsonify(message='ok'),200

    return jsonify(**qvalue),qvalue.get('code')
#Get total problems count
@app.route('/total-problems-count', methods=['GET'])
def getTotalProblemsCount():
    count = Question.getTotalProblemsCount(problems)
    if count['code']!=200:
        res = {
            "message": count.get('message')
        }
        return jsonify(res), count.get('code')
    else:
        res = {
            'totalCount' : count['total-count']
        }
        return jsonify(res), 200

#Submit problem answer
@app.route('/submit-answer', methods=['POST'])
def submitAnswer():
    data = request.json   #problem_id, code, extension, user_id
    required_fields = ['problem_id', 'code', 'extension', 'user_id']
    
    for rf in required_fields:
        if rf not in data:
            res = {
                "message" : "Something is missing in request"
            }
            return jsonify(res), 400
        
    # Process the data 
    problem_id = data['problem_id']
    code = data['code']
    extension = data['extension']
    user_id = data['user_id']
    
    question = Question.getProblemDetails(problems=problems, id=problem_id)
    if question['code']!=200:
        res = {
            "message": question.get('message')
        }
        return jsonify(res), question.get('code')
    else:
        try:
            
            question = question.get('question')
            print(question)
            tester_code = question.get('checker_code').get('code')
            tester_code_extension = question.get('checker_code').get('language')
            test_cases = question.get('test_cases')
            test_cases = [tc["input"] for tc in test_cases]
            submission_id = "sub"+str(random.randint(100000000,1000000000))
            time_limit = 3
            submission_data={
                'problem_id': problem_id,
                'user_id': user_id,
                'code': code,
                'extension': extension,
                'verdict': "Pending",
                'status': -1,
                'timestamp': datetime.utcnow() 
            }
            sub_res = Submissions.addSubmission(submission_data, submissions)
            if sub_res['code']==200:
                print(sub_res['submission_id'])
                # return jsonify({}),200
                submission_id = str(sub_res['submission_id'])
                result = CodeJudge.Judge(code, submission_id, extension, time_limit, tester_code, tester_code_extension, test_cases)
            
                res = {
                    "status": result[0],
                    "verdict": result[1]
                }
                
                data = {
                    'id': submission_id,
                    'verdict': res['verdict'],
                    'status': int(res['status'])
                }
                update_res = Submissions.updateVerdict(data, submissions)
                
                if res['status']: #if Accepted sol then add it to the users' solved problem list
                    solvedProbUpdate_res = Submissions.updateUserSolvedProblem(problem_id, user_id, user, problems)
                    
                
                if update_res['code'] == 200:
                    return jsonify(res), 200
                else:
                    return jsonify(update_res), update_res['code']
            else:
                return jsonify(sub_res), sub_res['code']
        except Exception as err:
            return jsonify({'message':str(err)}), 500
    
#Get all submissions of an user
@app.route('/get-submissions-user-all', methods=['POST'])
def getAllSubmissionUser():
    try:
        req = request.json
        print(req)
        user_id = req.get('user_id')
        page = req.get('page')
        count = req.get('count')
        return Submissions.getAllSubmissionUser(user_id, page, count, submissions)
    except Exception as err:
            return jsonify({'message':str(err)}), 500
        
#Get all submissions of an user against a problem
@app.route('/get-submissions-user-problem', methods=['POST'])
def getAllSubmissionUserProblem():
    try:
        req = request.json
        user_id = req.get('user_id')
        problem_id = req.get('problem_id')
        return Submissions.getAllSubmissionUserProblem(user_id, problem_id, submissions)
    except Exception as err:
            return jsonify({'message':str(err)}), 500

 #Check whether user has accepted submission for a particular problem
@app.route('/check-accepted-user', methods=['POST'])
def checkAcceptedUser():
    try:
        data = request.json
        return Submissions.checkAcceptedUser(user, data)
    
    except Exception as err:
        return jsonify({'message':str(err)}), 500

 
 
#Post solution for a problem
@app.route('/add-solution', methods=['POST'])
def submitSolution():
    try:
        data = request.json
        data['timestamp']=datetime.utcnow()
        return Solutions.submitSolution(solutions, data)
    except Exception as err:
        return jsonify({'message':str(err)}), 500
    
#Update solution for a problem
@app.route('/update-solution', methods=['POST'])
def updateSolution():
    try:
        data = request.json
        return Solutions.updateSolution(solutions, data)
    except Exception as err:
        return jsonify({'message':str(err)}), 500
    
#get all solutions for a problem
@app.route('/get-all-solutions', methods=['POST'])
def getallsols():
    data=request.json
    value=Solutions.getAllSolutions(solutions,data,user)
    return jsonify(**value),value.get('code')

#get particular solution for a problem
@app.route('/get-one-solution', methods=['POST'])
def getonesols():
    data=request.json
    value=Solutions.getParticularSolution(solutions,data,user)
    return jsonify(**value),value.get('code')

    
    
if __name__ == '__main__':
    app.run(debug=True)


#Sample compile data
'''
{
    "code": "#include <iostream>\nusing namespace std;\nint main() {\n    cout << \"Hello, world!\" << endl;\n    int n;\n    cin >> n;\n\n    while(n--){\n        int x;\n        cin >> x;\n        cout << x*x <<\" \";\n    }\n    return 0;\n}\n"
,
    "input": "5\n1 2 3 4 5",
    "submission_id": "123",
    "extension": "cpp",
    "time_limit" : 2
}
'''


#Submit answer sample

# {
#     "problem_id" : "66660662a11801a1c015274f",
#     "code": "n = int(input())\na = list(map(int, input().split()))\nans = [i*i for i in a]\nprint(*ans)",
#     "extension": "py",
#     "user_id": "100"
# }