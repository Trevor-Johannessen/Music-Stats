# SETUP FOR EMPTY MYSQL SERVER

import mysql.connector
from mysql.connector import errorcode
from datetime import datetime

def createDatabase():
    # CONNECT TO AND INITALIZE DATABASE
    db = mysql.connector.connect(
        host="localhost",
        user="root",
        passwd="Gempower#8"
    )
    db.cursor().execute("CREATE DATABASE IF NOT EXISTS songstats")
    db.close()
    



def initalizeTables(mycursor):
    # INITALIZE LISTENS TABLE
    mycursor.execute("""CREATE TABLE IF NOT EXISTS listens(
        id INT AUTO_INCREMENT,
        song_id INT,
        date DATE,
        played BOOLEAN,
        PRIMARY KEY (id)
        )"""
    )

    # INITALIZE SONG TABLE
    # song array format: [songPrimaryKey, title, artistPrimaryKey, albumPrimaryKey, genre, length, dateReleased, dateAdded]
    mycursor.execute("""CREATE TABLE IF NOT EXISTS songs(
        id INT AUTO_INCREMENT,
        name VARCHAR(255) collate utf8_bin,
        artist INT,
        album INT,
        genre INT,
        date_released DATE,
        date_added DATE,
        length TIME,
        PRIMARY KEY (id)
        )"""
    )

    # INITALIZE ALBUM TABLE
    # album array format: [albumPrimaryKey, name, artistPrimaryKey, release date]
    mycursor.execute("""CREATE TABLE IF NOT EXISTS albums(
        id INT AUTO_INCREMENT,
        name VARCHAR(255),
        artist INT,
        date_released DATE,
        PRIMARY KEY (id)
        )"""
    )


    # INITALIZE ARTIST TABLE
    # artist array format: [artistPrimaryKey, name]
    mycursor.execute("""CREATE TABLE IF NOT EXISTS artists(
        id INT AUTO_INCREMENT,
        name VARCHAR(255),
        PRIMARY KEY (id)
        )"""
    )

    mycursor.execute("""CREATE TABLE IF NOT EXISTS genres(
        id INT AUTO_INCREMENT,
        name VARCHAR(255),
        PRIMARY KEY (id)
        )"""
    )

    mycursor.execute(f"""CREATE TABLE IF NOT EXISTS lastupdated(
        date DATETIME
        );
    """)
    mycursor.execute(f"""
    INSERT INTO lastupdated (date) VALUES ('2001/11/22 00:00:00');
    """)

    # INITALIZE UPDATE TABLE
    # update array format: [updatePrimaryKey, timestamp]

def getLastUpdate(cursor):
    try:
        cursor.execute(f"""SELECT * FROM lastupdated""")
        result = cursor.fetchall()[0][0]
        return datetime(result.year, result.month, result.day, 0, 0, 0)
    except:
        return datetime(2100, 0, 0, 0, 0, 0)

def createNewUpdate(cursor, newDatetime):
    cursor.execute(f"""
    DROP TABLE IF EXISTS lastupdated;
    """)
    cursor.execute(f"""CREATE TABLE lastupdated(
        date DATETIME
        );
    """)
    cursor.execute(f"""
    INSERT INTO lastupdated (date) VALUES ('{newDatetime}');
    """)

# ADD SONG TO songs TABLE
def addSong(cursor, title, artistId, albumId, genreId, length, date_released, date_added):
    cursor.execute(f"""INSERT INTO songs
    (name, artist, album, genre, length, date_released, date_added)
    VALUES
    ('{title}', {artistId}, {albumId}, {genreId}, '0:{length}', {date_released}, {date_added})
    """)

def getSong(cursor, title, artistId, albumId):
    searchString = f"SELECT id FROM songs WHERE name = '{title}'"

    if artistId:
        searchString+= f" AND artist = {artistId}"
    if albumId:
        searchString+= f" AND album = {albumId}"

    cursor.execute(searchString)
    result = cursor.fetchall()
    return result

def getSongByString(cursor, title, artist, album):
    cursor.execute(f"""
    SELECT id
    FROM songs 
    WHERE album IN (SELECT id FROM albums WHERE name = '{album}')
    AND artist IN (SELECT id FROM artists WHERE name = '{artist}')
    AND name = '{title}'
    """)
    result = cursor.fetchall()
    #print(f"Result of {title} by {artist} on {album} = ")
    if result == []: # Song has been deleted from itunes library
        return None
    else:
        return result[0][0]

def getAllSongs(cursor):
    cursor.execute(f"""SELECT * FROM songs""")
    result = cursor.fetchall()
    return result

def addAlbum(cursor, albumName, albumArtist, albumRelease):
    cursor.execute(f"""INSERT INTO albums
    (name, artist, date_released)
    VALUES
    ('{albumName}', {albumArtist}, {albumRelease})
    """)

def getAlbum(cursor, albumName, albumArtist):
    cursor.execute(f"""SELECT id FROM albums WHERE 
    name = '{albumName}' AND
    artist = {albumArtist}
    """)
    result = cursor.fetchall()
    return result

def getAllAlbums(cursor):
    cursor.execute(f"""SELECT * from albums""")
    result = cursor.fetchall()
    return result

# TODO ADD ARTIST TO artists TABLE
def addArtist(cursor, artist):
    cursor.execute(f"""INSERT INTO artists
    (name)
    VALUES
    ('{artist}')
    """)

def getArtist(cursor, artist):
    cursor.execute(f"""SELECT id FROM artists WHERE name = '{artist}'
    """)
    result = cursor.fetchall()
    return result

def getAllArtists(cursor):
    cursor.execute(f"""SELECT * FROM artists""")
    result = cursor.fetchall()
    return result

def addGenre(cursor, genre):
    cursor.execute(f"""INSERT INTO genres
    (name)
    VALUES
    ('{genre}')
    """)

def getGenre(cursor, genre):
    cursor.execute(f"""SELECT id FROM genres WHERE name = '{genre}'
    """)
    result = cursor.fetchall()
    return result

def addListen(cursor, songId, date, played):
    cursor.execute(f"""INSERT INTO listens
    (song_id, date, played)
    VALUES
    ({songId}, '{date}', {played})
    """)

