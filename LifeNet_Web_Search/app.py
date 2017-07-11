'''
__author__: Jiaming Shen
__description__: LifeNet Web System Demo
'''
from flask import Flask, url_for, request, render_template, redirect, escape, session, make_response
from werkzeug.utils import secure_filename

## name of the application's module or package
## here we use a single module and thus should use __name__
app = Flask(__name__)
app.secret_key = 'nbv\xbdO\xc5\xc5\x1cW\x08\x1a\xba\xe1xx>\xa8\x97\xe00\x1a\x8a\x8di'

## route decorator
@app.route('/')
def index():
    if 'username' in session:
        return 'Logged in as %s' % escape(session['username'])
    return 'You are not logged in'


@app.route('/login_session', methods=['GET','POST'])
def login_session():
    ### if it is post, use the username in request form into session 
    ### and then redirect to the index page
    if request.method == 'POST':
        print("!!!HERE:POST")
        session['username'] = request.form['username']
        return redirect(url_for('index'))
    ### if not POST with username
    return '''
        <form method="post">
            <p><input type=text name=username>
            <p><input type=submit value=Login>
        </form>        
    '''

@app.route('/logout')
def logout():
    ## remove the username form the session if it's there
    session.pop('username',None)
    return redirect(url_for('index'))






## The useage of cookie
@app.route('/home_cookie')
def index_cookie():
    username = request.cookies.get('username')
    if username:
        print("!!!HERE:I have the cookie!!!")
        return render_template("hello.html",name=username)
    else:
        print("!!!HERE:I don't have the cookie!!!")
        ## first obtain the response object
        resp = make_response(render_template("hello.html"))
        ## and store the cookie
        resp.set_cookie("username", "Mickey_cookie")
        return resp



@app.route('/hello')
@app.route('/hello/<name>')
def hello(name=None):
    return render_template("hello.html",name=name)

## Used to customize the error page using errorhandler() decorator
@app.errorhandler(404)
def page_not_found(error):
    return render_template("error.html"), 404

## The variable name is in the <username>
## Such a part is then passed as a keyword argument to your function
@app.route('/user/<username>')
def show_user_profile(username):
    # show the user profile for that user
    return 'User %s' % username

## The converter from string post_id to INT post_id
## string   accepts any text without a slash (the default)
## int      accepts integers
## float    like int but for floating point values
## path     like the default but also accepts slashes
## any      matches one of the items provided
## uuid     accepts UUID strings
@app.route('/post/<int:post_id>')
def show_post(post_id):
    # show the post with the given id, the id is an integer
    print(type(post_id))
    return 'Type of Post %d' % post_id

## notice the trailing slash, use XXX/project to directly visit the site is OK
@app.route('/projects/')
def projects():
    return 'The project page'

## no trailing slash, must us XXX/about to visit
## If use XXX/about/ to visit, it will cause 404 error
@app.route('/about')
def about():
    return 'The about page'

## URL building
## the url_for method only return a string url
## because it is under the app.test_request_context, it tells Flask to behave
## as through it is handling a request
# with app.test_request_context():
#     print(url_for('hello')) ## return: /hello
#     print(url_for('hello', useless_parameter="hehe")) ## return /hello?useless_parameter=hehe
#     print(url_for('show_user_profile', username="Mickey")) ## return /user/Mickey

## HTTP Methods: http://flask.pocoo.org/docs/0.12/quickstart/#http-methods
@app.route('/login', methods=['GET', 'POST'])
def login():
    error = None
    if request.method == 'POST':
        if valid_login(request.form['username'], request.form['password']):
            return log_the_user_in(request.form['username'])
        else:
            error = 'Invalid username/password'
    else:
        show_the_login_form()

    ## the code below is exectured if the request method is GET
    ## or the credentials were invalid
    return render_template('login.html', error=error)

## use the secure_filename() method 
@app.route('/upload', methods=['GET', 'POST'])
def upload_file():
    if request.method == "POST":
        f = request.files['the_file']
        f.save('~/Desktop/' + secure_filename(f.filename))
    return None






