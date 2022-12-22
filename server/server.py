from flask import Flask, make_response, request, Response
from flask_cors import CORS
import json
import functools
import mysql.connector
import datetime

app = Flask(__name__)
CORS(app)

db = mysql.connector.connect(
        host="localhost",
        user="root",
        passwd="Gempower#8",
        database="songstats"
    )
mycursor = db.cursor()


valueTable = {
    'plays' : 'listens',
    'skips' : 'listens',
    'length' : 'songs',
    'count' : 'songs'
}

# TODO Add zValue by doing another join
def createCrossJoin(xValue, yValue, zValue):
    xValueSingular = xValue[:-1]
    yValueSingular = yValue[:-1]
    zValueSingular = zValue[:-1]

    selector = ""
    if valueTable[yValue] == 'listens':
        selector = f'(SELECT {xValueSingular} FROM songs WHERE id=listens.song_id)'
    elif valueTable[yValue] == 'songs':
        selector = f'songs.{xValueSingular}'

    return f'{valueTable[yValue]} CROSS JOIN {xValue} ON {selector}={xValue}.id'

def createFilter(filterRules):
    filterString = "WHERE "
    for rule in filterRules:
        type = rule['type']
        if rule['status'] == 'INCLUDES':
            equality = '='
            conjunction = "OR"
        else:
            equality = '!='
            conjunction = "AND"
        if rule == filterRules[0]: # dont add conjunction for first rule
            conjunction = ""
        if type != 'COMPARISON':
            filterString += f'{conjunction} {type}.name{equality}\'{rule["value"]}\''
    return filterString

# xValue: The set of data for the x Axis (artists, albums, genres)
# yValue: The set of data for the y Axis (plays, skips, length, count)
# zValue: The set of data for the z Axis (artists, albums, genres)
# filters: A set of rules to define what data is selected
def createQuery(xValue, yValue, filters=[]):
    filterString = createFilter(filters) if len(filters) > 0 else ''
    if yValue == 'plays' or yValue == 'skips':
        filterString += ' AND ' if filterString != '' else ' WHERE '
        filterString += 'played=0' if yValue == 'skips' else 'played=1'
        selector = f'{xValue}.name'
        addedCrossTable = 'CROSS JOIN listens on songs.id=listens.song_id'
    elif yValue == 'count' or yValue == 'length':
        selector = 'songs.title, albums.name, artists.name, songs.length, songs.date_released, songs.date_added, genres.name'
        addedCrossTable = ''
    return f"SELECT {selector} FROM (((songs CROSS JOIN artists ON songs.artist=artists.id) CROSS JOIN albums ON songs.album=albums.id) CROSS JOIN genres ON songs.genre=genres.id) {addedCrossTable} {filterString}"


@app.route("/bar-chart/")
def barChart():
    # Return error message on empty payload
    if(request.data == b''):
        return Response("Empty payload", status=400, mimetype='text/html')
    print(request.data)
    body = json.loads(request.data.decode('UTF-8'))
    print("GOT RESPONSE:")
    query = createQuery(body['xValue'], body['yValue'], filters=body['filters'])
    print(body['filters'])
    print(query)
    mycursor.execute(query)
    result = mycursor.fetchall()
    #print(result)
    valuesDict = {}

    if body['yValue'] == 'count' or body['yValue'] == 'plays' or body['yValue'] == 'skips': # Aggregate count of artist/album/genre
        if body['yValue'] == 'plays' or body['yValue'] == 'skips':
            index=0
        elif body['xValue'] == 'artists':
            index=2
        elif body['xValue'] == 'albums':
            index=1
        elif body['xValue'] == 'genres':
            index=6
        for value in result:
            name = value[index]
            if name in valuesDict:
                valuesDict[name] += 1
            else:
                valuesDict[name] = 1
        return json.dumps(valuesDict)

    if body['yValue'] == 'length':
        index=0
        if body['xValue'] == 'artists':
            index=2
        elif body['xValue'] == 'albums':
            index=1
        elif body['xValue'] == 'genres':
            index=6
        for value in result:
            name = value[index]
            if name in valuesDict:
                valuesDict[name].append(value[3])
            else:
                valuesDict[name] = [value[3]]
        averageDict = {}
        for key in valuesDict:
            totalTime = 0
            for time in valuesDict[key]:
                totalTime += time.total_seconds()
            averageDict[key] = totalTime / len(valuesDict[key])
        return json.dumps(averageDict)



if __name__ == "__main__":
    app.run()