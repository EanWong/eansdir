# Dockerfile for eansdir
FROM node:4.5

# Setup for specific application dependencies, etc.

RUN npm install -g nodemon

WORKDIR /usr/src/app

# Now run!
############################## INTERFACING specific commands

# When the container is run, this is the default cmd run.
ENTRYPOINT nodemon -L --ignore 'public/*' ./bin/www

# Exposes the container port 3000 to be available to connect with the host machine
EXPOSE 3000

############################## TYPICAL SETUP / RUN COMMANDS

# $ docker build -t <image name> .
# $ run -itd -P --name <container name> <image name> (-P maps exposed ports to available ports)
# $ docker logs -f <container_name>
# $ docker-machine ip (gives you the docker-machine ip to look for on your dev computer)

# Viewable from http://<docker-machine-ip>:<docker-machine port in use> 

# 1) run db container using data container (db-data)
#   

