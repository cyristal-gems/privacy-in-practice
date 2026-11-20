"""Refresh official congressional rosters during an authorized election review.

Initial setup: --initial --apply. Later: --states CA,NY --election-date YYYY-MM-DD
and --apply after confirming serving rosters. Without --apply, print a diff summary.
Election winners are never inferred; only current official roster entries are used.
"""
import argparse, datetime, json, pathlib, urllib.request, xml.etree.ElementTree as ET

ROOT = pathlib.Path(__file__).resolve().parents[1]
HOUSE_SOURCE = 'https://clerk.house.gov/xml/lists/MemberData.xml'
SEATS = dict(zip('AL AK AZ AR CA CO CT DE FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS MO MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI WY'.split(),[7,1,9,4,52,8,5,1,28,14,2,2,17,9,4,4,6,6,2,8,9,13,8,4,8,2,3,4,2,12,3,26,14,1,15,5,6,17,2,7,1,9,38,4,1,11,10,2,8,1]))

def parse_house(content):
    root=ET.fromstring(content)
    result={s:[] for s in SEATS}
    for m in root.findall('./members/member'):
        info=m.find('member-info'); state=info.find('state').get('postal-code')
        if state not in result: continue
        name=(info.findtext('official-name') or '').strip()
        bioguide=(info.findtext('bioguideID') or '').strip()
        footnote=(info.findtext('footnote') or '').strip()
        if not name and 'vacancy' not in footnote.lower(): raise ValueError('Unexplained missing member name')
        result[state].append({'district':info.findtext('district'),'districtCode':m.findtext('statedistrict'),'name':name or 'Vacant seat','vacant':not bool(name),'url':f'https://clerk.house.gov/Members/{bioguide}' if bioguide else 'https://clerk.house.gov/Members/ViewMemberList','note':footnote if not name else ''})
    for state,count in SEATS.items():
        assert len(result[state])==count, f'{state}: expected {count} districts'
        assert len({m['districtCode'] for m in result[state]})==count
        result[state].sort(key=lambda m:int(m['districtCode'][2:]))
    return {'source':HOUSE_SOURCE,'published':root.get('publish-date'),'congress':root.findtext('title-info/congress-num'),'checked':datetime.date.today().isoformat(),'states':result}

def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--xml',type=pathlib.Path,help='Previously retrieved official Clerk XML')
    parser.add_argument('--states',help='Only states affected by the verified election, comma-separated')
    parser.add_argument('--election-date',type=datetime.date.fromisoformat)
    parser.add_argument('--initial',action='store_true')
    parser.add_argument('--apply',action='store_true')
    args=parser.parse_args()
    selected=set(args.states.split(',')) if args.states else set(SEATS)
    assert selected<=SEATS.keys()
    if args.apply and not args.initial:
        assert args.states and args.election_date, 'An election date and explicit affected states are required.'
        assert args.election_date<=datetime.date.today(), 'Future elections cannot update serving rosters.'
    content=args.xml.read_bytes() if args.xml else urllib.request.urlopen(HOUSE_SOURCE,timeout=30).read()
    incoming=parse_house(content)
    path=ROOT/'lib/house-representatives.json'
    previous=json.loads(path.read_text()) if path.exists() else None
    if previous:
        for state in SEATS:
            if state not in selected: incoming['states'][state]=previous['states'][state]
    incoming['stateChecks']={**(previous or {}).get('stateChecks',{}),**{s:{'checked':incoming['checked'],'published':incoming['published'],'congress':incoming['congress'],'electionDate':str(args.election_date) if args.election_date else None} for s in selected}}
    changed=[s for s in selected if previous is None or incoming['states'][s]!=previous['states'][s]]
    print(json.dumps({'statesWithChangedRosters':sorted(changed),'districts':sum(map(len,incoming['states'].values())),'published':incoming['published'],'applied':args.apply}))
    if args.apply:path.write_text(json.dumps(incoming,indent=2,ensure_ascii=False)+'\n')

if __name__=='__main__':main()
