let audio = document.querySelector(".quranPlayer"),
  surahsContainer = document.querySelector(".surahs"),
  ayah = document.querySelector(".ayah"),
  next = document.querySelector(".next"),
  prev = document.querySelector(".prev"),
  play = document.querySelector(".play"),
  darkmode = document.querySelector("#darkbtn");
getSurahs();
function switchDarkMode() {
  var element = document.body;
  element.classList.toggle("dark-mode");
}
darkmode.addEventListener("click", switchDarkMode);
function getSurahs() {
  fetch("https://api.quran.sutanlab.id/surah")
    .then((repsonse) => repsonse.json())
    .then((data) => {
      for (let surah in data.data) {
        surahsContainer.innerHTML += `
        <div class="surah-name">
        <p>${data.data[surah].name.long}</p>
        <p>${data.data[surah].name.transliteration.en}</p>
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
          fetch(`https://api.quran.sutanlab.id/surah/${index + 1}`)
            .then((repsonse) => repsonse.json())
            .then((data) => {
              let verses = data.data.verses;
              AyahsAudios = [];
              AyahsText = [];
              verses.forEach((verse) => {
                AyahsAudios.push(verse.audio.primary);
                AyahsText.push(verse.text.arab);
                // surahText.innerHTML+=`<p>${verse.text.arab}</p>`
              });

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
                audio.src = AyahsAudios[AyahIndex];
                ayah.innerHTML = AyahsText[AyahIndex];
              }
            });
        });
      });
    });
}
