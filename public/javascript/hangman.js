console.log("Hello from your index file");



// let audioURL = document.querySelector(".audio");
// console.log("Object grabbed: ", audioURL);
//
// console.log("ID: ", audioURL.id);
let player = document.createElement("audio");

fetch("https://api.soundcloud.com/i1/tracks/36864179/streams?client_id=2t9loNQH90kzJcsFCODdigxfp325aq4z").then(
  function(response){
    console.log("Response received:");
    console.log(response);
    response.json().then(function(data){
      console.log('Data processed:');
      console.log(data);
      player.src = data.http_mp3_128_url;
      player.play();
    })
  },
  function(reject){
    console.log("API request rejected");
  })
