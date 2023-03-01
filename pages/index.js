import { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import brain from '../assets/brain.svg';
import stamp from '../assets/stamp.svg';

const Home = () => {
  const [userInput, setUserInput] = useState('');
  const [apiOutput, setApiOutput] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

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
      <Head>
        <title>brainwashd</title>
      </Head>
      <div className={apiOutput ? 'top display-off' : 'top display-on'}>
    <div className={apiOutput ? 'header small display-off' : 'header small display-on'}>
          <Image className='brain' src={brain} alt='brain'/>
          <div className="header-title">
            <h1>brainwashd?</h1>
          </div>
          <div className="header-subtitle">
            <h2> <span className='grammarly'>grammarly</span> for fake news</h2>
          </div>
        </div>
    </div>
      <div className="container">
        <div className={apiOutput ? 'header display-on' : 'header display-off'}>
          <Image className='brain' src={brain} alt='brain'/>
          <div className="header-title">
            <h1>brainwashd?</h1>
          </div>
          <div className="header-subtitle">
            <h2> <span className='grammarly'>grammarly</span> for fake news</h2>
          </div>
        </div>
        <h3 aria-label= "Analyze content">Just drop a link and determine what's real or not. Analyze&nbsp;<span className="typewriter nocaret"></span>.</h3>
        <div className='CTA'>
          <div className="prompt-container">
            <input placeholder="Drop content link:" className="prompt-box" value={userInput} onChange={onUserChangedText} />
          </div>
            <a className={isGenerating ? 'generate-button loading' : 'generate-button'} onClick={callGenerateEndpoint}>
              {isGenerating ? <span className="loader"></span> : <p>Generate</p>}
            </a>
        </div>
        {apiOutput && (
          <div className="output">
              <div className="output-header-container">
                <div className="output-header">
                  <h3> brainwashd report </h3>
              </div>
              </div>
              <div className="output-content">
                <p>{apiOutput}</p>
                <Image className='stamp' src={stamp} alt='a stamp of a brain'/>
              </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
