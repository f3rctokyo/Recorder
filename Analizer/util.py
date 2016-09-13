import os
import json
import team
import info

def getFiles():
    return os.listdir(info.datapath)

def get_json(filename):
    f = open(info.datapath + filename)
    data = json.load(f)
    return data

#TODO: need to separate game dependence factor
class ResultData:
    def __init__(self, filename):
        data = get_json(filename)
        self.matchnum = filename[filename.index('_') - 1]
        self.firstteamchar = filename[filename.index('_') + 1]
        self.secondteamchar = filename[filename.index('_') + 4]

        self.f_chaiyo = False
        self.s_chaiyo = False
        self.vgoal = False
        self.vgoalspeed = False
        if data["vgoal"] == "on":
            print(data)
            self.vgoalspeed = int(data["chaiyotime"])
            if data["winner"] == "team1":
                self.f_chaiyo = True
            else:
                self.s_chaiyo = True
        self.team1points = int(data["points_1"])
        self.team2points = int(data["points_2"])

    def reflectMatchData(self, teams):
        team1 = teams[self.firstteamchar]
        team2 = teams[self.secondteamchar]

        team1.update(self.team1points, self.f_chaiyo, self.vgoalspeed)
        team2.update(self.team2points, self.s_chaiyo, self.vgoalspeed)
