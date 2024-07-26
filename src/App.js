document.addEventListener("DOMContentLoaded", function () {
  const errorElement = document.getElementById('error');
  const slideshowContainer = document.getElementById('slideshow');

  const urlParams = new URLSearchParams(window.location.search);
  const apiKey = urlParams.get('api');
  const deviceId = urlParams.get('device');

  if (!apiKey || !deviceId) {
    errorElement.textContent = 'API key and device ID are required in the URL query parameters.';
    return;
  }

  const fetchData = () => {
    fetch(`https://one-net-react.vercel.app/api/data?api=${apiKey}&device=${deviceId}`)
      .then(response => response.json())
      .then(data => {
        console.log("Data fetched:", data); // Debugging log
        if (data.errno === 0) {
          const datastreams = data.data.datastreams;
          const allowedIds = ['3200_0_5750', '3200_1_5750', '3200_2_5750', '3200_3_5750', '3200_4_5750', '3200_5_5750'];

          // Sort the datastreams to match the order of allowed IDs
          const sortedDatastreams = allowedIds.map(id =>
            datastreams.find(stream => stream.id === id)
          ).filter(stream => stream !== undefined);

          // Concatenate base64 strings into images
          let images = [];
          let concatenatedBase64 = '';
          sortedDatastreams.forEach(stream => {
            if (stream.datapoints && stream.datapoints.length > 0 && stream.datapoints[0].value !== "'0'") {
              concatenatedBase64 += stream.datapoints[0].value;
            } else if (concatenatedBase64) {
              images.push(concatenatedBase64);
              concatenatedBase64 = '';
            }
          });

          if (concatenatedBase64) {
            images.push(concatenatedBase64);
          }

          console.log("Concatenated base64 images:", images); // Debugging log

          slideshowContainer.innerHTML = '';

          images.forEach((base64, index) => {
            const slideDiv = document.createElement('div');
            slideDiv.classList.add('mySlides', 'fade');
            slideDiv.innerHTML = `
              <div class="numbertext">${index + 1} / ${images.length}</div>
              <img src="data:image/jpeg;base64,${base64}" style="width:100%; height: 100%; object-fit: cover;">
            `;
            slideshowContainer.appendChild(slideDiv);
          });

          // Add navigation buttons
          const prev = document.createElement('a');
          prev.classList.add('prev');
          prev.innerHTML = '&#10094;';
          prev.onclick = () => plusSlides(-1);

          const next = document.createElement('a');
          next.classList.add('next');
          next.innerHTML = '&#10095;';
          next.onclick = () => plusSlides(1);

          slideshowContainer.appendChild(prev);
          slideshowContainer.appendChild(next);

          showSlides(slideIndex);
        } else {
          errorElement.textContent = 'Failed to load data';
        }
      })
      .catch(error => {
        console.error('Error fetching data:', error); // Debugging log
        errorElement.textContent = `Error fetching data: ${error.message}`;
      });
  };

  let slideIndex = 1;

  const plusSlides = (n) => {
    showSlides(slideIndex += n);
  };

  const showSlides = (n) => {
    const slides = document.getElementsByClassName("mySlides");
    if (n > slides.length) { slideIndex = 1 }
    if (n < 1) { slideIndex = slides.length }
    for (let i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
    }
    slides[slideIndex - 1].style.display = "block";
  };

  fetchData();
  setInterval(fetchData, 20000);
});










