function getPassedTime(timestamp){
    var passedTime = (Date.now() - timestamp);
    var h, m, s;

    s = Math.floor(passedTime / 1000 % 60)
    m = Math.floor(passedTime / 1000 / 60 % 60)
    h = Math.floor(passedTime / 1000 / 3600 % 24)


    return (h > 0 ? h.toString().padStart(2, "0") + ":" : "") + m.toString().padStart(2, "0") + ":" + s.toString().padStart(2, "0")
}

// DISCORD
const discord_user_id = '472803917072171026';
var last_username;
var last_avatar;

async function getDiscordData(){
    try {
        const response = await fetch("https://api.lanyard.rest/v1/users/" + discord_user_id);
        responseJSON = await response.json()
        
        return responseJSON.data;
    } catch (error) {
        return console.error(error);
    }
}

async function updateDiscordData(){
    var data = await getDiscordData();

    if(last_avatar != data.discord_user.avatar){
        document.querySelector("#discordAvatar").src = "https://cdn.discordapp.com/avatars/" + discord_user_id + "/" + data.discord_user.avatar + "?size=512";
        last_avatar = data.discord_user.avatar;
    }

    if(last_username != data.discord_user.username){
        document.querySelector("#discordUsername").innerHTML = "@" + data.discord_user.username;
        last_username = data.discord_user.username;
    }

    document.querySelector("#discordDisplayname").innerHTML = data.discord_user.global_name;
    document.querySelector("#discordApps").innerHTML = "";

    if (data.spotify){
        var div = document.createElement("div");
        div.classList.add("discordApp");
        div.innerHTML = `
            <div class="discordAppImages">
                <img class="discordAppLargeImage" src="${data.spotify.album_art_url}" />
            </div>

            <div class="discordAppDetails">
                <span class="discordAppName">${data.spotify.song}</span>
                <span class="discordAppDescription">${data.spotify.artist.replaceAll(";", ",")}</span>

                <div class="discordAppTrackTime">
                    <span>${getPassedTime(Math.max(data.spotify.timestamps.start, Date.now() + (data.spotify.timestamps.start - data.spotify.timestamps.end)))}</span>
                    <div class="discordAppTrack">
                        <div class="discordAppTrackPointer" style="width: ${Math.min((Date.now() - data.spotify.timestamps.start) / (data.spotify.timestamps.end - data.spotify.timestamps.start), 1) * 100}%;"></div>
                    </div>
                    <span>${getPassedTime(Date.now() + (data.spotify.timestamps.start - data.spotify.timestamps.end))}</span>
                </div>
            </div>
        `;
        document.querySelector("#discordApps").appendChild(div);
        addTooltip(div.querySelector(".discordAppLargeImage"), "top", data.spotify.album)
    }

    data.activities.forEach(app => {
        if (app.type == 4 || app.type == 2) { return };

        var div = document.createElement("div");
        div.classList.add("discordApp");
        div.innerHTML = `
            <div class="discordAppImages">
                <img class="discordAppLargeImage" src="${app.assets && app.assets.large_image ? 'https://cdn.discordapp.com/app-assets/' + app.application_id + '/' + app.assets.large_image + ".png?size=160" :  'https://dcdn.dstn.to/app-icons/' + app.application_id + '?size=256'}" />
                ${app.assets && app.assets.small_image ? '<img class="discordAppSmallImage" src="https://cdn.discordapp.com/app-assets/' + app.application_id + '/' + app.assets.small_image + '.png?size=160" />' : ""}
            </div>

            <div class="discordAppDetails">
                <span class="discordAppName">${app.name}</span>
                <span class="discordAppDescription">${app.details || ""}</span>
                <span class="discordAppState">${app.state || ""}</span>
                
                <span class="discordAppTime" style="${app.timestamps ? "" : 'display: none'}">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-clock-fill" viewBox="0 0 16 16">
                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71z"/>
                    </svg>
                    ${app.timestamps ? getPassedTime(app.timestamps.start) : ""}
                </span>
            </div>
        `;
        document.querySelector("#discordApps").appendChild(div);
        if(app.assets.small_text){addTooltip(div.querySelector(".discordAppLargeImage"), "top", app.assets.large_text)}
        if(app.assets.small_text){addTooltip(div.querySelector(".discordAppSmallImage"), "top", app.assets.small_text)}
    });
}
updateDiscordData()

setInterval(updateDiscordData, 1000);

// TOOLTIPS

function addTooltip(element, placement, text){
    element.addEventListener("mouseenter", (event) => {
        if ( document.querySelector("tooltip") ) { document.querySelector("tooltip").remove(); };

        var tooltip = document.createElement("tooltip");
        tooltip.innerHTML = text;

        document.querySelector("body").appendChild(tooltip);

        // POZYCJONOWANIE
        if (placement == "top") {
            tooltip.style.top = element.getBoundingClientRect().top - (tooltip.getBoundingClientRect().height + parseInt(getComputedStyle(tooltip).marginBottom, 10) + parseInt(getComputedStyle(tooltip).marginTop, 10)) + "px";
            tooltip.style.left = element.getBoundingClientRect().left - (tooltip.getBoundingClientRect().width + parseInt(getComputedStyle(tooltip).marginLeft, 10) + parseInt(getComputedStyle(tooltip).marginRight, 10))/2 + element.getBoundingClientRect().width/2 + "px";
        }
        else if (placement == "bottom"){
            tooltip.style.top = element.getBoundingClientRect().bottom + "px";
            tooltip.style.left = element.getBoundingClientRect().left - (tooltip.getBoundingClientRect().width + parseInt(getComputedStyle(tooltip).marginLeft, 10) + parseInt(getComputedStyle(tooltip).marginRight, 10))/2 + element.getBoundingClientRect().width/2 + "px";
        }
        else if (placement == "left"){
            tooltip.style.top = element.getBoundingClientRect().top + element.getBoundingClientRect().height/2 - (tooltip.getBoundingClientRect().height + parseInt(getComputedStyle(tooltip).marginTop, 10) + parseInt(getComputedStyle(tooltip).marginBottom, 10))/2 + "px";
            tooltip.style.left = element.getBoundingClientRect().left - (tooltip.getBoundingClientRect().width + parseInt(getComputedStyle(tooltip).marginLeft, 10) + parseInt(getComputedStyle(tooltip).marginRight, 10)) + "px";
        }
        else if (placement == "right"){
            tooltip.style.top = element.getBoundingClientRect().top + element.getBoundingClientRect().height/2 - (tooltip.getBoundingClientRect().height + parseInt(getComputedStyle(tooltip).marginTop, 10) + parseInt(getComputedStyle(tooltip).marginBottom, 10))/2 + "px";
            tooltip.style.left = element.getBoundingClientRect().right + "px";
        }

        document.querySelector("tooltip").style.animation = "tooltip-show 0.1s";
    });

    element.addEventListener("mouseleave", (event) => {
        document.querySelector("tooltip").style.animation = "tooltip-hide 0.1s";

        document.querySelector("tooltip").addEventListener("animationend", () => {
            document.querySelector("tooltip").remove();
          });
    });
}

addTooltip(document.querySelector("#namemcLinkButton"), "bottom", "NameMC")
addTooltip(document.querySelector("#discordLinkButton"), "bottom", "Discord")
addTooltip(document.querySelector("#steamLinkButton"), "bottom", "Steam")
addTooltip(document.querySelector("#spotifyLinkButton"), "bottom", "Spotify")
addTooltip(document.querySelector("#youtubeLinkButton"), "bottom", "YouTube")