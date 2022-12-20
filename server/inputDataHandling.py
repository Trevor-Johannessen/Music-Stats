import pandas as pd
import numpy as np
import re
from csv import reader
from datetime import datetime
import mysqlSetup as sqlConnector

# THIS FUNCTION PARSES A CSV FILE INTO SONG DATA
#
# STEPS:
#   1. Remove duplicates
#     Song Stats puts more duplicates every day into the database, must clear them out first thing. 
#   2. Convert Plays to Boolean
#     Plays are marked in absolute numbers, this number is made up of missing data so it is best to convert to a boolean of whether a song was played or skipped.
#   3. Drop Columns
#     Drop all columns that are now unneeded
#   4. Remove rows from September 23rd 2021 (Start of data, lots of incorrect values)
#
def handleSongStatsData(myCursor):
    # READ FILE
    df = pd.read_csv('./Song_Stats_Export.csv')

    # GET LAST DATA SUBMISSION
    lastUpdate = sqlConnector.getLastUpdate(myCursor)
    # CLEAN DATA
    df = df.dropna()
    df = df.drop_duplicates(subset=['Song Title', 'Album Artist', 'Plays (as of date)', 'Skips (as of date)'])
    df['Played'] = df['Plays (as of date)'].ne(df['Plays (as of date)'].shift())
    df = df.drop(columns=['persistentID','persistentArtist','persistentAlbum','persistentGenre','dateID','Plays (as of date)', 'Skips (as of date)'])
    df = df[df['Date'] != "Sep 23, 2021 at 10:45:47 PM"]
    df['Date'] = pd.to_datetime(df['Date'])
    df = df[(df['Date'] > lastUpdate)]
    #df.to_csv('./output.csv', index=False) 

    # INSERT DATA INTO DATABASE
    #def addListen(cursor, title, artist, album, genre, date, played):
    for index, row in df.iterrows():
        title = row["Song Title"].replace('\'', '\'\'').replace('"','')
        artist = row["Album Artist"].replace('\'', '\'\'').replace('"','')
        album = row["Album"].replace('\'', '\'\'').replace('"','')
        songId = sqlConnector.getSongByString(myCursor, title, artist, album)
        if songId: # Songs no longer in the itunes library will be skipped.
            sqlConnector.addListen(myCursor, songId, row["Date"], row["Played"])

# THIS FUNCTION PARSES A CSV FILE INTO RELATIONAL DATABASE DATA
# All these dictionaries should map to arrays
def parseITunesData(myCursor):
    songDict = {} 
    albumDict = {}  
    artistDict = {}
    def handleITunesData():
        with open('iTunesSongData.csv', 'r') as file:
            csvReader = reader(file)
            for song in csvReader:
                if song[0] == 'Title' and song[2] == 'Album Artist' and song[3] == 'Album' or song[1] == '': # ignore headers or if time is empty (song hasn't released yet)
                    continue
                if song[2] == '': # some songs dont have album artist, so just fill it in with artist
                    song[2] = song[10]
                
                # Shift dateReleased to YYYY-MM-DD
                if song[7] != '':
                    song[7] = f"'{datetime.strptime(song[7], '%m/%d/%Y').strftime('%y-%m-%d')}'"
                else:
                    song[7] = 'NULL'

                # Shift dateAdded to YYYY-MM-DD hh:mm:ss
                if song[8] != '':
                    song[8] = f"'{datetime.strptime(song[8], '%m/%d/%Y %H:%M').strftime('%y-%m-%d %H:%M')}'"
                else:
                    song[8] = 'NULL'

                # Escape single quotes
                song[0] = song[0].replace('\'', '\'\'') # Title
                song[2] = song[2].replace('\'', '\'\'') # Artist
                song[3] = song[3].replace('\'', '\'\'') # Album
                song[4] = song[4].replace('\'', '\'\'') # Genre

                # Remove Double Quotes Entirely (iTunes sometimes removes double quotes with little consistency)
                song[0] = song[0].replace('"', '') # Title
                song[2] = song[2].replace('"', '') # Artist
                song[3] = song[3].replace('"', '') # Album
                song[4] = song[4].replace('"', '') # Genre

                # CHECK IF SONG IS NOT ALREADY IN SONGS TABLE

                # Create keys
                songKey = f'{song[0]}+{song[2]}+{song[3]}' # key = name+artist+album
                songPrimaryKey = len(songDict)
                albumKey = f'{song[2]}+{song[3]}' # key = artist+album
                if albumKey not in albumDict:
                    createAlbum(albumKey, song[3], song[2], song[7], myCursor)


                # song array format: [title, artistPrimaryKey, albumPrimaryKey, genre, length, dateReleased, dateAdded]
                createSong(song[0], artistDict[song[2]][0], albumDict[albumKey][0], song[4], song[1], song[7], song[8], songKey, myCursor)

    def createSong(title, artistId, albumId, genre, length, date_released, date_added, songKey, myCursor):
        # Check if song is already in database
        songQuery = sqlConnector.getSong(myCursor, title, artistId, albumId)
        if len(songQuery) > 0:
            songDict[songKey] = [songQuery[0], title, artistId, albumId, genre, length, date_released, date_added]
            return
        # Add song to database
        sqlConnector.addSong(myCursor, title, artistId, albumId, genre, length, date_released, date_added)
        # Get song from database
        songId = sqlConnector.getSong(myCursor, title, artistId, albumId)[0][0]
        # Insert song into songsDict
        songDict[songKey] = [songId, title, artistId, albumId, genre, length, date_released, date_added]

    def createAlbum(albumKey, title, artist, release_date, myCursor):
        # Add artist if not exists
        if artist not in artistDict:
            createArtist(artist, myCursor)
        # Check if album is already in database
        albumQuery = sqlConnector.getAlbum(myCursor, title, artistDict[artist][0])
        if len(albumQuery) > 0:
            albumDict[albumKey] = [albumQuery[0][0], title, artistDict[artist][0], release_date]
            return
        # Add album to database
        sqlConnector.addAlbum(myCursor, title, artistDict[artist][0], release_date)
        # Get album from database
        albumId = sqlConnector.getAlbum(myCursor, title, artistDict[artist][0])[0][0]
        # Insert album into albumsdict
        albumDict[albumKey] = [albumId, title, artistDict[artist][0], release_date]

    def createArtist(artist, myCursor):
        if artist != '':
            artistQuery = sqlConnector.getArtist(myCursor, artist)
            if len(artistQuery) > 0:
                artistDict[artist] = [artistQuery[0][0], artist]
                return
            # Add artist to database
            sqlConnector.addArtist(myCursor, artist)

            # Get artist from database
            artistId = sqlConnector.getArtist(myCursor, artist)[0][0]
            # Add artist to dict
            artistDict[artist] = [artistId, artist]

    handleITunesData()
    return (songDict, albumDict, artistDict)
