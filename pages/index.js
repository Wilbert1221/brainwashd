import { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Brain from '../assets/brain.svg';
import Stamp from '../assets/stamp.svg';
import FB from '../assets/fb.svg';
import Twitter from '../assets/twitter.svg';
import Share from '../assets/share.svg';
import Copy from '../assets/copy.svg';

const Home = () => {
  const [userInput, setUserInput] = useState('');
  const [apiOutput, setApiOutput] = useState(null);
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
    setApiOutput(`${output.text}`.split('|'));
    console.log(apiOutput);
    setIsGenerating(false);
}

  const onUserChangedText = (event) => {
    setUserInput(event.target.value);
  };
  console.log(apiOutput);
  return (
    <main className="root">
      <div className='topper'>
      <p>brainwashd</p>
      <Brain className='brain smaller'/>
      </div>
      <Head>
        <title>brainwashd</title>
      </Head>
      <div className={apiOutput ? 'container-both': 'container-alone'}>
      {apiOutput && (
          <div id="output" className="output">
            <Stamp className='stamp' alt='a stamp of a brain'/>
              <div className='output-head'>
                <h3>{apiOutput[0]}</h3>
                <h4 className='article-author'>{apiOutput[2]}</h4>
                <h4 className='article-title'>{apiOutput[1]}</h4>
                
              </div>
              <div className="output-content">
                <p>{apiOutput[3]}</p>
              </div>
              <button className='copy-button' onClick={copyreport}>
              <Copy className='share' alt='copy symbol'/>
              </button>
              <button className='share-button' onClick={toggle}>
              <Share className='share' alt='share symbol'/>
              </button>
              <div className='multi-button'>
                <a className={open ? 'move1 icon':'icon off'}>
                  <FB className='icon' alt='facebook logo'/>
                </a>
                <a className={open ? 'move2 icon': 'icon off'} href="https://twitter.com/intent/tweet">
                  <Twitter className='icon' alt='twitter logo'/>
                </a>
              </div>
          </div>
        )}
        <div id="right" className={apiOutput ? 'small right':'right'}>
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
