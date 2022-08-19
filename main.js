let audio = document.querySelector(".quranPlayer"),
  surahsContainer = document.querySelector(".surahs"),
  ayah = document.querySelector(".ayah"),
  next = document.querySelector(".next"),
  prev = document.querySelector(".prev"),
  play = document.querySelector(".play"),
  darkmode = document.querySelector("#darkbtn"),
  surahList = document.querySelector(".sidenav"),
  baseurl = "https://api.quran.com/api/v4/",
  audioUrl = "https://verses.quran.com/";
//Made dark mode on by default.
document.body.classList.toggle("dark-mode");
getSurahs();

function switchDarkMode() {
  var element = document.body;
  element.classList.toggle("dark-mode");
}
darkmode.addEventListener("click", switchDarkMode);
function getSurahs() {
  fetch("https://api.quran.com/api/v4/chapters?language=en")
    .then((repsonse) => repsonse.json())
    .then((data) => {
      console.log(data);
      for (let surah in data.chapters) {
        // console.log(data.chapters[surah])
        surahsContainer.innerHTML += `
        <div class="surah-name">
        <p>${data.chapters[surah].name_arabic}</p>
        <p>${data.chapters[surah].name_simple}</p>
        </div>
        `;
      }
      //Select all surahs
      let surahText = document.querySelector(".surah-name");
      let allSurahs = document.querySelectorAll(".surahs div"),
        AyahsAudios,
        AyahsText;
      allSurahs.forEach((surah, index) => {
        surah.addEventListener("click", () => {
          Promise.all([
            fetch(
              baseurl + `	/quran/recitations/3/?chapter_number=${index + 1}`
            ).then((resp) => resp.json()),
            fetch(
              baseurl + `/quran/verses/utmani?chapter_number=${index + 1}`
            ).then((resp) => resp.json()),
          ]).then((data) => {
            AyahsAudios = [];
            AyahsText = [];
            let audioverses = data[0].audio_files;
            audioverses.forEach((audioverse) => {
              AyahsAudios.push(audioUrl + audioverse.url);
            });
            let textVerses = data[1].verses;
            console.log(textVerses);
            textVerses.forEach((textVerse) => {
              AyahsText.push(textVerse.text_uthmani);
            });
            console.log(AyahsAudios, AyahsText);
            // })

            let AyahIndex = 0;
            changeAyah(AyahIndex);

            audio.addEventListener("ended", () => {
              AyahIndex++;
              if (AyahIndex < AyahsAudios.length) {
                changeAyah(AyahIndex);
              } else {
                AyahIndex = 0;
                changeAyah(AyahIndex);
                audio.pause();
                Swal.fire({
                  position: "center",
                  icon: "success",
                  title: "Surah has ended",
                  showConfirmButton: false,
                  timer: 1500,
                });
                isPlaying = true;
                togglePlay();
              }
            });
            next.addEventListener("click", () => {
              AyahIndex < AyahsAudios.length - 1
                ? AyahIndex++
                : (AyahIndex = 0);
              changeAyah(AyahIndex);
            });
            prev.addEventListener("click", () => {
              AyahIndex == 0
                ? (AyahIndex = AyahsAudios.length - 1)
                : AyahIndex--;
              changeAyah(AyahIndex);
            });
            //Play and pause button
            let isPlaying = false;
            togglePlay();
            function togglePlay() {
              if (isPlaying) {
                audio.pause();
                play.innerHTML = `<i class="fas fa-play"></i>`;
                isPlaying = false;
              } else {
                audio.play();
                play.innerHTML = `<i class="fas fa-pause"></i>`;
                isPlaying = true;
              }
            }
            play.addEventListener("click", togglePlay);
            function changeAyah(index) {
              audio.src = AyahsAudios[index];
              ayah.innerHTML = AyahsText[index];
            }
          });
        });
      });
    });
}
