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

async function loadDiscordData(){
    const data = await getDiscordData();

    document.querySelector("#discordAvatar").src = data.avatar;
    document.querySelector("#discordDisplayName").innerHTML = data.displayName;
    document.querySelector("#discordUsername").innerHTML = "@" + data.username;
    document.querySelector("#discordAvatar").style.outlineColor = data.status == "online" && "rgb(35, 165, 90)" || data.status == "dnd" && "rgb(242, 63, 67)" || data.status == "idle" && "rgb(240, 178, 50)" || "rgb(128, 132, 142)";

    document.querySelector("#discordPresenceThumbnail").src = "https://cdn.discordapp.com/app-assets/" + data.presence[2].application_id + "/" + data.presence[2].assets.large_image + ".png?size=160";
    document.querySelector("#discordPresenceName").innerHTML = data.presence[2].name;
    document.querySelector("#discordPresenceState").innerHTML = data.presence[2].state;
    document.querySelector("#discordPresenceDetails").innerHTML = data.presence[2].details;

}

loadDiscordData()