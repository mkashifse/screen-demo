import { useEffect, useRef, useState } from 'react';
import './index.css';
import { fs, storage } from './firbase.config';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import { useLocation } from 'react-router-dom'


function Admin() {
  const [ad, setAd] = useState([]);
  const [images, setImages] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  const uploadFile = (imageFile) => {
    return new Promise((resolve, reject) => {
      var storageRef = storage.ref(imageFile.name);
      //Upload file
      var task = storageRef.put(imageFile);
      //Update progress bar
      task.on('state_changed',
        function progress(snapshot) {
          var percentage = snapshot.bytesTransferred / snapshot.totalBytes * 100;
          console.log(percentage);
        },
        function error(err) {

        },
        async function complete() {
          var downloadURL = await task.snapshot.ref.getDownloadURL();
          resolve(downloadURL);
        }
      );
    });
  }

  const bulkUpload = async (files) => {
    const filesPromise = files.map((item) => uploadFile(item));
    return await Promise.all(filesPromise);
  }

  const ads = () => {
    return fs.collection('ads').doc('C6mz41ZQj27UKwPZc3F4');
  }

  const createAd = async (urls) => {
    const resp = await ads().update({
      text,
      images: urls
    });
    return resp;
  }

  const fetchAds = async (callback = () => { }) => {
    ads().onSnapshot((resp) => {
      callback(resp.data());
    });
  }

  useEffect(() => {
    fetchAds((resp) => {
      setAd(resp);
    })
  }, []);

  const showImages = () => {
    return (<div className="flex flex-wrap my-4">{
      images.map((item, key) => <div key={key} className="flex text-white rounded shadow m-1 p-2 text-sm bg-green-600">
        <div className="mr-2">{key + 1}</div>
        <div>{item.name}</div>
        <img src={item.src}></img>
      </div>)
    }
    </div>)
  }

  const viewAds = ({ text, images }) => {
    return (<div className="p-2 text-sm bg-white border rounded mb-1">
      <div>
        {text}
      </div>
      <div className="flex flex-wrap">
        {images && images.map ? images.map((item) =>
          <div className="h-12 w-12 overflow-hidden mr-2">
            <img src={item} className="w-full h-full object-cover rounded"></img>
          </div>
        ) : ''}
      </div>
    </div>)
  }

  const onSave = async () => {
    setLoading(true);
    const urls = await bulkUpload(images);
    const resp = await createAd(urls);
    setLoading(false);
  }


  return (<main>
    <div className="App bg-gray-100 h-screen w-full p-8 flex">
      <div className="w-1/2 px-4">
        <div className="rounded-md shadow-md bg-white p-4 h-full">
          {ad ? viewAds(ad) : ''}
        </div>
      </div>
      <div className="w-1/2 px-4">
        <div className="p-4 rounded-md shadow-md bg-white h-full">
          {loading ? <div>uploading...</div> : ''}
          <div className="flex justify-between">
            <div>
              <label className="mr-1 block">Enter Text</label>
              <input className="p-2 block bg-gray-200 rounded mb-2" onChange={({ target: { value } }) => setText(value)}></input>
            </div>
            <div>
              <button onClick={() => onSave()} className="bg-blue-600 hover:bg-blue-500 active:bg-blue-700 active:outline-none border-none p-2 px-4 rounded text-white shadow-md">Save</button>
            </div>
          </div>
          <input type="file" onChange={(e) => setImages(Array.from(e.target.files))} multiple></input>
          {showImages()}
        </div>
      </div>
    </div>
  </main>)
}

function Screen() {

  const [text, setText] = useState('');
  const [slides, setSlides] = useState([]);
  const [count, setCount] = useState(0);
  const [selected, setSelected] = useState('');


  const ads = () => {
    return fs.collection('ads');
  }
  const fetchAds = async (callback = () => { }) => {
    ads().onSnapshot((resp) => {
      callback(resp.docs.map((item) => item.data()));
    });
  }

  useEffect(() => {
    fetchAds((resp) => {
      setText(resp[0].text);
      setSlides(resp[0].images);
      setCount(resp[0].images.length);
      setSelected(resp[0].images[0]);
    })
  }, []);

  const [index, setIndex] = useState(0)

  const interval = useRef(null);

  useEffect(() => { if (index === 60) stopCounter() }, [index])

  const startCounter = () => interval.current = setInterval(() => {
    setIndex(i => {
      let temp = i + 1;
      return (temp % 5);
    });
  }, 3000)

  const stopCounter = () => clearInterval(interval.current);

  useEffect(() => {
    startCounter();
  }, [])


  return (<main className="App bg-gray-100 h-screen w-full  flex">
    <div className="w-full h-screen relative">
      <div className="text-white  h-full w-full absolute top-0 left-0 z-50 flex justify-center items-center">
        <p className="text-center block -mt-24 text-4xl">{text}</p>
      </div>
      <img src={slides[index]} className="w-full h-full object-cover animate__animated  animate__fadeIn"></img>
    </div>
  </main>)
}


function App() {
  const location = window.location.pathname;
  return (<Router>
    <div>
      {
        location !== '/screen' ?
          <nav>
            <ul className="flex p-4 text-sm shadow">
              <li className="mr-2">
                <Link to="/admin">Admin</Link>
              </li>
              <li>
                <Link to="/screen">Screen</Link>
              </li>
            </ul>
          </nav> : ''
      }

      {/* A <Switch> looks through its children <Route>s and
        renders the first one that matches the current URL. */}
      <Switch>
        <Route path="/admin">
          <Admin />
        </Route>
        <Route path="/screen">
          <Screen />
        </Route>
      </Switch>
    </div>
  </Router>)

}

export default App;
