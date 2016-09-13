import util
import info
import team

def main():
    teams = {}
    #TODO: make info
    for n in info.teamlist:
        teams[n] = team.Team(n)
    filenames = util.getFiles()
    for f in filenames:
        r = util.ResultData(f)
        r.reflectMatchData(teams)

    #test
    for n in teams:
        print(teams[n].getTeamData())

if __name__ == '__main__':
    main()
