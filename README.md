
Debugging Work step-by-step log:

1. make .env file with PORT, MONGODB_URI, SESSION_SECRET

2. copy from local copies /public/images dir to this repo

3. npm install

4. start the server with npm run dev

5. errored out because it seems that bcryptjs wasn't installed in package.json, doing it now and testing again - Works

6. errored out due to async wasn't install in package.json, doing it now and testing again - works

7. errored out, MongoStore is not defined in app.js, fixed

8. route / is hanging for some reason, suspecting index.js in routes. used return pagination() in if statement of req.user
then used return res.render('main/home') after. Noticed that 'views' folder is misspelled as 'viewes' corrected that. Next
step is to go throughly through all folder and files to review each of them mentally noting everything out of the ordinary,
and need to test now the / route. noticed no header in /. will come back to after review on the next step.

9. went through all files reviewed, each code line, noticed some irregularities, and one mistake that I will correct now in
passport.js line 49 when calling callback there is a typo 'verifiedCallback' instead of 'verifyCallback'. app.js line 55,56
in app.use(session) object settings resave, and saveUninitialized set to false instead of true - corrected.

10. brought via include ejs function navbar in partials in home.ejs, tested in browser it shows up and correct register/login
links work on it.

11. testing for the first time register functionality and return an object 
{
"confirmation": false,
"message": {}
}
when all inputs filled out correctly, and req.flash - All inputs must be filled when nothing or one to two different inputs filled 
out, suspecting userRoutes and userController functionality not working. reviewed middleware variable registerValidation that was used
in router.post('/register') before executing register controller seems not to have any mistakes, moving to controller review, but before
that need to check database user creation - users were indeed created, that means that views form worked for now. On userController.js
execution stops on line 25 on return res.status(400).json({ confirmation: false, message: err });, testing if after 'if' statement 
'else' res.redirect(301, '/'); missing return and whether it will work in test - didn't work still keeping 'return'. test with console.log
user before req.login where err occurs - user properly logged out seems that something is wrong with our passport strategy or session either
in passport.js or app.js. app.use cookieparser is commented out, uncommented it. testing again - still doesn't login but if using the same 
data again req.flash shows User Already Exists(that's a good sign), going to test the login with the data already created in db via browser
register to test if login actually works - return this 'Error: Unknown authentication strategy "local-login"' in browser. app.js missing
brining in passport.js require('./lib/passport'); - corrected, testing again - works, however, rendered paga is only jumbtron and footer.
test register to make sure that both work before moving on to next step to fix rendering - register works same error rendering.

12. usersRoutes.js line 63 return res.render('main/home') when user authenticated - changing to redirect('/'). tested - same result, suspecting
index.js in routes to be the culprit. changed return paginate(req, res, next) to res.render('main/home') and now the route renders home
test routes /page/2 /page/3 ,etc seems that paginate() function is the culprit. Just realized my database is empty with no data hence it will
the function won't crate views for products, noticed in home-products.ejs same missing include ../partials/navbar as in home.ejs but
also include ..partials/scripts were missing - corrected. test works with hello {username}(link to profile page) and 
logout link(works as well with login back in).
13. testing for Create Category link in header while logged in. errored out with 'Category validation failed: category: Path `category` is required.'
going to review routes/admin/adminValidation/categoryValidation.js - seems normal, reviewing routes, seems normal, reviewing add-category.ejs - noticed
type and name equals to name changing to text and category no that's not it because route has req.body.name keeping type as text though. Need to 
check database via Robo 3T -  nothing created. After reviewing the code having a hunch about category and products models and their reference relations.
just noticed Product variable of required model Product is never used in our redirect get create-product route added line const product = new Product();
after second waterfall function inside of for loop for 24 products creation. testing again. seems to be the same error for records full error below:
```
ValidationError: Category validation failed: category: Path `category` is required.
    at model.Document.invalidate (/home/bogdan/Documents/term2/week-8/broken-app2-07082020/node_modules/mongoose/lib/document.js:2574:32)
    at /home/bogdan/Documents/term2/week-8/broken-app2-07082020/node_modules/mongoose/lib/document.js:2394:17
    at /home/bogdan/Documents/term2/week-8/broken-app2-07082020/node_modules/mongoose/lib/schematype.js:1181:9
    at processTicksAndRejections (internal/process/task_queues.js:79:11)
```
console.log category after const category = new Category(); and test via browser. logs out correct data, need to log the savedCategory in save.then
it seems not to save nothing logs out. removed completed node_modules and reinstalled via command npm install, showed 1 vulnerability package that 
showed before at first install did npm audit package effected was express-validator , after that did npm audit fix , testing again via browser if it
fixed then issue - it did not. Dropping the whole database, clearing history in browser. This error is quite difficult and time consuming
to solve was researching the error online as well, looked again at app.js and moved my mongoose.connect up all brought up routes files 
and const app = express() - nothing. commented out in app.js Category brought model - same result. Just noticed after an hour of searching in category.js
model instead of 'name' key in model it says 'category' - correcting. Finally works, taking 5 minute break.

14. pagination works on / route.

15. when pressed on created category from navbar all 24 products are shown from that category but create Category doesn't work again req.flash messsage is
'Category Already exists' back to it.Deja Vu - it seems that - dropped database again: that fixed it all, extensively tested it on three different users and 
successfully created many random categories with proper req.flash messages next is edit profile data.

16. tests twice name email address update - works.

17. tests for correctly input old password and correctly input new password and repeat, logged out. tried to login with old one extensively tested.
If no new and repeat password provide returns json :
```
{
"errors": [
{
"value": "",
"msg": "Please Include a valid password",
"param": "newPassword",
"location": "body"
},
{
"value": "",
"msg": "Please Include a valid password",
"param": "repeatNewPassword",
"location": "body"
}
]
}
```
that's not the result we want to achieve, ideally we would like to req.flash that those fields are empty or one of them, but tested previous classwork 
seems like we haven't done that yet so won't correct it.