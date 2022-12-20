import inputDataHandling as parsecsv
import mysqlSetup as sqlConnector
import mysql.connector
from mysql.connector import errorcode
from datetime import datetime

# Connect to database
cursor = sqlConnector.createDatabase()
db = mysql.connector.connect(
        host="localhost",
        user="root",
        passwd="Gempower#8",
        database="songstats"
    )
    #mycursor = db.cursor()
mycursor = db.cursor()
print("Initalizing Tables")
sqlConnector.initalizeTables(mycursor)

# Parse iTunes data
print("Parsing iTunes Data")
parsecsv.parseITunesData(mycursor)

# Parse songStats data
print("Parsing Song Stats Data")
parsecsv.handleSongStatsData(mycursor)

# Set new last update
print("Marking Update Time")
sqlConnector.createNewUpdate(mycursor, datetime.now().strftime("%Y/%m/%d %H:%M:%S")) # current datetime

# close connections
db.commit()
mycursor.close()
db.close()