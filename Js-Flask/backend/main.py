from flask import Flask,request,jsonify
from flask_cors import CORS
from apiParser import *

app = Flask(__name__)
CORS(app)

# Sending static html css and javascript files from these routes
@app.route('/')
def first():
    return app.send_static_file("index.html")

@app.route('/css-style')
def style():
    return app.send_static_file("style.css")

@app.route("/js-javascript")
def javascript():
    return app.send_static_file('javascript.js')

@app.route("/background")
def background():
    return app.send_static_file('background.jpg')

# Actual API endpoints
@app.route('/searchEvents', methods = ['GET','POST'])
def searchEvents():
    if request.method == "GET":
        data = dict()
        data['keyword'] = request.args.get('keyword')
        data['segmentId'] = request.args.get('segmentId')
        data['radius'] = request.args.get('radius')
        data['unit'] = request.args.get('unit')
        data['latitude'] = request.args.get('latitude')
        data['longitude'] = request.args.get('longitude')
        result = searchAllEvents(data)
        return jsonify(result)
    result = dict()
    result["error"] = "Only get requests are allowed"
    return jsonify(result)

@app.route('/eventDetails', methods = ["GET", "POST"])
def getEventDetails():
    if request.method == "GET":
        id = request.args.get("id")
        result = searchEventDetails(id)
        return jsonify(result)
    result = dict()
    result["error"] = "Only get requests are allowed"
    return jsonify(result)
    
@app.route('/venueDetails', methods = ["GET", "POST"])
def getVenueDetails():
    if request.method == "GET":
        venue = request.args.get("keyword")
        result = searchVenueDetails(venue)
        return jsonify(result)
    result = dict()
    result["error"] = "Only get requests are allowed"
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug = True)
