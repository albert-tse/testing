#Contempo
---

##Version: 0.05 Codename: Alligator Lounge
Released: 03/08/2017

Release notes:
- Many scheduling fixes and tweaks
- Hide money related features by default
- Separated GA stats for internals and externals
- Autohide content in Contempo from external users if site has a cap
- Stamp all accounting reports with bill.com id convention (per Steve)
- Created Scotty admin action paper trails to identify culprits in errors in accounting

###Contempo Commits
- Only show Accounting menu item if the user has the correct permission, 
- Hide revenue column from Dashboard table if the user does not have the 
- Adding support for a disable button for admins 
- hotfix: show scheduled post for the first profile in their list 
- hotfix: show local time on article dates 
- Influencer without any connected platforms [ch1193] 
- Added a disabled button for admins 
- [ch1222 Added Download CSV button to My Links 
- Removed erroneous logging 
- added: UI for cap percentage 
- integrated: cap percentage from server onto UI 
- make: room for the traffic caps indicator on my links 
- added: indicator to My Links page 
- added: new component for indicator 
- added: indicator UI to links view as well 
- bugfix: only parse site budget percentages if present 
- Bug Learn more links at the bottom of Contempo [ch1428] 
- Bug Editing post should persist time info [ch1414] 
- add: one hour to scheduled date if time is less than now 
- Bug Center align or top align images on modal [ch1419] 
- Fixed influencer sort to now sort by name not id 
- [ch867] - Update copy and color of graph title 
- updated: react joyride stylesheet 
- Highlighted the last rows using a css selector, and duplicating the 
- Adjusted width to be louder 
- A couple more visual tweaks for Scheduling [ch1247] 
- bugfix: only load profiles when user is permitted 
- bugfix: convert UTC timestamp of article creation date to local timezone 
- bugfix: allow use to "Back" from scheduling 
- Scheduling related features should not be [ch1361] 
- Adjusted the highlighting to only highlight when the last two days are 
- Scheduling related features should not be [ch1361] 
- Bug POST NOW feature does not work within [ch1725] 

###Geordi Commits
- Finalized messages for emails 
- Added Bill.com ID to publisher and influencer group reports 
- Added email configuration to activities 
- [ch1307] Include site budget details in the user's site list 
- [ch1222] Added support for downloading CSV on My Links 
- [ch1222] Added more descriptive filenames to CSV downloads 
- New cloudsearch endpoints for the dev environment 
- [ch1348] Hide articles for sites that are reaching their click cap for 
- [ch1253] If an influencer has an invalid CPC, treat it as 0 
- Alter the data reported in global stats to [ch1530] 
- [ch1459] Automatically create influencer groups for new user signups 
- Added support for querying the partners table 

##Version: 0.04 Codename: Beauty Bar
Released: 12/08/2016

Release notes:
- Referral codes for Sales org
- Massive Mobile revamp
- Structural updates for Publisher signup flow
- Concurrent support for asyncronous accounting reports in Scotty


##Version: 0.03 Codename: Marquee
Released: Earlier

Release notes:
- Social Lists and Curation
- Alpha version of our recommendation engine
- UX refinements based on most common user actions
- Accounting improvements
