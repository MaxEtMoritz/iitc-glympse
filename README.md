# IITC Plugin: Glympse

Integrates the Ability to view Glympse tags into IITC.

## Usage

- If you haven't already, install IITC-CE ([Desktop](https://iitc.app/download_desktop) or [Mobile](https://iitc.app/download_mobile))
- Install the Plugin with **[This link](https://github.com/MaxEtMoritz/iitc-glympse/raw/master/iitc-glympsemap.user.js)**
- Open IITC-CE and specify the plugin's settings![settings](images/Screenshot%202022-08-09%20190221.png)
- As described in the settings dialog, you have two ways to acquire the necessary Glympse API token:
    1. Create a Glympse Developer account and make a 30-day trial API token (this is more ToS compliant than variant ii.)
    2.
        - Open a new Browser tab and open your Browser's Developer tools (try pressing the F12 key).
        - Switch to the 'Network' tab. 
        - Now open the URL https://glympse.com/%21%3CGlympse%20Tag%3E, replacing \<Glympse Tag\> with a valid Glympse tag.
        - Search the Network tab for a request to https://api.glympse.com/v2/account/login
        - Use the username, password and api_key specified in the request

        This Method is strongly against Glympse's Terms of service. proceed at your own risk.
- If you have a username, password and API token filled in, you can continue by entering the Glympse tag you want to view, optionally adapting the update interval that is 5 seconds by default.
- If everything is set up, just click 'Save' and the real-time locations should start to appear on the map.
- If you want to turn the plugin off, just disable the 'Glympse' layer in IITC.

## Screenshots

TODO