import requests
from flask import Flask, request, make_response
from data_interface import *
import json

app = Flask(__name__)

def get_twitch_user(auth_token):
    return json.loads(requests.get("https://id.twitch.tv/oauth2/userinfo", headers={"Authorization": "Bearer {}".format(auth_token)}).content)["preferred_username"]

def get_use_from_id_token():
    pass

def preflight(request):
   resp = make_response("Proceed", 200)
   resp.headers['Access-Control-Allow-Origin'] = "*"
   return resp

@app.route('/songs')
def list_songs():
    d = DataInterface()
    return json.dumps(d.list_songs())


@app.route('/requests')
def list_requests():
    d = DataInterface()
    return json.dumps(d.list_requests())

@app.route('/finishsong', methods=['POST', 'OPTIONS'])
def finish_song():

    if request.method == 'OPTIONS':
        return preflight(request)

    data = json.loads(request.data)
    auth_token = data['auth_token']

    try:
        twitch_user_name = get_twitch_user(auth_token)
    except Exception as e:
        print(e)
        resp = make_response("Authorization failed", 401)
        resp.headers['Access-Control-Allow-Origin'] = "*"
        return resp

    if not twitch_user_name == "fendull":
        resp = make_response("You are unauthorized to add songs", 403)
        resp.headers['Access-Control-Allow-Origin'] = '*'
        return resp
    
    d = DataInterface()
    d.finish_song()

    resp = make_response("Success", 200)
    resp.headers['Access-Control-Allow-Origin'] = '*'
    return resp

@app.route('/playsong', methods=['POST', 'OPTIONS'])
def play_song():

    if request.method == 'OPTIONS':
        resp = make_response("Proceed", 200)
        resp.headers['Access-Control-Allow-Origin'] = "*"
        return resp

    data = json.loads(request.data)
    auth_token = data['auth_token']

    try:
        twitch_user_name = get_twitch_user(auth_token)
    except Exception as e:
        print(e)
        resp = make_response("Authorization failed", 401)
        resp.headers['Access-Control-Allow-Origin'] = "*"
        return resp

    if not twitch_user_name == "fendull":
        resp = make_response("You are unauthorized to add songs", 403)
        resp.headers['Access-Control-Allow-Origin'] = '*'
        return resp
    
    d = DataInterface()
    d.play_song(data['title'], data['by'])

    resp = make_response("Success", 200)
    resp.headers['Access-Control-Allow-Origin'] = '*'
    return resp

@app.route('/addsong', methods=['POST', 'OPTIONS'])
def add_song():

    if request.method == 'OPTIONS':
        resp = make_response("Proceed", 200)
        resp.headers['Access-Control-Allow-Origin'] = "*"
        return resp

    data = json.loads(request.data)
    auth_token = data['auth_token']

    try:
        twitch_user_name = get_twitch_user(auth_token)
    except Exception as e:
        print(e)
        resp = make_response("Authorization failed", 401)
        resp.headers['Access-Control-Allow-Origin'] = "*"
        return resp

    if not twitch_user_name == "fendull":
        resp = make_response("You are unauthorized to add songs", 403)
        resp.headers['Access-Control-Allow-Origin'] = '*'
        return resp
    
    d = DataInterface()
    d.add_song(data['title'], data['by'], data['link'], data['tags'])

    resp = make_response("Success", 200)
    resp.headers['Access-Control-Allow-Origin'] = '*'
    return resp

@app.route('/deletesong', methods=['POST', 'OPTIONS'])
def delete_song():

    if request.method == 'OPTIONS':
        resp = make_response("Proceed", 200)
        resp.headers['Access-Control-Allow-Origin'] = "*"
        return resp
    print(request.data)
    data = json.loads(request.data)
    auth_token = data['auth_token']

    try:
        twitch_user_name = get_twitch_user(auth_token)
    except Exception as e:
        print(e)
        resp = make_response("Authorization failed", 401)
        resp.headers['Access-Control-Allow-Origin'] = "*"
        return resp

    if not twitch_user_name == "fendull":
        resp = make_response("You are unauthorized to add songs", 403)
        resp.headers['Access-Control-Allow-Origin'] = '*'
        return resp
    
    d = DataInterface()
    d.delete_song(data['title'], data['by'])

    resp = make_response("Success", 200)
    resp.headers['Access-Control-Allow-Origin'] = '*'
    return resp

@app.route('/requestsong', methods=['POST', 'OPTIONS'])
def request_song():

    if request.method == 'OPTIONS':
        resp = make_response("Proceed", 200)
        resp.headers['Access-Control-Allow-Origin'] = "*"
        return resp

    data = json.loads(request.data)
    auth_token = data['auth_token']

    try:
        twitch_user_name = get_twitch_user(auth_token)
    except Exception as e:
        print(e)
        resp = make_response("Authorization failed", 401)
        resp.headers['Access-Control-Allow-Origin'] = "*"
        return resp

    d = DataInterface()
    result = d.request_song(data['title'], data['by'], twitch_user_name)

    resp = make_response(result, 200)
    resp.headers['Access-Control-Allow-Origin'] = '*'
    return resp

@app.route('/nowplaying', methods=['GET'])
def current_song():
    d = DataInterface()

    result = d.currently_playing()
    print(result)
    if len(result) > 0:
        return json.dumps(result)
    return result

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3033)
