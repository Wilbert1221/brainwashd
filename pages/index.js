import { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import brain from '../assets/brain.svg';
import stamp from '../assets/stamp.svg';
import fb from '../assets/fb.svg';
import twitter from '../assets/twitter.svg';
import fbshare from '../assets/fb-share.svg';
import twittershare from '../assets/twitter-share.svg';
import share from '../assets/share.svg';
import copy from '../assets/copy.svg';

const Home = () => {
  const [userInput, setUserInput] = useState('');
  const [apiOutput, setApiOutput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [open, toggleOpen] = useState(false);

  const toggle = () => {
    toggleOpen(!open);
    console.log(open);
    console.log('click');
  }

  const copyreport = () => {
    navigator.clipboard.writeText(apiOutput);
    console.log(apiOutput);
    console.log('copied');
  }

  const callGenerateEndpoint = async () => {
    setIsGenerating(true);
    
    console.log("Calling OpenAI...")
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userInput }),
    });

    const data = await response.json();
    const { output } = data;
    console.log("OpenAI replied...", output.text)

    setApiOutput(`${output.text}`);
    setIsGenerating(false);
}

  const onUserChangedText = (event) => {
    setUserInput(event.target.value);
  };
  return (
    <main className="root">
      <div className='topper'>
      <p>brainwashd</p>
      <Image className='brain smaller' src={brain} alt='brain'/>
      </div>
      <Head>
        <title>brainwashd</title>
      </Head>
      <div className={apiOutput ? 'container-both': 'container-alone'}>
      {apiOutput && (
          <div id="output" className="output">
            <Image className='stamp' src={stamp} alt='a stamp of a brain'/>
              <div className="output-content">
                <p>{apiOutput}</p>
              </div>
              <button className='copy-button' onClick={copyreport}>
              <Image src={copy} className='share' alt='copy symbol'/>
              </button>
              <button className='share-button' onClick={toggle}>
              <Image src={share} className='share' alt='share symbol'/>
              </button>
              <div className='multi-button'>
                <a className={open ? 'move1 icon':'icon'} href="https://twitter.com/intent/tweet">
                  <Image src={fbshare} alt='facebook logo'/>
                </a>
                <a className={open ? 'move2':''}>
                <Image src={twittershare} className='icon' alt='twitter logo'/>
                </a>
              </div>
          </div>
        )}
        <div id="right" className={apiOutput ? 'small right':'right'}>
        <div className="header">
          <Image className='brain' src={brain} alt='brain'/>
          <div className='header-title'>
            <h1>brainwashd?</h1>
          </div>
          <div className="header-subtitle">
            <h2> <span className='grammarly'>grammarly</span> for fake news</h2>
          </div>
        </div>
        <h3 aria-label= "Analyze content">Just drop a link and determine what's real or not. Analyze&nbsp;<span className="typewriter nocaret"></span>.</h3>
        <div className='CTA'>
          <div className='prompt-container'>
            <input placeholder="Drop content link:" className="prompt-box" value={userInput} onChange={onUserChangedText} />
          </div>
            <button className={isGenerating ? 'generate-button loading' : 'generate-button'} onClick={callGenerateEndpoint}>
              {isGenerating ? <span className="loader"></span> : <p>Generate</p>}
            </button>
        </div>
        </div>
      </div>
      <div className='footer'>
      <p>brainwashd © 2023</p>
      <div className='socials'>
        <a href='https://twitter.com/yourbrainwashd' target="_blank">
        <Image src={twitter} className='social' alt='twitter logo'/>
        </a>
        <a href='https://www.facebook.com/people/brainwashd/100090847960599/' target="_blank">
        <Image src={fb} className='social' alt='facebook logo'/>
        </a>
      </div>
    </div>
    </main>
  );
};

export default Home;
