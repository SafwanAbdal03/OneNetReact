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
          const images = data.images;
          updateSlideshow(images);
        } else {
          errorElement.textContent = 'Failed to load data';
        }
      })
      .catch(error => {
        console.error('Error fetching data:', error); // Debugging log
        errorElement.textContent = `Error fetching data: ${error.message}`;
      });
  };

  const updateSlideshow = (images) => {
    slideshowContainer.innerHTML = '';

    images.forEach((image, index) => {
      const slideDiv = document.createElement('div');
      slideDiv.classList.add('mySlides', 'fade');
      slideDiv.innerHTML = `
        <div class="numbertext">${index + 1} / ${images.length}</div>
        <img src="data:image/jpeg;base64,${image.base64}" style="width:100%; height: 100%; object-fit: cover;">
        <div class="timestamp">${image.timestamp}</div>
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
  };

  let slideIndex = 1;

  const plusSlides = (n) => {
    showSlides(slideIndex += n);
  };

  const showSlides = (n) => {
    const slides = document.getElementsByClassName("mySlides");
    if (slides.length === 0) return; // Prevent error if no slides exist
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



















