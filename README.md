# IITC Plugin: Glympse

Integrates the Ability to view Glympse tags into IITC.

## Usage

- If you haven't already, install IITC-CE ([Desktop](https://iitc.app/download_desktop) or [Mobile](https://iitc.app/download_mobile))
- Install the Plugin with **[This link](https://github.com/MaxEtMoritz/iitc-glympse/raw/master/iitc-glympsemap.user.js)**
- Open IITC-CE and specify the plugin's settings
![settings](images/Screenshot%202022-08-09%20190221.png)
- As described in the settings dialog, you have two ways to acquire the necessary Glympse API token:
    1. Create a Glympse Developer account and make a 30-day trial API token (this is more ToS compliant than variant ii.)
    2.
        - Open a new Browser tab and open your Browser's Developer tools (try pressing the F12 key).
        - Switch to the 'Network' tab. 
        - Now open the URL https://glympse.com/![GlympseTag], replacing [GlympseTag] with a valid Glympse tag.
        - Search the Network tab for a request to https://api.glympse.com/v2/account/login
        - Use the username, password and api_key specified in the request

        This Method is strongly against Glympse's Terms of service. proceed at your own risk.
- If you have a username, password and API token filled in, you can continue by entering the Glympse tag you want to view, optionally adapting the update interval that is 5 seconds by default.
- If everything is set up, just click 'Save' and the real-time locations should start to appear on the map.
- If you want to turn the plugin off, just disable the 'Glympse' layer in IITC.

## Features

- shows the locations of all Glympse tag members
- Shows a popup with the following Member details:
    - Nickname
    - Avatar
    - travel type (if set by member)
    - last speed (if member granted permission)
    - last update time
    - maybe more in the future, like current destination, message, etc.
- shows a member's trail as red line on the map
- shows the heading direction (if known) by rotating the marker
- shows if a member is currently not sharing (the marker is gray then).

## Screenshots

Settings dialog

![settings](images/Screenshot%202022-08-12%20143102.png)

Details of a member

![member detail](images/Screenshot%202022-08-12%20163456.png)

Memebr and his trail

![member trail](images/Screenshot%202022-08-12%20163522.png)

Expired member

![expired](images/Screenshot%202022-08-12%20165218.png)