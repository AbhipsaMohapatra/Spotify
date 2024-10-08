console.log("lets start js");
let currsong = new Audio();
let song;
let currfolder;
function secondsToTimeString(totalSeconds) {
    // Ensure the input is a non-negative integer
    if (totalSeconds < 0 || isNaN(totalSeconds)) {
        return "invalid";
    }

    // Calculate minutes and seconds
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);

    // Format minutes and seconds to always have two digits
    const minutesStr = String(minutes).padStart(2, '0');
    const secondsStr = String(seconds).padStart(2, '0');

    // Return the formatted string
    return `${minutesStr}:${secondsStr}`;
}


async function playsongs(folder) {
    currfolder = folder;
    let a = await fetch(`http://127.0.0.1:3000/songs/${folder}/`);
    let response = await a.text();
    // console.log(response);
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    //console.log(as);
    let songs = [];
    let arr = Array.from(as);
    for (const element of arr) {
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href);
        }

    }


    let s = document.querySelector(".songList").getElementsByTagName("ul")[0];
    s.innerHTML = "";
    for (const sng of songs) {
        //  newsng = sng.replace("%20","");
        //console.log(sng.split(`/songs/${currfolder}/`)[1].replaceAll("%20"," "));

        s.innerHTML = s.innerHTML + `                         <li>
                            <img  class="invert" src="SVGs/music.svg" alt="">
                            <div class="info">
                                <div>${sng.split(`/songs/${currfolder}/`)[1].replaceAll("%20", " ")}</div>
                                <div>Song Artist</div>
                            </div>
                            <img class="invert" src="SVGs/play.svg" alt="">

                         </li>           
        
        
          `;
    }

    //Add event listener to play
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", () => {
            console.log(e.querySelector(".info").firstElementChild.innerHTML);
            playmusic(e.querySelector(".info").firstElementChild.innerHTML.trim());


        })
    })

    //console.log(songs);
    return songs;





}
function playmusic(track, pause = false) {
    currsong.src = `/songs/${currfolder}/` + track;
    if (!pause) {
        currsong.play()
            .then(() => {
                play.src = "SVGs/pause.svg"; // Change to pause icon if playing
            })
            .catch(err => {
                console.error("Error playing audio:", err);
            });
    }

    document.querySelector(".songinfo").innerHTML = track;
    document.querySelector(".songtime").innerHTML = "00:00/00:00";
}

async function displayAlbums() {
    let a = await fetch(`http://127.0.0.1:3000/songs/`);
    let response = await a.text();
    // console.log(response);
    let div = document.createElement("div");
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a");
    let cardContainer = document.querySelector(".cardcont");
    console.log(anchors);
    let arrays = Array.from(anchors);
    for (let i = 0; i < arrays.length; i++) {
        e = arrays[i];
        if (e.href.includes("/songs")) {
            let folder = e.href.split("/").slice(-2)[0];
            let a = await fetch(`http://127.0.0.1:3000/songs/${folder}/info.json`);
            let response = await a.json();
            console.log(response);
            cardContainer.innerHTML = cardContainer.innerHTML + ` <div  data-folder="${folder}" class="card">
                        <div class="play">
                            <svg  class="imgsvg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" width="30" height="30">
                                <!-- Circle background -->
                                <circle cx="15" cy="15" r="14" fill="lightgreen" stroke="black" stroke-width="1" />
                                <!-- Your original SVG content scaled down -->
                                <g transform="scale(0.8) translate(6, 6)">
                                    <path d="M18.8906 12.846C18.5371 14.189 16.8667 15.138 13.5257 17.0361C10.296 18.8709 8.6812 19.7884 7.37983 19.4196C6.8418 19.2671 6.35159 18.9776 5.95624 18.5787C5 17.6139 5 15.7426 5 12C5 8.2574 5 6.3861 5.95624 5.42132C6.35159 5.02245 6.8418 4.73288 7.37983 4.58042C8.6812 4.21165 10.296 5.12907 13.5257 6.96393C16.8667 8.86197 18.5371 9.811 18.8906 11.154C19.0365 11.7084 19.0365 12.2916 18.8906 12.846Z" fill="black" stroke="black" stroke-width="1.5" stroke-linejoin="round" />
                                </g>
                            </svg>

                        </div>
                        
                        
                        
                        
                        <img src="/songs/${folder}/firstimg.jpeg" alt="">
                        <h4>${response.title}</h4>
                        <p>${response.description}</p>
                    </div>`

        }

    }
    //change playlist when a card is clicked
    Array.from(document.getElementsByClassName("card")).forEach((e) => {
        e.addEventListener("click", async item => {
            console.log(item.currentTarget.dataset, item);
            const fold = item.currentTarget.dataset.folder;
            console.log(fold);
            song = await playsongs(fold);
            //console.log(song[0].split("/songs/"));
            playmusic(song[0].split("/songs/")[1]);


        })
    })
}


async function main() {
    song = await playsongs(`ncs`);
    // console.log(song);
    // console.log(song[0].split("/songs/")[1].replaceAll("%20", " "));
    playmusic(song[0].split(`/songs/${currfolder}/`)[1].replaceAll("%20", " "), true);

    //Display albums

    displayAlbums();


    //add event listener to play bar
    play.addEventListener("click", () => {
        if (currsong.paused) {
            currsong.play();
            play.src = "SVGs/pause.svg";
        }
        else {
            currsong.pause();
            play.src = "SVGs/play.svg";
        }

    })

    //add event listener to settime
    currsong.addEventListener("timeupdate", () => {
        console.log(currsong.currentTime, currsong.duration);
        document.querySelector(".songtime").innerHTML = `${secondsToTimeString(currsong.currentTime)} / ${secondsToTimeString(currsong.duration)}`;
        document.querySelector(".circle").style.left = (currsong.currentTime / currsong.duration) * 100 + "%";
    })

    //Add event listener to seekbar
    document.querySelector(".seekbar").addEventListener("click", (e) => {
        console.log((e.offsetX / e.target.getBoundingClientRect().width) * 100);
        percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currsong.currentTime = (currsong.duration * percent) / 100;
    })

    //Add event listener to Hamburger
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0";
    })
    //Add event Listener to close
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%";
    })



    //add event listener to next
    document.querySelector("#next").addEventListener("click", () => {
        console.log("next is clicked");
        let ind = song.findIndex(s => s.split("/").pop() === currsong.src.split("/").pop());

        console.log(ind);
        if ((ind) < song.length - 1) {
            playmusic(song[ind + 1].split("/songs/")[1].replaceAll("%20", " "));
        }
    })

    //Add event litener to prev

    document.querySelector("#prev").addEventListener("click", () => {
        console.log("previous is clicked");

        let ind = song.findIndex(s => s.split("/").pop() === currsong.src.split("/").pop());
        console.log(ind);
        if (ind > 0) {
            playmusic(song[ind - 1].split("/songs/")[1].replaceAll("%20", " "));
        }
    });

    //add eventlisteners to range

    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        console.log("hello", e.target, e.target.value);
        currsong.volume = (e.target.value) / 100;
        if(currsong.volume >0){
            document.querySelector(".volume>img").src = document.querySelector(".volume>img").src.replace("mute.svg","volume.svg");

        }

    })

    //mute and unmute the volume 
    document.querySelector(".volume>img").addEventListener("click", (e) => {
        console.log(e.target);
        if (e.target.src.includes("volume.svg")) {
            console.log("yes");
            e.target.src = e.target.src.replace("volume.svg", "mute.svg");
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
            currsong.volume = 0;
        }
        else {
            e.target.src = e.target.src.replace("mute.svg", "volume.svg");
            currsong.volume = 0.1;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 10;

        }

    })












}
main();




