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

def createFilter(cursor, xValue, yValue, filters=[]):
    innerFilter=''
    outerFilter=''
    limit = ''
    
    for rule in filters:
        status = rule['status']
        type = rule['type']
        value = rule['value']
        comparator = rule['comparator']
        conjunction = ''
        equality = ''

        if status == "INCLUDES":
            equality = '='
            conjunction = "OR"
        elif status == "EXCLUDES":
            equality = '!='
            conjunction = "AND"
        if type == "LIMIT#" or type == "LIMIT%":
            limit = rule
        elif type == 'artists' or type == 'albums' or type == 'songs':
            conjunction = '' if innerFilter == '' else conjunction
            if comparator == '=':
                innerFilter += f'{conjunction} {type}.name{equality}\'{value}\''
            elif comparator == 'contains':
                innerFilter += f'{conjunction} locate(\'{value}\',{type}.name) > 0'
        elif type == yValue:
            conjunction = '' if outerFilter == '' else conjunction
            outerFilter += f'{conjunction} unique_item {rule["comparator"]} {value}'

    if yValue == 'plays':
        innerFilter = '' if innerFilter == '' else f'AND{innerFilter}' 
        innerFilter = f'listens.played = 1 {innerFilter}'
    elif yValue == 'skips':
        innerFilter = '' if innerFilter == '' else f'AND{innerFilter}' 
        innerFilter = f'listens.played = 0 {innerFilter}'
    
    if innerFilter != '':
        innerFilter = f'WHERE {innerFilter}'
    if outerFilter != '':
        outerFilter = f'WHERE {outerFilter}'


    return innerFilter,outerFilter,limit

def createQuery(cursor, xValue, yValue,filters=[]):
    selector = '*'
    # createFilter should append WHERE to these when creating first filter
    innerFilters = '' # filter for x variables (artist, album, song {INCLUDE artist contains "McGraw"})
    outerFilters = '' # filters for y variables (count, plays, skips {INCLUDE count > 10}) Can only filter on the yValue you've chosen
    limit = ''  # decides how many values will be returned
    crossJoin = "(((songs CROSS JOIN artists ON songs.artist=artists.id) CROSS JOIN albums ON songs.album=albums.id) CROSS JOIN genres ON songs.genre=genres.id)"
    innerFilters, outerFilters, limit = createFilter(cursor, xValue, yValue, filters)
    addedCrossJoin = ''
    if yValue == 'plays' or yValue == 'skips' or yValue == 'count':
        addedCrossJoin = 'CROSS JOIN listens on songs.id=listens.song_id' if yValue == 'plays' or yValue == 'skips' else ''
        distinctiveness = '' if yValue == 'plays' or yValue == 'skips' else 'DISTINCT'
        queryHeader = f"COUNT({distinctiveness} songs.name)"
    elif yValue == 'length':
        queryHeader = f"AVG(TIME_TO_SEC(songs.length))"
    query = f"""
    SELECT * FROM (
        SELECT 
            {xValue}.name, {queryHeader}
        AS
            unique_item
        FROM
            {crossJoin} {addedCrossJoin}
        {innerFilters}
        GROUP BY
            {xValue}.name
    ) AS innerTable
    {outerFilters}
    ORDER BY unique_item DESC
    """
    return query, limit

@app.route("/api/bar-chart/", methods=['PUT'])
def barChart():
    # Get and Decode Data
    if(request.data == b''):
        return Response("Empty payload", status=400, mimetype='text/html')
    print(request.data)
    body = json.loads(request.data.decode('UTF-8'))

    # Create the trigger SQL query
    query, limit = createQuery(mycursor, body['xValue'], body['yValue'], filters=body['filters'])
    print(query)
    mycursor.execute(query)
    result = mycursor.fetchall()

    # Turn into array form for barchart
    valuesArr = []
    for var in result:
        valuesArr.append({'x':var[0], 'y':var[1]})

    # Filter to the correct amount of return items
    if limit:
        status = limit['status']
        type = limit['type']
        value = limit['value']
        if type=="LIMIT#":
            limitingAmount = value
        elif type=="LIMIT%":
            limitingAmount = round(len(valuesArr) * value)
        if status == 'INCLUDES':
            return valuesArr[0:limitingAmount]
        elif status == 'EXCLUDES':
            return valuesArr[limitingAmount:]
    else:
        print('No Limit Set')
    return valuesArr



if __name__ == "__main__":
    app.debug = True
    app.run()