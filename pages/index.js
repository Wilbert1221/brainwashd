import {useState, useRef, useEffect} from 'react';
import Head from 'next/head';
import Brain from '../assets/brain.svg';
import Stamp from '../assets/stamp.svg';
import FB from '../assets/fb.svg';
import Twitter from '../assets/twitter.svg';
import Share from '../assets/share.svg';
import Copy from '../assets/copy.svg';
import Openai from '../assets/openai.svg';
import Verified from '../assets/verified.svg';
import Modal from '../components/Modal';
import * as htmlToImage from 'html-to-image';

const Home = () => {
  const domEl = useRef(null);
  const [userInput, setUserInput] = useState('');
  const [output, setOutput] = useState({source: null, title: null, author: null, text: null});
  const [tweet, setTweet] = useState({name: null, username: null, verified: null, text: null, analysis: null});
  const [isGenerating, setIsGenerating] = useState(false);
  const [active, setActive] = useState(0);
  // https://www.livemint.com/news/india/1-chinese-anti-submarine-helicopter-3-warships-detected-near-island-taiwan-11680754700420.html
  const [modal, setModal] = useState(false);
  const [screenshot, setScreenshot] = useState(null); 


  const activeValue = (e) => {
    setActive(e.target.value);
  }

  const toggle = async() => {
    setModal(!modal);
    const dataUrl = await htmlToImage.toPng(domEl.current);
    setScreenshot(dataUrl);
  }

  const copyreport = () => {
    navigator.clipboard.writeText(output.title + "\n" + output.author + "\n" + output.source.toUpperCase()  + output.text);
    console.log(output);
    console.log('copied');
  }

  const callGenerateEndpoint = async() => {
   setIsGenerating(true);
   const url = process.env.NEXT_PUBLIC_PYTHON_API_URL;
   if(active == 0){
   const restofURL = `?url=${encodeURIComponent(userInput)}`
   
   const res = await fetch(url + '/parse/url' + restofURL, {
       method: 'POST',
       body: ''
     });

   const data = await res.json();
   const input = data.text;
   console.log("Calling OpenAI...")
   const response = await fetch('/api/generate', {
     method: 'POST',
     headers: {
       'Content-Type': 'application/json',
     },
     body:JSON.stringify({input}),
   });

   const chat = await response.json();
   const chattext = chat.output.text;
   setOutput({source: data.source, title: data.title, author: data.author[0], text: chattext});
 }
 if(active == 1){
   const strarray = userInput.split('/');
   const id = strarray[strarray.length -1];
   const restofURL = '?id=' + id;
   const response = await fetch(url + '/parse/tweet'+ restofURL, {
     method: 'POST',
     body: ''
   });
   const data = await response.json();
   console.log(data);
   const input = data.content;
   const user = `@{data.username}`
   const openai = await fetch('/api/generateTweet', {
     method: 'POST',
     headers: {
       'Content-Type': 'application/json',
     },
     body:JSON.stringify({input, user}),
   });

   const chat = await openai.json();
   const chattext = chat.output.text;

   setTweet({name: data.author, username: data.username, verified: data.verified, content: data.content, analysis: chattext, profile: data.profile});
 }
   
   setIsGenerating(false);
}
// useEffect(() => {
//   const generate = async() => {

//   }
//   generate();

// }, [active])


  const onUserChangedText = (event) => {
    setUserInput(event.target.value);
  };
  
  const activeOutput = () => {
    const temp = active;
    if(temp == 0 && output.source != null){
      return(
        <div className="output">
            <div className="capture" id="domEl" ref={domEl}>
            <Stamp className='stamp' alt='a stamp of a brain'/>
            <div className='output-head'>
                <h4 className='article-title'>{output.title}</h4>
                <h4 className='article-author'>{output.author}</h4>
                <h4 className='source'>{output.source.toUpperCase()}</h4> 
              </div>
              <div className="output-content analysis">
                <p>{output.text}</p>
              </div>
              </div>
              <button className='copy-button' onClick={copyreport} data-tooltip = "Copy">
              <Copy className='share' alt='copy symbol'/>
              </button>
              <button className='share-button' onClick={toggle} data-tooltip = "Share">
              <Share className='share' alt='share symbol'/>
              </button>
          </div>
      );
    }
    if(temp == 1 && tweet.username != null){
      // console.log(tweet)
      return(
        <div className="output">
            <div className="capture" id="domEl" ref={domEl}>
            <Stamp className='stamp' alt='a stamp of a brain'/>
                <div className='output-head'>
                <div className='flex'>
                <img src={tweet.profile} className='profpic' alt='profile pic' width='50' height='auto'></img>
                <h4 className='tweetname'>{tweet.name}</h4>
                <Verified className='verified'></Verified>
                </div>
                <a className='article-author anchor' href={`https://twitter.com/${tweet.username}`} target='_blank'>{`@${tweet.username}`}</a>
                <h4 className='source'>Twitter</h4> 
              </div>
              <div className="output-content">
                <p>{tweetUrlLive(tweet.content)}</p>
                <p className='analysis'>{tweet.analysis}</p>
              </div>
              </div>
              <button className='copy-button' onClick={copyreport} data-tooltip = "Copy">
              <Copy className='share' alt='copy symbol'/>
              </button>
              <button className='share-button' onClick={toggle} data-tooltip = "Share">
              <Share className='share' alt='share symbol'/>
              </button>
          </div>
      );
    }
  }

  function isValidUrl(string) {
    try {
      new URL(string);
      return true;
    } catch (err) {
      return false;
    }
  }

  const tweetUrlLive = () => { 
    const arr = tweet.content.split(" ");
    var len = arr.length;
    console.log(arr);
    for (var i = 0; i < len; i++) {
      if(!isValidUrl(arr[i])){
        arr[i] = arr[i] + ' '
      }
      else{
        arr[i] = <a className='tweetlink' target='_blank' href={arr[i]}>{arr[i]}</a>
       }
      }
    return arr; 
  }

  return (
    <main className={(modal ? 'root blur': 'root')}>
      <div className='topper'>
      <div className='flex'>
      <p>brainwashd</p>
      <Brain className='brain smaller'/>
      </div>
      {/* <button className="connect">
        <Openai className= "openai" ></Openai>
        <p>Connect API</p>
      </button> */}
      </div>
      <Head>
        <title>brainwashd</title>
      </Head>
      <Modal modal={modal} setModal={setModal} screenshot={screenshot}></Modal>
      <div className={output ? 'container-both': 'container-alone'}>
          {activeOutput()}
        <div id="right" className={(output.source || tweet.username) ? 'small right':'right'}>
        <div className="header">
          <Brain className='brain' alt='brain'/>
          <div className='header-title'>
            <h1>brainwashd?</h1>
          </div>
          <div className="header-subtitle">
            <h2> <span className='grammarly'>grammarly</span> for fake news</h2>
          </div>
        </div>
        <h3 aria-label= "Analyze content">Just drop a link and determine what's real or not. Analyze&nbsp;<span className="typewriter nocaret"></span>.</h3>
        <div className='CTA'>
        <div className='source-type'>
            <button className={(active == 0) ? 'source-button active' : 'source-button'} value={0} onClick={e => activeValue(e)}>News</button>
            <button className={(active == 1) ? 'source-button active' : 'source-button'} value={1} onClick={e => activeValue(e)}>Twitter</button>
            <button className={(active == 2) ? 'source-button active' : 'source-button'}  value={2} onClick={e => activeValue(e)} disabled>Facebook</button>
          </div>
          </div>
          <div className='input-submit'>
          <div className='prompt-container'>
            <input placeholder="Drop content link:" className="prompt-box" value={userInput} onChange={onUserChangedText} />
          </div>
            <button className={isGenerating ? 'generate-button loading' : 'generate-button'} onClick={callGenerateEndpoint}>
              {isGenerating ? <span className="loader"></span> : <p>Generate</p>}
            </button>
          </div>
        {/* </div> */}
        </div>
      </div>
      <div className='footer'>
      <p>brainwashd © 2023</p>
      <div className='socials'>
        <a href='https://twitter.com/yourbrainwashd' target="_blank">
        <Twitter className='social' alt='twitter logo'/>
        </a>
        <a href='https://www.facebook.com/people/brainwashd/100090847960599/' target="_blank">
        <FB className='social' alt='facebook logo'/>
        </a>
      </div>
    </div>
    </main>
  );
};

export default Home;
