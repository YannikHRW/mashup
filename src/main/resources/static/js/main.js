"use strict"

document.addEventListener("DOMContentLoaded", () => {

    const host = window.location.host;

    /*document.cookie.set('name', 'value', {
        sameSite: 'none',
        secure: true
    })*/

    var mapProp = {
        //center:new google.maps.LatLng(51.508742,-0.120850),
        center: new google.maps.LatLng(51.450832, 7.013056),
        zoom: 2,
    };

    var marker;
    var infoWindow = new google.maps.InfoWindow();
    let mainNodeCoordinates;


    console.log(Date.now())

    const map = new google.maps.Map(document.getElementById("googleMap"), mapProp);

    let mainNodeRequest = new XMLHttpRequest();
    mainNodeRequest.open('GET', "http://" + host + "/get_nodes/main");
    mainNodeRequest.responseType = 'json';
    mainNodeRequest.send();

    mainNodeRequest.onload = function () {
        const mainNodeResult = mainNodeRequest.response;
        console.log(mainNodeResult)
        const mainNodeArray = mainNodeResult.peers
        const mainNode = mainNodeArray[0];

        let latitude = parseFloat(mainNode.latitude)
        let longitude = parseFloat(mainNode.longitude)

        mainNodeCoordinates = {lat: latitude, lng: longitude}

        marker = new google.maps.Marker({
            position: {
                lat: latitude,
                lng: longitude
            },
            map: map,
            icon: "http://maps.google.com/mapfiles/kml/paddle/red-stars.png"
        });

        let list = document.createElement("ul")

        const flag = document.createElement("img")
        flag.setAttribute("src", mainNode.country_flag);
        flag.classList.add("flag");

        const countryName = document.createElement("li")
        countryName.innerText = "Country: " + mainNode.country_name;

        const city = document.createElement("li")
        city.innerText = "City: " + mainNode.city;

        const peerName = document.createElement("li")
        peerName.innerText = "Peer Name: " + mainNode.peerName;

        const peerNonce = document.createElement("li")
        peerNonce.innerText = "Peer Nonce: " + mainNode.peerNonce;

        const applicationName = document.createElement("li")
        applicationName.innerText = "Application Name: " + mainNode.applicationName;

        const applicationVersion = document.createElement("li")
        applicationVersion.innerText = "Application Version: " + mainNode.applicationVersion;

        list.append(flag, countryName, city, peerName, peerNonce, applicationName, applicationVersion);

        marker.addListener('click', (function(marker) {
            return function() {
                infoWindow.setContent('<h1>Main Node</h1>' + list.innerHTML)
                infoWindow.open(map, marker)
            }
        })(marker));
    }

    let allPeersList = [];

    let allNodesRequest = new XMLHttpRequest();
    allNodesRequest.open('GET', "http://" + host + "/get_nodes/all");
    allNodesRequest.responseType = 'json';
    allNodesRequest.send();

    allNodesRequest.onload = function () {
        const nodesResult = allNodesRequest.response;

        const peers = nodesResult.peers;

        for (const peer of peers) {


            let latitude = parseFloat(peer.latitude)
            let longitude = parseFloat(peer.longitude)


            const icon = {
                url: "https://maps.google.com/mapfiles/kml/paddle/wht-blank.png",
                scaledSize: new google.maps.Size(40, 40)
            }

            let nextList = "";

            for (const peerInList of allPeersList) {
                if (parseFloat(peerInList.latitude) === latitude && parseFloat(peerInList.longitude) === longitude) {

                    nextList = document.createElement("ul")

                    const peerName = document.createElement("li")
                    peerName.innerText = "Peer Name: " + peerInList.peerName;

                    const peerNonce = document.createElement("li")
                    peerNonce.innerText = "Peer Nonce: " + peerInList.peerNonce;

                    const applicationName = document.createElement("li")
                    applicationName.innerText = "Application Name: " + peerInList.applicationName;

                    const applicationVersion = document.createElement("li")
                    applicationVersion.innerText = "Application Version: " + peerInList.applicationVersion;

                    const status = document.createElement("li")
                    status.innerText = "Status: not connected";

                    const lastSeen = document.createElement("li")
                    lastSeen.innerText = "Last time connected: " + new Date(peer.lastSeen).toLocaleDateString("de-DE") + " " + new Date(peer.lastSeen).toLocaleTimeString("de-DE");

                    nextList.append(peerName, peerNonce, applicationName, applicationVersion, status, lastSeen);
                }
            }

            allPeersList.push(peer);

            marker = new google.maps.Marker({
                position: {
                    lat: latitude,
                    lng: longitude
                },
                map: map,
                icon: icon
            });


            let list = document.createElement("ul")

            const flag = document.createElement("img")
            flag.setAttribute("src", peer.country_flag);
            flag.classList.add("flag");

            const countryName = document.createElement("li")
            countryName.innerText = "Country: " + peer.country_name;

            const city = document.createElement("li")
            city.innerText = "City: " + peer.city;

            const peerName = document.createElement("li")
            peerName.innerText = "Peer Name: " + peer.peerName;

            const peerNonce = document.createElement("li")
            peerNonce.innerText = "Peer Nonce: " + peer.peerNonce;

            const applicationName = document.createElement("li")
            applicationName.innerText = "Application Name: " + peer.applicationName;

            const applicationVersion = document.createElement("li")
            applicationVersion.innerText = "Application Version: " + peer.applicationVersion;

            const status = document.createElement("li")
            status.innerText = "Status: not connected";

            const lastSeen = document.createElement("li")
            lastSeen.innerText = "Last time connected: " + new Date(peer.lastSeen).toLocaleDateString("de-DE") + " " + new Date(peer.lastSeen).toLocaleTimeString("de-DE");

            /*const peerNonce = document.createElement("li")
            peerNonce.innerText = "Peer Nonce: " + peer.peerNonce;

            const applicationName = document.createElement("li")
            applicationName.innerText = "Application Name: " + peer.applicationName;

            const applicationVersion = document.createElement("li")
            applicationVersion.innerText = "Application Version: " + peer.applicationVersion;*/

            list.append(flag, countryName, city, peerName, peerNonce, applicationName, applicationVersion, status, lastSeen);

            marker.addListener('click', (function(marker) {
                return function() {
                    if (nextList.innerHTML) {
                        infoWindow.setContent(list.innerHTML + nextList.innerHTML)
                    }
                    else {
                        infoWindow.setContent(list.innerHTML)
                    }
                    infoWindow.open(map, marker)
                }
            })(marker));
        }
    }

    let peersList = [];

    let activeNodeRequest = new XMLHttpRequest();
    activeNodeRequest.open('GET', "http://" + host + "/get_nodes/active");
    activeNodeRequest.responseType = 'json';
    activeNodeRequest.send();

    activeNodeRequest.onload = function () {
        const nodesResult = activeNodeRequest.response;

        const peers = nodesResult.peers;

        for (const peer of peers) {


            let latitude = parseFloat(peer.latitude)
            let longitude = parseFloat(peer.longitude)

            const flightPlanCoordinates = [
                mainNodeCoordinates,
                {lat: latitude, lng: longitude}
            ];

            const flightPath = new google.maps.Polyline({
                path: flightPlanCoordinates,
                geodesic: false,
                strokeColor: '#FF0000',
                strokeOpacity: 1.0,
                strokeWeight: 1
            })

            flightPath.setMap(map);

            const icon = {
                url: "https://maps.google.com/mapfiles/kml/paddle/grn-blank.png",
                scaledSize: new google.maps.Size(40, 40)
            }

            let nextList = "";

            for (const peerInList of peersList) {
                if (parseFloat(peerInList.latitude) === latitude && parseFloat(peerInList.longitude) === longitude) {

                    nextList = document.createElement("ul")

                    const peerName = document.createElement("li")
                    peerName.innerText = "Peer Name: " + peerInList.peerName;

                    const peerNonce = document.createElement("li")
                    peerNonce.innerText = "Peer Nonce: " + peerInList.peerNonce;

                    const applicationName = document.createElement("li")
                    applicationName.innerText = "Application Name: " + peerInList.applicationName;

                    const applicationVersion = document.createElement("li")
                    applicationVersion.innerText = "Application Version: " + peerInList.applicationVersion;

                    const status = document.createElement("li")
                    status.innerText = "Status: currently connected";

                    nextList.append(peerName, peerNonce, applicationName, applicationVersion, status);
                }
            }

            marker = new google.maps.Marker({
                position: {
                    lat: latitude,
                    lng: longitude
                },
                map: map,
                icon: icon
            });

            peersList.push(peer);

            let list = document.createElement("ul")

            const flag = document.createElement("img")
            flag.setAttribute("src", peer.country_flag);
            flag.classList.add("flag");

            const countryName = document.createElement("li")
            countryName.innerText = "Country: " + peer.country_name;

            const city = document.createElement("li")
            city.innerText = "City: " + peer.city;

            const peerName = document.createElement("li")
            peerName.innerText = "Peer Name: " + peer.peerName;

            const peerNonce = document.createElement("li")
            peerNonce.innerText = "Peer Nonce: " + peer.peerNonce;

            const applicationName = document.createElement("li")
            applicationName.innerText = "Application Name: " + peer.applicationName;

            const applicationVersion = document.createElement("li")
            applicationVersion.innerText = "Application Version: " + peer.applicationVersion;

            const status = document.createElement("li")
            status.innerText = "Status: currently connected";

            list.append(flag, countryName, city, peerName, peerNonce, applicationName, applicationVersion, status);

            marker.addListener('click', (function(marker) {
                return function() {
                    if (nextList.innerHTML) {
                        infoWindow.setContent(list.innerHTML + nextList.innerHTML)
                    }
                    else {
                        infoWindow.setContent(list.innerHTML)
                    }
                    infoWindow.open(map, marker)
                }
            })(marker));
        }
    }



})