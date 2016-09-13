# -*- coding: utf-8 -*-
import json

def get_json(filename):
    f = open(filename)
    data = json.load(f)
    return data

class ResultData:
    def __init__(self, filename):
        data = get_json(filename)
        self.firstteamchar = filename[filename.index('_') + 1]
        self.secondteamchar = filename[filename.index('_') + 4]
        print(self.firstteamchar)
        

if __name__ == '__main__':
    r = ResultData("../storage/final/match3_AvsB.json")
