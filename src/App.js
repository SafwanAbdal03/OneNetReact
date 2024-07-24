document.addEventListener("DOMContentLoaded", function () {
  const errorElement = document.getElementById('error');
  const imageElement = document.getElementById('image');
  const canvasElement = document.getElementById('upscaledCanvas');

  // Get query parameters from the URL
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
        console.log("Data fetched:", data);
        if (data.errno === 0) {
          const datastreams = data.data.datastreams;
          const allowedIds = ['3200_0_5750', '3200_1_5750', '3200_2_5750', '3200_3_5750', '3200_4_5750'];

          // Sort the datastreams to match the order of allowed IDs
          const sortedDatastreams = allowedIds.map(id =>
            datastreams.find(stream => stream.id === id)
          ).filter(stream => stream !== undefined); // Filter out any undefined streams

          // Extract base64 values from the sorted datastreams
          const base64Values = sortedDatastreams.map(stream => stream.datapoints[0].value);
          const combinedBase64 = base64Values.join(''); // Concatenate the base64 values

          imageElement.src = `data:image/jpeg;base64,${combinedBase64}`;
          imageElement.onload = () => {
            // Send the image to Waifu2x API for upscaling
            const formData = new FormData();
            formData.append('file', dataURLtoBlob(imageElement.src));
            formData.append('scale', '2'); // Upscale by a factor of 2
            formData.append('noise', '1'); // Add noise reduction if necessary

            fetch('https://waifu2x.booru.pics/', {
              method: 'POST',
              body: formData
            })
            .then(response => response.blob())
            .then(blob => {
              const upscaledURL = URL.createObjectURL(blob);
              const upscaledImage = new Image();
              upscaledImage.onload = () => {
                canvasElement.width = upscaledImage.width;
                canvasElement.height = upscaledImage.height;
                const ctx = canvasElement.getContext('2d');
                ctx.drawImage(upscaledImage, 0, 0, canvasElement.width, canvasElement.height);
                canvasElement.style.display = 'block';
              };
              upscaledImage.src = upscaledURL;
            })
            .catch(error => {
              console.error('Error upscaling image:', error);
              errorElement.textContent = 'Error upscaling image';
            });
          };
          imageElement.style.display = 'block';
        } else {
          errorElement.textContent = 'Failed to load data';
        }
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        errorElement.textContent = `Error fetching data: ${error.message}`;
      });
  };

  // Fetch data initially
  fetchData();

  // Fetch data every 20 seconds
  setInterval(fetchData, 20000);

  // Utility function to convert base64 data URL to Blob
  function dataURLtoBlob(dataurl) {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  }
});

