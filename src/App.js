// Function to fetch data and display the image
function fetchDataAndDisplayImage() {
  const errorMessage = document.createElement('p');
  errorMessage.style.color = 'red';
  document.body.appendChild(errorMessage);

  const fetchedImage = document.createElement('img');
  fetchedImage.style.display = 'none';
  document.body.appendChild(fetchedImage);

  fetch('http://localhost:443/api/data')
    .then(response => response.json())
    .then(data => {
      console.log(data);
      if (data.errno === 0) {
        const combinedBase64 = data.data.datastreams.map(stream => stream.datapoints[0].value).join('');
        fetchedImage.src = `data:image/jpeg;base64,${combinedBase64}`;
        fetchedImage.style.display = 'block';
      } else {
        errorMessage.textContent = 'Failed to load data';
      }
    })
    .catch(error => {
      console.error('Detailed error:', error);
      errorMessage.textContent = `Error fetching data: ${error.message}`;
    });
}

// Run the function to fetch data and display the image
fetchDataAndDisplayImage();
