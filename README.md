node-tweety
===========

Twitter API client built in NodeJS &amp; ExpressJS

Some paths supported in this project currently : 
<br/>1. Login to Yagi Testie using your twitter account by accessing this URL : http://localhost:3000/twitter_login
<br/>2. http://localhost:3000/twitter_stream to stream & filter all twitter stasuses that is contained "#tes" inside it, and then send DM to related account tweeting (if the related account is following you).
<br/>3. http://localhost:3000/read_dm to read all your direct message
<br/>4. http://localhost:3000/twitter_write to write / update your twitter status

 
Libraries use for this project :
- https://github.com/AvianFlu/ntwitter
- https://github.com/mikeal/request
- https://github.com/felixge/node-mysql (Mysql functionality is still in progress)
