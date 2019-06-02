# House in the Cloud
I wanted to create my own smart home system using NodeJS, socket.io, and raspberry pis that I could control from a webpage.  The system allows a user to control RGB lights, single-color lights, and smart switches. 

# Motivation
I am always looking to expand my smart home in terms of devices and functionality.  I have Philips Hue smart lights in a few rooms which are nice, but I wanted the RGB light strips as well.  They are expensive for a single strand of lights, so I created a small project to create my own smart home ecosystem where I can further my knowledge of JavaScript and other languages/frameworks while being able to customize my system at any level.  


# Features
- [ X ] - See all satellites known to the network
- [ X ] - Toggle any connected satellite on or off
- [ X ] - Create scenes with devices (satellites)
- [ X ] - Change RGB lights to any color (16 million options) using input sliders
- [ X ] - Satellites automatically connect to main server when powered on
- [ X ] - Satellites return to last known settings after reconnecting 
- [  ] - Control smart switches
- [  ] - Create 'Groups' of devices for easier control


# Installation
<!-- - Setting up main hub
- setting up satelite -->

- I used Raspian Jessie as my Linux distro, so others have not been tested.  Download and flash Raspian Jessie onto a micro SD card
- Boot up the pi and enable SSH, connect to your home wifi network, and change the root username and password in raspi-config
- Note the ip address of this pi for SSH purposes later (run `ifconfig` or `hostname -I` in the terminal)
- Update the pi (run `sudo apt-get update` and `sudo apt-get upgrade`), and then restart the pi for the changes to take effect
- Install NodeJS by running these commands
    * `curl -o node-v10.9.0-linux-armv6l.tar.gz https://nodejs.org/dist/v10.9.0/node-v10.9.0-linux-armv6l.tar.gz`
    * `tar -xzf node-v10.9.0-linux-armv6l.tar.gz`
    * `sudo cp -r node-v10.9.0-linux-armv6l/* /usr/local/`
    * `rm -r node-* (removes zip and files that were copied)`
- Clone this repo: `git clone https://github.com/Jwb81/house_in_the_cloud.git`
- Set Github username and password as local props so you don't have to retype them every time you do a commit: `git config --global credential.helper store`
- `cd` into the cloned repo and run `npm i` to install all necessary packages.


# How to use
This project has a similar setup to other products like Philips Hue and Sonos.  They have a main hub which connects to the network, and then all of the satellite devices (lights, switches, speakers, etc...) connect to the hub for instructions.  This project uses a raspberry pi 3 model B as the hub, and pi zero Ws as the satellites.  For a hub, copy the *db.json* file from the *./setup* folder and paste it in the root folder.  This will holds all the information pertaining to the devices, scenes, etc.  For a satellite, copy the *config.js* file from the *./setup* folder and paste it in the root folder.  Change the information in this file to match your needs.  Change the satellite (device) name to the name you want to show up on the web page for this device.  Then, select a device type: 
- LIGHT_MULTICOLOR
- LIGHT_UNICOLOR_DIMMABLE
- LIGHT_UNICOLOR_NONDIMMABLE
- SWITCH

Then, select a device category: 
- LIGHT
- SWITCH

Finally, type in the IP address of your main hub.  If you want to access your system from outside of your wifi network, you must create a port forwarding rule for both the front end web page (port 8080) and back end server (port 3000), and then type your global ip address with the external port into the main server url property.



## Credits
1. My dad designed the circuit card that became the link between the pi zero and the LED strip.  He also helped me splice the store bought LED strips and put our own connector on the end.
2. NPM packages:
    - pigpio - a package that helps with low level functions like controlling GPIO ports (allowing me to turn lights on and off or use PWM to dim or brighten lights)
    - socket.io - a package that creates sockets between two clients such as browser to server or server to server, allowing me to send data instantly without needed to create new HTTP requests 


## 📄 License
House in the Cloud is MIT licensed, as found in the LICENSE file.