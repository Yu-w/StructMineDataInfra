This is the repo for LifeNet system. 

### How to run

#### Front-end part

Install node and python virtualenv first. 

Start AngularJs front-end

```
$ cd ./angularJS-front
$ npm install (only for the first time)
$ npm start  
```

Start Flask (open a separated terminal)
```
$ // cd back to the root directory (where this README.md resides)
$ source venv/bin/active
$ python app.py
```

Open browser and go to **http://localhost:8080/index.html**

#### Backend Database

Please follow the README in ./db directory.

#### Note:

On the server version, the js controller in angularJS send request to 192.XXX address and
the Flask should start on 192.XXX address.