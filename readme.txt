Alright I have never written one of these so please bear with me if I commit any faux-pas. 

### Variables to configure: 
Make a .env file with the following variables
MAPBOX_TOKEN=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_KEY=
CLOUDINARY_SECRET=
DB_URL= 

Which means that you need to create accounts with Mapbox, Cloudinary, and Mongodb. I use free tiers for all of these 

https://www.mapbox.com/ Create an account and then head to https://console.mapbox.com/. In the menu on the left under "Admin" you should see "Tokens". Create a token and then copy and paste that into your .env file. Side note: the Mapbox docs are helpful so I would bookmark this for later: https://docs.mapbox.com/help/getting-started/ 

https://cloudinary.com/ Here you need three things: an environment, an API key and the key secret.
1. Create an environment, this will be your CLOUDINARY_CLOUD_NAME 
2. Go to settings, then choose "API Keys". Generate a new API Key. The API Key is CLOUDINARY_KEY and the API Secret is CLOUDINARY_SECRET. 
3. open utils/cloudinary.js and change the name of your folder for image submissions. You can also edit the allowed formats here. 

https://www.mongodb.com/ Create a new project and then create a cluster within that project. When you're setting up the cluster, start by making sure you're on the free tier (unless you want to pay for it but IMO you don't need to, at least not yet). Set the cluster name, pick your provider and locale. You can create your cluster from here, but feel free to poke around in the advanced settings if you want. 
Next you need to create a username and password. Be sure to save this somewhere, because this will get plugged into your DB_URL later. 
Before you go on to the next step, under "Add entries to your IP Access List" add your current IP address and add 0.0.0.0 in order to allow access from anywhere. This is important, otherwise you will only be able to access your database from your current IP address. 
When you finish those steps, you should be brought to a "Connect" screen. I choose to Drivers, then Node.js and you can pick the latest version. This will provide some instructions which you will need to follow (but we'll come back to that shortly). Under Step 3 on this screen you need to copy the connection string and paste that into DB_URL in your .env file. Make sure you replace <username> and <password> with the username and password with the credentials you set up a few minutes ago. 
Open mongoose.js and change the connection string for the db to your own. 

### init environment and install packages
Start by deleting the package.json and package-lock.json files and then open terminal and cd into the proper directory. Installing packages is one of the most annoying parts of this process but I will try to make it easier here. 
Run: 
npm init -y 
npm i express path method-override mongoose ejs ejs-mate multer express-session connect-flash passport passport-local passport-local-mongoose connect-mongo joi sanitize-html cloudinary multer-storage-cloudinary nodemon 

If you run into issues getting your app to run, it might be because you're missing packages. The error message should help you troubleshoot which package(s) is/are missing. 

### start 'em up 
At this point, hopefully you should be able to start your local environment and see a local version of the demo app (based on my australia app). Open package.json and find or add "scripts". Add a "start" script to look like this: 
  "scripts": {
    "start": "node index.js"
  },
Now in terminal, you can start your app by running: 
npm start 
The nice thing about this is that when you make and save a change, nodemon will restart for you. You can also always start the app by running 
node index.js 

### maps maps maps 
public/js/clusterMap.js 
This file is the puppet behind the cluster map. There are some pieces that you will need to change, and some pieces you might want to change. I borrowed this file from a Mapbox tutorial (https://docs.mapbox.com/mapbox-gl-js/example/cluster/) so it has some instructions written in already. 
You definitely want to change the "center" under the first map const. You can also change the zoom level here, as well as the map style (https://docs.mapbox.com/help/dive-deeper/map-design/#mapbox-classic-style-templates-and-custom-styles). 
One thing that's always been a challenge for me is handling two points that have the same coordinates. There is a way to handle points that have the same coordinates, but I haven't had great luck integrating that code with the cluster map. But we can keep working on this! I imagine it will be helpful eventually. 

models/plastics.js 
The plasticsSchema.virtual is the code behind the pop up markers on the map. You can write regular HTML as long as it's inside `` in the function return. You can also include references to the specific submission by referencing 
${this.field} 
where 'field' is some part of the submission that is stored in your database. 

controllers/submissions.js 
In module.exports.newSubmission is where you're doing the reverse geocoding. This is what allows someone to input a street address (1 Main St) and translate it into a latitude/longitude pair. You can add or change the "countries" here. You can also add a bounding box to limit queries to a specific region within the const geoData (note that latitude and longitude are switched from our normal frame of reference): 
bbox: [-74.375745, 41.091585, -69.647465, 43.007157] (this box encompasses the state of Massachusetts)
For a project focused on the Bay area, you want to pick two diagonal points that fully encompass your zone for results, so it might look something like: 
bbox: [-122.753872, 37.071358, -121.535869, 38.341397] 
The first pair is the bottom left-hand corner and the second pair is the  upper right-hand corner of our bounding box in this example. Note that the coordinates must be in this order (bottom left, top right). 
You can also help out the geocoder by hard-coding the state; you'll probably want to ask for the municipality in your submission form, which can then also be fed into the geocoder. 

### what is ejs 
ejs is embedded javascript. basically it makes it easy to write HTML within javascript and uses templating to easily reuse components. This might technically be incorrect but I think of it as allowing us to more easily pull in variables from javascript to the HTML. info: https://ejs.co/. 
In this app, the boilerplate.ejs file contains all the basic HTML that we need for a given page to work. Likewise for the partials (namely navbar and footer), which are broken out here but I forget why tbh. They could probably all just go in the boilerplate file and that wouldn't functionally change anything on the front end, if you wanted the structure of the app to be a little simpler on the back end. 

### currentUser 
You don't NEED to include any user feature in order to make this work, but I think it's a nice bonus feature for managing the app from the front end (i.e. rather than logging into mongodb when you want to edit or delete a submission). In this example, I tucked the new submission form behind currentUser, so the form will only render if you're logged in. Note however that the new submission form is not a protected route, so one could use Postman or similar to add a submission without being logged in. Similarly, only a currentUser can make edits to a submission or even view certain variables from the submission. It's easy enough to take out that validation or adjust what is visible/hidden to the public vs. to a currentUser. Think about what makes sense to be protected, either on the surface in the form of what is displayed, or if there are certain routes that need to be protected. Another example of something you might do: require users to register in order to make a submission, which means that later they can log back in and edit their submission if they so desire. Maybe you want to give them that power or maybe you don't, but that's one way you might use currentUser. 


### some more information in no particular order (brain dump) 
The "submissions" controller and routes and the "plastics" structures are kind of arbitrarily named (okay technically they were named for a previous project). Honestly I would probably not bother changing them, because once you start making changes you have to be very thorough to make all the changes and it is annoying and half the time when I try to change these names, I inadvertently break something and it takes a long time for me to fix it. Same with "blogs". However, only the "plastics" feed the map as it's currently set up. Again, change all these names if you want but it would be a back end change that doesn't affect the front end. 

I use Bootstrap because I'm lazy but it has a really specific aesthetic out of the box that maybe isn't the right vibe for your project. 

There are a handful of files that you probably won't need to touch at all (at least, I don't touch them when I use this template for a new project), including: 
public/js/validateForms.js 
middleware.js 
utils/ExpressError.js
utils/catchAsync.js 
views/error.ejs 