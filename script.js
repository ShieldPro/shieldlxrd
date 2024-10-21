async function getDiscordData(){
    var userID = "472803917072171026";

    try {
        const response = await fetch("https://api.lanyard.rest/v1/users/" + userID);

        if (!response.ok){
            throw new Error("Odpowiedź API: " + response.status);   
        }

        const responseData = await response.json();

        return {
            avatar: "https://cdn.discordapp.com/avatars/472803917072171026/" + responseData.data.discord_user.avatar + ".png?size=512",
            username: responseData.data.discord_user.username,
            displayName: responseData.data.discord_user.display_name,
            status: responseData.data.discord_status,
            presence: responseData.data.activities
        };
    } catch (error) {
        console.error(error);
    }
}

async function getSpotifyAccessToken(){
    var client_id = '72fc44d7220940e8bb8c0bcb31a731dd';
    var client_secret = 'b19cd98d03ce403584fa6e8e74a34f04';
    const refresh_token = 'AQB4JNb5Mng5w4SK-QnF08_sbWc-PH2cGfAhh-UwVDVEqUUUZXC3rDyuD0Fhd0GhQxvcyiBtsfp0-b-0F-e0zzuMuEeZg7GiIDpjv89b1XrQem6m7-nSdb2yPWfK2XqZg7g';

    try {
        const response = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + btoa(client_id + ':' + client_secret)
            },
            body: `grant_type=refresh_token&refresh_token=${refresh_token}`
        });

        const data = await response.json();
        return data.access_token; 
    } catch (error) {
        console.error('Błąd podczas odświeżania access_token spotify.' /*+ error*/);
    }
}

var spotify_access_token = getSpotifyAccessToken();

async function getSpotifyData(){
    
}
getSpotifyData()

async function loadDiscordData(){
    const data = await getDiscordData();

    document.querySelector("#discordAvatar").src = data.avatar;
    document.querySelector("#discordDisplayName").innerHTML = data.displayName;
    document.querySelector("#discordUsername").innerHTML = "@" + data.username;
    document.querySelector("#discordAvatar").style.outlineColor = data.status == "online" && "rgb(35, 165, 90)" || data.status == "dnd" && "rgb(242, 63, 67)" || data.status == "idle" && "rgb(240, 178, 50)" || "rgb(128, 132, 142)";

    data.presence.forEach(app => {
        if (app.type == 4 || app.type == 2){ return; };
        var div = document.createElement("div");
        div.className = "discordApp";
        div.innerHTML = `
            <img class="discordAppThumbnail" src="https://cdn.discordapp.com/app-assets/${app.application_id}/${app.assets.large_image}.png?size=160" />

            <div class="discordAppTexts">
                <span class="discordAppName">${app.name || ""}</span>
                <span class="discordAppState">${app.state || ""}</span>
                <span class="discordAppDetails">${app.details || ""}</span>
            </div>
        `;
        document.querySelector("#discordApps").appendChild(div);
    });

}

loadDiscordData()