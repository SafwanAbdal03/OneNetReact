document.addEventListener('DOMContentLoaded', async () => {
  try {
    const response = await fetch('/api/data');
    const data = await response.json();
    console.log('Data:', data);

    // Assuming the image data is base64-encoded and stored in `data.image`
    const base64Image = data.image;
    if (base64Image) {
      const imgElement = document.createElement('img');
      imgElement.src = `data:image/jpeg;base64,${base64Image}`;
      document.body.appendChild(imgElement);
    } else {
      console.error('No image data found');
    }
  } catch (error) {
    console.error('Error fetching or displaying data:', error);
  }
});
