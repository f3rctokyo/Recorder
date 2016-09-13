# -*- coding: utf-8 -*-

import os

def getFiles():
    return os.listdir('../storage/qualification/')

if __name__ == '__main__':
    for file in getFiles():
        print(file)
