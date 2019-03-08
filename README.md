This is the source code to a personal web application that acts as a personal address book. 

It runs on node and utilizes docker

### Prerequisites

Current versioning:
1. npm - 6.4.1
2. node - 10.15.3

What things you need to install the software and how to install them.

0. [git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)

If you are planning on using totally natively (ie, if you want to develop locally), your system requires:
1. [npm](https://docs.npmjs.com/getting-started/installing-node "npm") and [nodejs](https://docs.npmjs.com/getting-started/installing-node "npm")

If you want to get the application running locally as fast as possible, use the Docker environment, which means you need to install

1. [Docker](https://docs.docker.com/engine/installation/)

### Installing

A step by step series of examples that tell you have to get a development env running

Clone this repository. 

```
git clone https://github.com/EanWong/eansdir.git
```

After cloning the repository, Enter the app/ directory, install the packages and dependencies with npm
```
npm install
``` 

Go to the directory where the docker-compose.yml config file is. Set your environment variables for docker development. Unless the environment variables are set correctly, the containers won't interact correctly with each other and won't be useable.
```
export NODE_ENV=dockerdev
```

Then start the docker container.
```
docker-compose up
```

This will start the web application and associated database. 

Go to your browser and access the website to make sure it is running
```
0.0.0.0:8080
```
This environment exposes the application by the local machine's port at 8080

View and play around at localhost:8080

### Future Considerations

KNOWN Issues and needed fixes:
1. making duplicate users is possible
2. Passwords are stored and handled as plain text
3. API endpoints are public without restrictions

Desired updates:
1. Reskin UI using React

Future features:
1. Date Picker
2. Email reminder to update address
3. Tabify UI
4. Mobile friendly

