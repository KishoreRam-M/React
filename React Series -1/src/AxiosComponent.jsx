import axios from 'axios';
import React, { useEffect, useState } from 'react';

const AxiosComponent = () => {
  const [responseData, setResponseData] = useState('');
  const [error, setError] = useState(null);

  async function getApi() {
    try {
      const response = await axios.get(
        'https://img.etimg.com/thumb/width-1200,height-1200,imgsize-34154,resizemode-75,msid-119080210/magazines/panache/samantha-ruth-prabhu-erases-past-matching-tattoo-with-naga-chaitanya-is-nearly-gone-amid-new-romance-rumors.jpg' // Replace with a JSON API (your original URL returns HTML, not usable in frontend JSON rendering)
      );
      console.log(response);
      setResponseData(response.data);
    } catch (err) {
      console.error(err);
      setError('Error fetching data');
    }
  }

  useEffect(() => {
    getApi();
  }, []);

  return (
    <>
      <div>AxiosComponent</div>
      <div className="myapi">
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {responseData ? (
          <div>
            <h3>{responseData.title}</h3>
            <p>{responseData.body}</p>
          </div>
        ) : (
          !error && <p>Loading...</p>
        )}
      </div>
    </>
  );
};

export default AxiosComponent;
