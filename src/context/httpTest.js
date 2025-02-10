import axios from 'axios'


const options = {
    method: 'POST',
    url: 'https://ai-text-to-image-generator-flux-free-api.p.rapidapi.com/api/flux.php',
    headers: {
      'x-rapidapi-key': '3cbe69720emsh8b58b57b4c57846p16cdb6jsnc80f396b07de',
      'x-rapidapi-host': 'ai-text-to-image-generator-flux-free-api.p.rapidapi.com',
      'Content-Type': 'application/json'
    },
    data: {
      prompt: 'cat and dog',
      image_size: 'portrait_16_9'
    }
  };
  
  
  try {
      const response = await axios.request(options);
      console.log(response.data);
  } catch (error) {
      console.error(error);
  }