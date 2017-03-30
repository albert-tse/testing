#Contempo
---
##Version: 5.00 Codename: Dave and Busters
Released: 03/23/2017

Release notes:
- New nicer login flow
- Edit / Update / Delete article lists
- Scheduling bug fixes
- Built out CPC reports
- Implemented Margin based pricing (LOL)
- Fixed Cloudsearch bug

###Contempo Commits
- Bug POST NOW feature does not work within [ch1725] 
- skinned: log in page 
- unified: login and sign up pages 
- added: mobile styling 
- align: vertically 
- removed: console 
- Update copy for Influencer should be enticed [ch1170] 
- added: links to privacy and TOS and opposite role sign up page 
- improve scheduling error messages [ch1672] 
- added: UI for clearing stories 
- completed: UI with hooks in ListActions 
- added: article before role on sign up page 
- use: unsecured protocol when linking to corporate website 
- choose: the correct article for influencer and publisher in login page 
- added: CTA on sign up page to redirect existing users to sign in page 
- Connect the Manage List component to the list and filter store, so we 
- Added support for clearing all, removing, and renaming lists 
- Fixed visual graph bug [ch1421] 
- restored: webpack development config 
- added: copy to legacy share dialog with permission to schedule [ch1170] 
- removed: secure protocol from link to corporate site on login [ch1579] 
- Updating user source to match minor endpoint changes 
- bugfix: prevent user from clicking the same list item on the nav drawer 
- redirect to corporate/contempo 
- hide: manage list button for now 


###Geordi Commits
- [ch1009] Initial work to support end dates on influencer-site CPCs 
- [ch955] Initial work to add percent-based influencer CPCs to API 
- [ch1612] [ch1609] Include passthroughs and percentage based CPCs in 
- [ch1009] [ch1609] Implement logic for influencer site percent CPC 
- [ch1613] Initial commit of new endpoint to save all influencer related 
- Updated auth model to allow admin tokens to have only a user ID and not 
- [ch1613] New endpoint for creating influencers is complete, except for 
- [ch1613] Added support for CPC overrides to influencer creation endpoint 
- [ch1612] [ch1613] Added functions to support adding and disabling site 
- [ch1613] Added endpoint to support updating an influencer's data 
- [ch1612] [ch1613] Added support for site passthoughs to the influencer 
- [ch1613] Include 'scheduled' computed column in site override CPCs 
- applied: new stylesheet to e-mail template 
- Added support for generating CPC reports 
- Added reporting configs 
- [ch1613] Assorted fixes for creating/updating influencers 
- [ch1613] Fixed typo 
- [ch1613] Added support for deleting influencer CPCs 
- Bugfix for influencer groups that have exactly one influencer not 
- Added and effective CPC report 
- Bugfix for influencer groups that have exactly one influencer not 
- Updated columns based upon a chat with Lorenzo 
- [ch1613] [ch1612] Add support for clearing all site passthroughs for an 
- Added company summary sheet to the effective CPC report 
- [ch1612] Include passthrough calculation in both site and publisher 
- Added support for renaming and deleting lists 
- Added a download route for accounting reports 
- Added support for removing all entries from a list 
- [ch1649] Include MTD posts and clicks in the user overview endpoint 
- [ch1612] Fixed issue with influencer passthroughs when a publisher had 
- Updated /me endpoint so other endpoint can return consistent user 
- [ch2028] Fix issue with Cloudsearch topic queries 

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
