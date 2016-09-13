class Team:
    def __init__(self, name):
        self.name = name
        self.chaiyotimes = 0
        self.mostfastchaiyo = False
        self.totalpoints = 0

    def update(self, getpoints, chaiyo, chaiyospeeed):
        self.totalpoints += getpoints
        if chaiyo:
            self.chaiyotimes += 1
            #TODO: nest...
            if chaiyospeeed <= self.mostfastchaiyo:
                self.mostfastchaiyo = chaiyospeeed

    def getTeamData(self):
        return [self.chaiyotimes, self.mostfastchaiyo, self.totalpoints]
