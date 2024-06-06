from flask import Flask, request, jsonify
from compiler import compiler
from mongoengine import Document, StringField, EmailField, connect, ValidationError
from Authentication import Auth
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# In-memory storage for the example
data_store = {
    "message": "Hello, World! Nice to see you :)"
}

# Configuration for MongoDB
# app.config["MONGODB_SETTINGS"] = {
#     'db': 'CodeQuanta',
#     'host': '127.0.0.1',
#     'port': 27017
# }

# Initialize MongoEngine
connect(db='CodeQuanta', host='localhost', port=27017)


# Testing purpose
@app.route('/', methods=['GET'])
def get_data():
    return jsonify(data_store), 200

#registration
@app.route('/register',methods=['POST'])
def reg():
    data=request.json
    val=Auth.register(data)
    print(val)
    return jsonify(val['message']),val['code']

#login
@app.route('/login',methods=['POST'])
def login():
    data=request.json
    value=Auth.login(data)
    print(value)
    return jsonify(**value),value['code']

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

if __name__ == '__main__':
    app.run(debug=True)
    # compiler.compile_and_run()


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