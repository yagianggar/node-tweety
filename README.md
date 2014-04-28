node-tweety
===========

Twitter API client built in NodeJS &amp; ExpressJS

Set up your project : 
<br/>1. Get into root directory of node-tweety (cd node-tweety)
<br/>2. Inside the root, run "npm install". This will install all dependencies stated in the package.json
<br/>3. Once installing dependencies is done, you can run "node app.js". This will activate the server of this project and you could try accessing following Path / URL.

Some paths supported in this project currently : 
<br/>1. Login to Yagi Testie using your twitter account by accessing this URL : http://localhost:3000/twitter_login
<br/>2. http://localhost:3000/twitter_stream to stream & filter all twitter stasuses that is contained "#tes" inside it, and then send DM to related account tweeting (if the related account is following you).
<br/>3. http://localhost:3000/read_dm to read all your direct message
<br/>4. http://localhost:3000/twitter_write to write / update your twitter status

 
Libraries use for this project :
- https://github.com/AvianFlu/ntwitter
- https://github.com/mikeal/request
- https://github.com/felixge/node-mysql (Mysql functionality is still in progress)
