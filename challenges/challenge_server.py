from flask import Flask, request, make_response
from data_interface import *
import json

app = Flask(__name__)

@app.route('/challenges', methods=['GET', 'POST'])
def challenges():
    if request.method == 'OPTIONS':
        resp = make_response("Proceed", 200)
        resp.headers['Access-Control-Allow-Origin'] = "*"
        return resp

    data = DataInterface()
    resp = make_response(json.dumps({"data": data.list_challenges()}), 200)
    resp.headers['Access-Control-Allow-Origin'] = "*"
    return resp
    

@app.route('/addchallenge', methods=['GET'])
def add_challenge():
    if request.method == 'OPTIONS':
        resp = make_response("Proceed", 200)
        resp.headers['Access-Control-Allow-Origin'] = "*"
        return resp

    name = request.args.get("name")
    points = request.args.get("points")
    path = request.args.get("path")

    data = DataInterface()
    data.add_challenge(name, points, path)
    resp = make_response("Success", 200)
    resp.headers['Access-Control-Allow-Origin'] = "*"
    return resp

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3011)