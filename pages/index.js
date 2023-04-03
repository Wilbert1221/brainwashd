import {useState, useRef} from 'react';
import Head from 'next/head';
import Brain from '../assets/brain.svg';
import Stamp from '../assets/stamp.svg';
import FB from '../assets/fb.svg';
import Twitter from '../assets/twitter.svg';
import Share from '../assets/share.svg';
import Copy from '../assets/copy.svg';
import Modal from '../components/Modal';
import * as htmlToImage from 'html-to-image';

const Home = () => {
  const domEl = useRef(null);
  const [userInput, setUserInput] = useState('');
  const [output, setOutput] = useState({source: null, title: null, author: null, text: null});
  const [isGenerating, setIsGenerating] = useState(false);
  const [modal, setModal] = useState(false);
  const [screenshot, setScreenshot] = useState(null); 
  
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

  const callGenerateEndpoint = async () => {
   const restofURL = `?url=${encodeURIComponent(userInput)}`
   setIsGenerating(true);
   const url = process.env.NEXT_PUBLIC_PYTHON_API_URL;
   const res = await fetch(url + restofURL, {
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
    setIsGenerating(false);
}

  const onUserChangedText = (event) => {
    setUserInput(event.target.value);
  };
  
  return (
    <main className={(modal ? 'root blur': 'root')}>
      <div className='topper'>
      <p>brainwashd</p>
      <Brain className='brain smaller'/>
      </div>
      <Head>
        <title>brainwashd</title>
      </Head>
      <Modal modal={modal} setModal={setModal} screenshot={screenshot}></Modal>
      <div className={output.title ? 'container-both': 'container-alone'}>
      {output.title && (
          <div className="output">
            <div className="capture" id="domEl" ref={domEl}>
            <Stamp className='stamp' alt='a stamp of a brain'/>
              <div className='output-head'>
                <h4 className='article-title'>{output.title}</h4>
                <h4 className='article-author'>{output.author}</h4>
                <h4 className='source'>{output.source.toUpperCase()}</h4> 
              </div>
              <div className="output-content">
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
        )}
        <div id="right" className={output.title ? 'small right':'right'}>
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
        {/* <div className='CTA'> */}
        {/* <div className='source-type'>
            <button className={(active == 0) ? 'source-button active' : 'source-button'} value={0} onClick={e => activeValue(e)}>News</button>
            <button className={(active == 1) ? 'source-button active' : 'source-button'} value={1} onClick={e => activeValue(e)}>Twitter</button>
            <button className={(active == 2) ? 'source-button active' : 'source-button'}  value={2} onClick={e => activeValue(e)}>Facebook</button>
          </div> */}
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
