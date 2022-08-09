// ==UserScript==
// @name         IITC plugin: Glympse
// @category     Layer
// @author       MaxEtMoritz
// @version      0.0.1
// @namespace    https://github.com/MaxEtMoritz/iitc-glympse
// @downloadURL  https://github.com/MaxEtMoritz/iitc-glympse/raw/master/iitc-glympsemap.user.js
// @updateURL    https://github.com/MaxEtMoritz/iitc-glympse/raw/master/iitc-glympsemap.user.js
// @description  View a Glympse tag directly on the Intel map.
// @match        *://intel.ingress.com/*
// @grant        none
// @icon         https://glympse.com/wp-content/uploads/2021/04/glympse-favicon-150x150.png
// ==/UserScript==

function wrapper(PluginInfo) {
  // ensure plugin framework is there, even if iitc is not yet loaded

  // eslint-disable-next-line func-names
  if (typeof window.plugin !== 'function') window.plugin = function () { };

  // PLUGIN START ////////////////////////////////////////////////////////

  // use own namespace for plugin

  // eslint-disable-next-line func-names
  window.plugin.glympse = function () { };

  // #region global vars

  let user = '';
  let password = '';
  let apiKey = '';
  let glympsetag = '';
  let updateSpeed = 5000;

  /** @type {string} */
  let accesstoken;
  /** @type {Member[]} */
  let allMembers = [];
  /** @type {L.LayerGroup} */
  let glympseLayers;
  let next = 0;
  let updateLoop = null;
  const style = /* css */`
    .glympse-arrowhead{
      background:
        url(data:image/png;base64,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)
        left
        no-repeat;
      background-size: cover;
    }
    .glympse-arrowhead.expired{
      background-position: right;
    }
    `;

  // #endregion

  /**
   * Enum describing the travel modes supported by Glympse
   * @const
   * @readonly
   * @enum {string}
  */
  const travelMode = Object.freeze({
    drive: 'car',
    cycle: 'bike',
    walk: 'foot',
    transit: 'public transport',
    airline: 'plane',
  });

  /**
     * All important data for a Glympse member.
     * @typedef {object} Member
     * @property {string} id - Member's Glympse ID
     * @property {string} invite - ticket ID for this member
     * @property {boolean | undefined} expired - if ticket is expired
     * @property {L.Marker} marker - Marker at the member's last known position
     * @property {L.Polyline} line - member's location history
     * @property {string} name - member's nickname
     * @property {number} next - latest event timestamp
     * @property {string | undefined} avatar - url to the member's avatar image
     * @property {string | undefined} travelType - how the member is travelling; e.g. walk, drive, cycle
     * @property {Date} last - last time location updated
     * @property {number | undefined} heading - last heading of the member, if known
     * @property {number | undefined} speed - last speed of the member, if known. in km/h
     */

  /**
   * @callback Predicate
   * @template T type of elements
   * @param {T} value value
   * @param {number} index index in array
   * @param {T[]} obj the array
   * @returns {boolean} if this is the one we want
   */

  /**
     * Utility function to find the last element in an {@link array} matching the specified {@link predicate}.
     * This is achieved by reversing the array and then calling {@link Array.find()|find()} on it.
     * There is a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/findLast findLast()} function, but support in browsers is limited.
     * if present, this one is used instead.
     * @template T - Type of the array elements
     * @param {T[]} array - the array to search
     * @param {Predicate<T>} predicate - the condition the element has to match.
     * @returns {T | undefined} - the last matching array element or {@link undefined} if none was found.
     */
  function findLast(array, predicate) {
    if (array.findLast) { return array.findLast(predicate); }
    return array.slice().reverse().find(predicate);
  }

  /**
     * Utility function to contact Glympse API and auto-add access token.
     * @param {string} endpointAndQuery API endpoint and querystring, no leading slash.
     * @param {RequestInit} config fetch request configuration
     * @param {boolean} addAccessToken add the token or not? set false for e.g. login request.
     * @returns {Promise<any>} Promise that resolves to JSON response if everything worked ("response" part of api response without result and meta)
     * @throws {Error} If API errors occur, a string with error detail is thrown.
     */
  async function glympseApi(endpointAndQuery, config = {}, addAccessToken = true) {
    if (addAccessToken) {
      if (!config.headers) { config.headers = {}; }
      config.headers.Authorization = `Bearer ${accesstoken}`;
    }
    const response = await fetch(`https://api.glympse.com/v2/${endpointAndQuery}`, config);
    if (!response.ok) {
      throw new Error(`${response.status} - ${response.statusText}: ${await response.text()}`);
    }
    return response.json().then((v) => {
      if (v.result && v.result !== 'ok') {
        if (v.meta && v.meta.error) {
          throw new Error(`${v.meta.error}${v.meta.error_detail ? ` - ${v.meta.error_detail}` : ''}`);
        } else {
          throw new Error(v.result);
        }
      } else {
        return v.response ?? v;
      }
    });
  }

  // #region https://muffinman.io/blog/javascript-time-ago-function/
  const MONTH_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  function getFormattedDate(date, prefomattedDate = false, hideYear = false) {
    const day = date.getDate();
    const month = MONTH_NAMES[date.getMonth()];
    const year = date.getFullYear();
    const hours = date.getHours();
    let minutes = date.getMinutes();

    if (minutes < 10) {
      // Adding leading zero to minutes
      minutes = `0${minutes}`;
    }

    if (prefomattedDate) {
      // Today at 10:20
      // Yesterday at 10:20
      return `${prefomattedDate} at ${hours}:${minutes}`;
    }

    if (hideYear) {
      // 10. January at 10:20
      return `${day}. ${month} at ${hours}:${minutes}`;
    }

    // 10. January 2017. at 10:20
    return `${day}. ${month} ${year}. at ${hours}:${minutes}`;
  }

  // --- Main function
  function timeAgo(dateParam) {
    if (!dateParam) {
      return null;
    }

    const date = typeof dateParam === 'object' ? dateParam : new Date(dateParam);
    const DAY_IN_MS = 86400000; // 24 * 60 * 60 * 1000
    const today = new Date();
    const yesterday = new Date(today - DAY_IN_MS);
    const seconds = Math.round((today - date) / 1000);
    const minutes = Math.round(seconds / 60);
    const isToday = today.toDateString() === date.toDateString();
    const isYesterday = yesterday.toDateString() === date.toDateString();
    const isThisYear = today.getFullYear() === date.getFullYear();

    if (seconds < 5) {
      return 'now';
    } if (seconds < 60) {
      return `${seconds} seconds ago`;
    } if (seconds < 90) {
      return 'about a minute ago';
    } if (minutes < 60) {
      return `${minutes} minutes ago`;
    } if (isToday) {
      return getFormattedDate(date, 'Today'); // Today at 10:20
    } if (isYesterday) {
      return getFormattedDate(date, 'Yesterday'); // Yesterday at 10:20
    } if (isThisYear) {
      return getFormattedDate(date, false, true); // 10. January at 10:20
    }

    return getFormattedDate(date); // 10. January 2017. at 10:20
  }
  // #endregion

  // #region https://github.com/bbecquet/Leaflet.RotatedMarker

  /* eslint-disable no-underscore-dangle, camelcase, func-names */
  function setupRotatedMarker() {
    // save these original methods before they are overwritten
    const proto_initIcon = L.Marker.prototype._initIcon;
    const proto_setPos = L.Marker.prototype._setPos;

    const oldIE = (L.DomUtil.TRANSFORM === 'msTransform');

    L.Marker.addInitHook(function () {
      const iconOptions = this.options.icon && this.options.icon.options;
      let iconAnchor = iconOptions && this.options.icon.options.iconAnchor;
      if (iconAnchor) {
        iconAnchor = (`${iconAnchor[0]}px ${iconAnchor[1]}px`);
      }
      this.options.rotationOrigin = this.options.rotationOrigin || iconAnchor || 'center bottom';
      this.options.rotationAngle = this.options.rotationAngle || 0;

      // Ensure marker keeps rotated during dragging
      this.on('drag', (e) => { e.target._applyRotation(); });
    });

    L.Marker.include({
      _initIcon() {
        proto_initIcon.call(this);
      },

      _setPos(pos) {
        proto_setPos.call(this, pos);
        this._applyRotation();
      },

      _applyRotation() {
        if (this.options.rotationAngle) {
          this._icon.style[`${L.DomUtil.TRANSFORM}Origin`] = this.options.rotationOrigin;

          if (oldIE) {
            // for IE 9, use the 2D rotation
            this._icon.style[L.DomUtil.TRANSFORM] = `rotate(${this.options.rotationAngle}deg)`;
          } else {
            // for modern browsers, prefer the 3D accelerated version
            this._icon.style[L.DomUtil.TRANSFORM] += ` rotateZ(${this.options.rotationAngle}deg)`;
          }
        }
      },

      setRotationAngle(angle) {
        this.options.rotationAngle = angle;
        this.update();
        return this;
      },

      setRotationOrigin(origin) {
        this.options.rotationOrigin = origin;
        this.update();
        return this;
      },
    });
  }
  /* eslint-enable no-underscore-dangle, camelcase, func-names */

  // #endregion

  /**
     * Update the popup for a specific {@link Member}
     * @param {Member} m - the member to update
     */
  function updatePopup(m) {
    let htmlstring = /* html */`
      <div style="width:180px;">
      <h3 style="text-align:center;">${m.name}</h3>
    `;
    if (m.avatar) {
      htmlstring += /* html */`
        <img src="${m.avatar}" width="90" height="90" style="margin-left:45px;">
      `;
    }
    if (m.expired) { htmlstring += '<br>Sharing Expired.'; }

    htmlstring += /* html */`
      <dl>
      <dt>travelling:</dt>
      <dd>By ${travelMode[m.travelType]}</dd>
    `;

    if (typeof (m.speed) === 'number') {
      htmlstring += /* html */`
        <dt>speed:</dt>
        <dd>${m.speed.toFixed(1)} km/h</dd>
      `;
    }
    htmlstring += /* html */`
      <dt>last update:</dt>
      <dd>${timeAgo(m.last)}</dd>
      </dl>
      </div>
    `;
    m.marker.setPopupContent(htmlstring);
  }

  function startUpdateLoop() {
    updateLoop = setInterval(async () => {
      const groups = await glympseApi(`groups/${encodeURIComponent(glympsetag)}/events?next=${next}`);
      // beware: events or group response type possible!
      if (groups.type === 'events') {
        next = groups.next;
        groups.items.forEach((item) => {
          if (item.type === 'invite') {
            // new user sharing
            const existingMember = allMembers.find((m) => m.id === item.member);
            if (existingMember) {
              existingMember.invite = item.invite;
              existingMember.expired = false;
              existingMember.next = 0;
              existingMember.line.setLatLngs([]);
              const ic = existingMember.marker.getIcon();
              ic.options.className = 'glympse-arrowhead';
              existingMember.marker.setIcon(ic);
              updatePopup(existingMember);
            } else {
              const newMember = {
                id: item.member,
                name: item.member, // user's nickname not known yet, will get sent on user update --> "properties" array (bc. next is 0)
                invite: item.invite,
                next: 0,
                marker: L.marker([0, 0], {
                  title: item.member,
                  draggable: false,
                  icon: L.divIcon({
                    className: 'glympse-arrowhead',
                    iconSize: [29, 30],
                    iconAnchor: [15, 15],
                  }),
                  rotationOrigin: 'center center',
                }).bindPopup().addTo(glympseLayers),
                line: L.polyline([], { color: 'red', interactive: false }).addTo(glympseLayers),
              };
              allMembers.push(newMember);
              updatePopup(newMember);
            }
          } else {
            console.debug(`unhandled event ${item.type}: `, item);
          }
          // there is type 'join', probably new user watching the glympse tag
          // TODO: is there a type 'leave' event or similar? how exactly is it called? - probably the ticket is set to expired?
        });
      } else {
        // type == 'group'
        next = groups.events;
        // TODO: does the response include all members then? i assume so...
        console.debug('present member count: ', allMembers.length, ', received member count: ', groups.members.length);
        groups.members.forEach((m) => {
          const existingMember = allMembers.find((pm) => pm.id === m.id);
          if (existingMember) { existingMember.invite = m.invite; } else {
            const newMember = {
              id: m.id,
              name: m.id, // user's nickname not known yet, will get sent on user update --> "properties" array (bc. next is 0)
              invite: m.invite,
              next: 0,
              marker: L.marker([0, 0], {
                title: m.name,
                draggable: false,
                icon: L.divIcon({
                  className: 'glympse-arrowhead',
                  iconSize: [29, 30],
                  iconAnchor: [15, 15],
                }),
                rotationOrigin: 'center center',
              }).bindPopup().addTo(glympseLayers),
              line: L.polyline([], { color: 'red', interactive: false }).addTo(glympseLayers),
            };
            allMembers.push(newMember);
            updatePopup(newMember);
          }
        });
      }

      const tooManyPromises = [];
      allMembers.forEach((m) => {
        if (m.expired) { return; }
        tooManyPromises.push(glympseApi(`invites/${m.invite}?next=${m.next}&uncompressed=true`).then((response) => {
          // update all member's locations
          if (response.location) {
            response.location.forEach((l) => {
              m.line.addLatLng([l[1] / 1000000, l[2] / 1000000]);
            });
            m.marker.setLatLng(m.line.getLatLngs()[m.line.getLatLngs().length - 1]);

            const latestLocationWithAdditionalInfo = findLast(response.location, ((e) => e.length >= 5));
            if (latestLocationWithAdditionalInfo) {
              // speed is null if denied by user, null * 0.036 = 0 ==> check for null before multiplication
              if (typeof latestLocationWithAdditionalInfo[3] === 'number') {
                m.speed = latestLocationWithAdditionalInfo[3] * 0.036;
              }
              m.heading = latestLocationWithAdditionalInfo[4];
              m.marker.setRotationAngle(m.heading);
            }
          }

          m.next = response.next;
          m.last = new Date(response.last);

          // handle nickname change
          let newNickName;
          if (response.properties && response.properties.findIndex((prop) => prop.n === 'name') !== -1) {
            newNickName = response.properties.find((prop) => prop.n === 'name');
          } else if (response.data && response.data.findIndex((prop) => prop.n === 'name') !== -1) {
            newNickName = response.data.find((prop) => prop.n === 'name');
          }
          if (newNickName) {
            m.name = newNickName.v;
            m.marker.options.title = newNickName.v;
          }

          // handle invite expiry change
          let expired;
          if (response.properties) {
            expired = response.properties.find((prop) => prop.n === 'expired')?.v;
          } else if (response.data) {
            expired = response.data.find((prop) => prop.n === 'expired')?.v;
          }

          if (typeof (expired) === 'boolean') {
            m.expired = expired;
            const ic = m.marker.getIcon();
            if (m.expired) {
              ic.options.className = 'glympse-arrowhead expired';
            } else {
              ic.options.className = 'glympse-arrowhead';
            }
            m.marker.setIcon(ic);
          }

          // avatar change
          m.avatar = response.properties
            ?.find((p) => p.n === 'avatar')
            ?.v
          ?? response.data
            ?.find((p) => p.n === 'avatar')
            ?.v
          ?? m.avatar;

          // travel type change
          m.travelType = response.properties
            ?.find((p) => p.n === 'travel_mode')
            ?.v
            .type
          ?? response.data
            ?.find((p) => p.n === 'travel_mode')
            ?.v
            .type
          ?? m.travelType;

          updatePopup(m);
        }));
      });
      await Promise.all(tooManyPromises);
    }, updateSpeed);
  }

  async function fetchInitialData() {
    const groups = await glympseApi(`groups/${encodeURIComponent(glympsetag)}`);
    allMembers = groups.members;
    next = groups.events + 1;
    const tooManyPromises = [];
    const latLngs = [];
    allMembers.forEach((m) => {
      let thisMemberHasError = false;
      tooManyPromises.push(glympseApi(`invites/${m.invite}?uncompressed=true`).catch((e) => {
        // sometimes the invite code is set in group members list but upon trying to retrieve it the API complains that it's no longer available.
        // if that happens, just skip that member.
        thisMemberHasError = true;
        if (e.message && !e.message.includes('Unable to retrieve invite_code')) {
          alert(e.message);
        } else if (!e.message) {
          alert(e);
        }
        allMembers.splice(allMembers.indexOf(m), 1);
      }).then((response) => {
        if (thisMemberHasError) return;
        response.location.forEach((l) => {
          latLngs.push([l[1] / 1000000, l[2] / 1000000]);
        });
        const latestLocationWithAdditionalInfo = findLast(response.location, ((e) => e.length >= 5));
        if (latestLocationWithAdditionalInfo) {
          // speed is null if denied by user, null * 0.036 = 0 ==> check for null before multiplication
          if (typeof latestLocationWithAdditionalInfo[3] === 'number') {
            m.speed = latestLocationWithAdditionalInfo[3] * 0.036;
          }
          m.heading = latestLocationWithAdditionalInfo[4];
        }

        m.name = response.properties.find((p) => p.n === 'name').v;
        m.next = response.next;
        m.last = new Date(response.last);
        m.expired = response.properties.find((p) => p.n === 'expired')?.v;
        m.avatar = response.properties.find((p) => p.n === 'avatar')?.v;
        m.travelType = response.properties.find((p) => p.n === 'travel_mode')?.v.type;
        m.line = L.polyline(latLngs, { color: 'red', interactive: false }).addTo(glympseLayers);
        let className = 'glympse-arrowhead';
        if (m.expired) { className += ' expired'; }
        m.marker = L.marker(latLngs[latLngs.length - 1], {
          title: m.name,
          draggable: false,
          icon: L.divIcon({
            className,
            iconSize: [29, 30],
            iconAnchor: [15, 15],
          }),
          rotationOrigin: 'center center',
        }).bindPopup().addTo(glympseLayers);

        if (m.heading) {
          m.marker.setRotationAngle(m.heading);
        }
        updatePopup(m);
      }));
    });
    await Promise.all(tooManyPromises);
    startUpdateLoop();
  }

  async function logIntoApi() {
    try {
      const response = await glympseApi(
        `account/login?id=${encodeURIComponent(user)}&password=${encodeURIComponent(password)}&api_key=${apiKey}`,
        { method: 'POST' },
        false,
      );
      accesstoken = response.access_token;
      // TODO: handle expires_in
      /*
          * probably not need to handle: according to the docs, this value is in seconds.
          * when trying i got a value of 632720000.
          * even if this would be milliseconds, it would last a bit more than a week...
        */
      if (glympsetag) { fetchInitialData(); }
    } catch (/** @type {Error} */ e) {
      alert(/* html */`login unsuccessful:<br><code>${e.message}</code>`, true);
    }
  }

  function openSettings() {
    const dial = window.dialog({
      html: /* html */`
        <h3>API settings</h3>
        <div>
          <label for="glympseID">username:</label>
          <input type="text" id="glympseID" value="${user ?? ''}" required>
        </div>
        <div>
          <label for="glympsePassword">password:</label>
          <input type="text" id="glympsePassword" value="${password ?? ''}" required>
        </div>
        <div>
          <label for="glympseApiToken">API token:</label>
          <input type="text" id="glympseApiToken" value="${apiKey ?? ''}" required>
          <p>Possibilities to get the API token:</p>
          <ul>
            <li>Get yourself a trial token at <a href="https://developer.glympse.com/account/apps" target="_blank">Glympse Developers</a></li>
            <li>Open a Glympse tag in browser with dev tools open.
              Look for the login network request to the Glympse API and use the Glympse viewer's token.<br>
              Note that this is against Glympse's ToS
            </li>
          </ul>
        </div>
        <h3>Other settings</h3>
        <div>
          <label for="glympsetag">Glympse tag:</label>
          !<input type="text" id="glympsetag" title="don't enter the '!'" value="${glympsetag ?? ''}" required>
        </div>
        <div>
          <label for="refreshrate">update speed:</label>
          <input type="number" id="refreshrate" min="1000" value="${updateSpeed ?? 5000}" required>
          <p>refresh rate in milliseconds.</p>
        </div>
      `,
      buttons: [{
        text: 'Save',
        click: () => {
          const settings = {
            user: document.getElementById('glympseID').value,
            password: document.getElementById('glympsePassword').value,
            apiKey: document.getElementById('glympseApiToken').value,
            glympsetag: document.getElementById('glympsetag').value,
            updateSpeed: document.getElementById('refreshrate').value,
          };
          if (!/^[\p{L}_\d]*$/u.test(settings.glympsetag)) {
            settings.glympsetag = null;
            alert(`Glympse tag invalid. Only letters, digits or underscore allowed.
              Don't add the '!'.
              Unsetting it...`);
          }
          if (!settings.updateSpeed) { settings.updateSpeed = 5000; }
          if (settings.updateSpeed < 1000) { settings.updateSpeed = 1000; }
          clearInterval(updateLoop);
          user = settings.user;
          password = settings.password;
          apiKey = settings.apiKey;
          glympsetag = settings.glympsetag;
          updateSpeed = settings.updateSpeed;
          localStorage.setItem('plugin-glympse', JSON.stringify(settings));
          glympseLayers.clearLayers();
          allMembers = [];
          if (user && password && apiKey && glympsetag) {
            logIntoApi();
          } else {
            window.map.removeLayer(glympseLayers);
          }
          dial.dialog('close');
        },
      }],
      title: 'Glympse Settings',
    });
  }

  // #region Setup
  const setup = function setup() {
    // init script
    setupRotatedMarker();
    glympseLayers = new L.LayerGroup(null, { attribution: 'Realtime locations by <a href="https://glympse.com">Glympse</a>' });
    const toolboxLink = document.getElementById('toolbox').appendChild(document.createElement('a'));
    toolboxLink.addEventListener('click', openSettings);
    toolboxLink.innerText = 'Glympse Settings';
    toolboxLink.type = 'button';

    const styleElem = document.head.appendChild(document.createElement('style'));
    styleElem.innerText = style;
    // glympseLayers.addTo(map)

    // read settings from local storage
    const jsonstring = localStorage.getItem('plugin-glympse');
    if (jsonstring) {
      const settings = JSON.parse(jsonstring);
      user = settings.user;
      password = settings.password;
      apiKey = settings.apiKey;
      glympsetag = settings.glympsetag;
      updateSpeed = settings.updateSpeed;
    }

    window.map.addEventListener('overlayadd', (e) => {
      if (e.name === 'Glympse') {
        if (user && password && apiKey && glympsetag) {
          if (!accesstoken) {
            logIntoApi();
          } else {
            fetchInitialData();
          }
        } else {
          alert('invalid settings.\nPlease complete them.', false, openSettings);
        }
      }
    });

    window.map.addEventListener('overlayremove', (e) => {
      if (e.name === 'Glympse') {
        if (updateLoop) {
          clearInterval(updateLoop);
        }
        allMembers = [];
        glympseLayers.clearLayers();
      }
    });

    window.addLayerGroup('Glympse', glympseLayers);

    if (window.isLayerGroupDisplayed('Glympse')) {
      if (!user || !password || !apiKey) {
        window.map.removeLayer(glympseLayers);
        return;
      }

      // log in to glympse api
      logIntoApi();
    }
  };
  // #endregion

  // PLUGIN END //////////////////////////////////////////////////////////

  // add the script info data to the function as a property
  setup.info = PluginInfo;
  if (!window.bootPlugins) window.bootPlugins = [];
  window.bootPlugins.push(setup);
  // if IITC has already booted, immediately run the 'setup' function
  if (window.iitcLoaded && typeof setup === 'function') setup();
}

/*
 * wrapper end
 * inject code into site context
 */
const script = document.createElement('script');
const info = {};
if (typeof GM_info !== 'undefined' && GM_info && GM_info.script) {
  info.script = {
    version: GM_info.script.version,
    name: GM_info.script.name,
    description: GM_info.script.description,
  };
}
script.appendChild(document.createTextNode(`(${wrapper})(${JSON.stringify(info)});`));
(document.body || document.head || document.documentElement).appendChild(script);
