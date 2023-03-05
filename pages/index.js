import { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import brain from '../assets/brain.svg';
import stamp from '../assets/stamp.svg';
import fb from '../assets/fb.svg';
import ig from '../assets/ig.svg';
import twitter from '../assets/twitter.svg';
import share from '../assets/share.svg';

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
    <div className="root">
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
              <button className='share-button' onClick={toggle}>
              <Image src={share} className='share' alt='share symbol'/>
              </button>
              {/* <div className={open ? 'multi-button move':'multi-button'}>
                <button className={open ? 'fas fa-heart move1':'fas fa-heart'}></button>
                <button className={open ? 'fas fa-comment move2':'fas fa-comment'}></button>
                <button className={open ? 'fas fa-share-alt move3':'fas fa-share-alt'}></button>
                <button className={open ? 'fas fa-trash move4':'fas fa-trash'}></button>
              </div>
              <div className="slide-container"></div> */}
          </div>
        )}
        <div id="right" className={apiOutput ? 'small right':'right'}>
        <div className="header">
          <Image className='brain' src={brain} alt='brain'/>
          {/* <Image className='brain' src={brain} alt='brain'/> */}
          <div className='header-title'>
          {/* <div className='header-title'> */}
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
            <a className={isGenerating ? 'generate-button loading' : 'generate-button'} onClick={callGenerateEndpoint}>
              {isGenerating ? <span className="loader"></span> : <p>Generate</p>}
            </a>
        </div>
        </div>
      </div>
      <div className='footer'>
      <p>brainwashd © 2023</p>
      <div className='socials'>
        <Image src={twitter} className='social' alt='twitter logo'/>
        <Image src={ig} className='social' alt='instagram logo'/>
        <Image src={fb} className='social' alt='facebook logo'/>
      </div>
    </div>
    </div>
  );
};

export default Home;
