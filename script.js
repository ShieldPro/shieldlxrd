function getPassedTime(timestamp){
    var passedTime = (Date.now() - timestamp);
    var h, m, s;

    s = Math.floor(passedTime / 1000 % 60)
    m = Math.floor(passedTime / 1000 / 60 % 60)
    h = Math.floor(passedTime / 1000 / 3600 % 24)


    return (h > 0 ? h.toString().padStart(2, "0") + ":" : "") + m.toString().padStart(2, "0") + ":" + s.toString().padStart(2, "0")
}

// DISCORD API

async function getDiscordData(){
    const discord_user_id = '472803917072171026';

    try {
        const response = await fetch("https://api.lanyard.rest/v1/users/" + discord_user_id);
        responseJSON = await response.json()
        
        return responseJSON.data;
    } catch (error) {
        return console.error(error);
    }
}

async function injectDiscordData(){
    var data = await getDiscordData();
    var discordApps = document.createElement("div");
    discordApps.id = "discordApps";

    document.querySelector("#discordAvatar").src = `https://cdn.discordapp.com/avatars/${data.discord_user.id}/${data.discord_user.avatar}.png?size=512`;
    document.querySelector("#discordAvatar").style.outlineColor = data.discord_status == "online" && "rgb(35, 165, 90)" || data.discord_status == "dnd" && "rgb(242, 63, 67)" || data.discord_status == "idle" && "rgb(240, 178, 50)" || "rgb(128, 132, 142)";
    document.querySelector("#discordDisplayName").innerHTML = data.discord_user.display_name;
    document.querySelector("#discordUsername").innerHTML = "@" + data.discord_user.username;

    data.activities.forEach(app => {
        if (app.type ===  4 || app.type === 2){return};

        var div = document.createElement("div");
        div.className = "discordApp";
        div.innerHTML = `
            <div class="discordAppThumbnail">
                <img class="discordAppLargeImage" src='https://cdn.discordapp.com/app-assets/${app.application_id}/${app.assets.large_image}.png?size=160' />
                <img class="discordAppSmallImage" src='https://cdn.discordapp.com/app-assets/${app.application_id}/${app.assets.small_image}.png?size=160' />
            </div>

            <div class="discordAppTexts">
                <span class="discordAppName">${app.name}</span>
                <span class="discordAppState">${app.state || ""}</span>
                <span class="discordAppDetails">${app.details}</span>
                <span class="discordAppTime">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-clock-fill" viewBox="0 0 16 16">
                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71z"/>
                    </svg>
                    ${getPassedTime(app.timestamps.start)}
                </span>
            </div>
        `;

        discordApps.appendChild(div);
    });

    if (data.spotify){
        var div = document.createElement("div");
        div.className = "discordApp";
        div.innerHTML = `
            <div class="discordAppThumbnail">
                <img class="discordAppLargeImage" src='${data.spotify.album_art_url}' />
            </div>

            <div class="discordAppTexts">
                <span class="discordAppName">${data.spotify.song}</span>
                <span class="discordAppState">${data.spotify.artist.replaceAll(";", ",") || ""}</span>
                <div class="discordAppTrackInfo">
                    <span>${getPassedTime(Math.min(data.spotify.timestamps.start), Date.now() + (data.spotify.timestamps.start - data.spotify.timestamps.end))}</span>
                    <div class="discordAppTrack">
                        <div class="discordAppPointer" style="width: ${(Date.now() - data.spotify.timestamps.start) / (data.spotify.timestamps.end - data.spotify.timestamps.start) * 100}%;"></div>
                    </div>
                    <span>${getPassedTime(Date.now() + (data.spotify.timestamps.start - data.spotify.timestamps.end))}</span>
                </div>
            </div>
        `;
        discordApps.prepend(div);
    };

    if (data.activities.length > 0){ document.querySelector("#discord hr").style.display = "block" };
    document.querySelector("#discordApps").remove();
    document.querySelector("#discord").appendChild(discordApps);
}

injectDiscordData()

var interval = setInterval(injectDiscordData, 1000);