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
import Close from '../assets/close.svg';
import * as htmlToImage from 'html-to-image';

const Home = () => {
  const domEl = useRef(null);
  const [userInput, setUserInput] = useState('');
  const [output, setOutput] = useState({source: null, title: null, author: null, text: null, context:null});
  const [tweet, setTweet] = useState({name: null, username: null, verified: null, text: null, analysis: null});
  const [isGenerating, setIsGenerating] = useState(false);
  const [news, setNews] = useState(null);
  const [feedback, setFeedback] = useState(true);
  const [active, setActive] = useState(0);
  const [modal, setModal] = useState(false);
  const [screenshot, setScreenshot] = useState(null); 
  const [on, toggleOn] = useState(true);
  const [resources, setResources] = useState(false);

  useEffect(() => {
    try{
      if(userInput){
        let domain = (new URL(userInput));
        domain = domain.hostname.replace('.com','');
        console.log(domain)
        if(active == 0 && domain != 'twitter'){
          toggleOn(false);
        }
        if(active == 1 && domain == 'twitter'){
          toggleOn(false);
        }
      }
    }
    catch(e){
      alert("The URL entered is invalid. Please enter a valid URL")
    }


  }, [userInput, active])

  useEffect(() => {
    const getContext = async() => {
        console.log("a little extra love from OpenAI...")
       const response = await fetch('/api/context', {
         method: 'POST',
         headers: {
           'Content-Type': 'application/json',
         },
         body:JSON.stringify({input: news, report: output.text}),
       });
    
       const data = await response.json();
       const resources = data.output.text;
       console.log(resources);
       const regex = /\d+\. /;
       const contextwhite = resources.split(regex);
       const context = contextwhite.filter(str => str.trim() !== '');
      console.log(context);
      
      //  const context = resources.split("\n").map((source) => {
      //   // Extract the title and author from each book title
      //   const titleAndAuthor = source.substring(source.indexOf("'") + 1, source.lastIndexOf("'"));
      //   // Extract the publication information from each book title
      //   const publicationInfo = source.substring(source.lastIndexOf("(") + 1, source.lastIndexOf(")"));
      //   // Check if the publication information contains a URL
      //   const hasUrl = publicationInfo.includes("http");
      //   // If the publication information contains a URL, format it as a clickable link
      //   const formattedPublicationInfo = hasUrl ? `<a href="${publicationInfo}">${publicationInfo}</a>` : publicationInfo;
      //   // Combine the formatted title and author with the formatted publication information
      //   return `${titleAndAuthor} (${formattedPublicationInfo})`;
      // });
      // console.log(context);
       setOutput({...output, context: context});
       
    }

    if(output.text){
      getContext()
    }
  }, [output.text])
  

  const handleResources = () => {
    setResources(true);
  }

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
    setTweet({name: null, username: null, verified: null, text: null, analysis: null});
    setOutput({...output, context: null});
    setResources(false);
   const restofURL = `?url=${encodeURIComponent(userInput)}`
   
   const res = await fetch(url + '/parse/url' + restofURL, {
       method: 'POST',
       body: ''
     });

   const data = await res.json();
   const input = data.text;
   setNews(input);
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

   setOutput({source: data.source, title: data.title, author: data.author[0], text: chattext, context: null});
  }

  if(active == 1){
   setOutput({source: null, title: null, author: null, text: null, context: null});
   const strarray = userInput.split('/');
   console.log(strarray);
   const almost = strarray[strarray.length -1];
   console.log(almost);
   const almostarr = almost.split('?s');
   console.log(almost);
   const id = almostarr[0];
   console.log(id);
   const restofURL = `?id=${id}`;
   const response = await fetch(url + '/parse/tweet'+ restofURL, {
     method: 'POST',
     body: ''
   });
   const data = await response.json();
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
//  if(active == 2){

// }
   
   setIsGenerating(false);
}

  const onUserChangedText = (event) => {
    setUserInput(event.target.value);
  };
  
  const activeOutput = () => {
    if(active == 0 && output.source != null){
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
              <div className='invisible'></div>
              <button className='copy-button' onClick={copyreport} data-tooltip = "Copy" data-umami-event="copy-report">
              <Copy className='share' alt='copy symbol'/>
              </button>
              <button className='share-button' onClick={toggle} data-tooltip = "Share" data-umami-event="share-report">
              <Share className='share' alt='share symbol'/>
              </button>
          </div>
      );
    }
    if(active == 1 && tweet.username != null){
      return(
        <div className="output">
            <div className="capture" id="domEl" ref={domEl}>
            <Stamp className='stamp' alt='a stamp of a brain'/>
                <div className='output-head'>
                <div className='tweetfo'>
                <img src={tweet.profile} className='profpic' alt='profile pic' width='50' height='auto'></img>
                <div className='namever'>
                <h4 className='tweetname'>{tweet.name}</h4>
                <Verified className='verified'></Verified>
                </div>
                </div>
                <a className='article-author anchor' href={`https://twitter.com/${tweet.username}`} target='_blank'>{`@${tweet.username}`}</a>
                <h4 className='source'>TWITTER</h4> 
              </div>
              <div className="output-content">
                <p>{tweetUrlLive(tweet.content)}</p>
                <p className='analysis'>{tweet.analysis}</p>
              </div>
              </div>
              <div className='invisible'></div>
              <button className='copy-button' onClick={copyreport} data-tooltip = "Copy" data-umami-event="copy-report">
              <Copy className='share' alt='copy symbol'/>
              </button>
              <button className='share-button' onClick={toggle} data-tooltip = "Share" data-umami-event="share-report">
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

  const close = () => { 
    setFeedback(false);
  }

  const tweetUrlLive = () => { 
    const arr = tweet.content.split(" ");
    var len = arr.length;
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



  const renderContext = () => {
    const arr = output.context
    for(var i = 0; i < arr.length; i++){
      if(typeof arr[i] === 'string' && output.context){
        var curr = arr[i];
        const text = arr[i].substring(0, curr.indexOf("http") - 2);
        const link = arr[i].substring(curr.indexOf("http"));
        arr[i] = <a href={link} target="_blank">{text} </a>
      }
    }
    const listItems = arr.map((item, index) => (
        <li key={index}>{item}</li>
      ));
    return <ol>{listItems}</ol>;
  }

  return (
    <main className={(modal ? 'root blur': 'root')}>
      {/* <div className={feedback ? `banner` : `banner none`}>
        <span> You can help improve brainwashd by providing feedback. <a href='#'> Click here to complete a quick survey</a></span>
        <button className="closebutton" onClick={close}>
        <Close className="closefeedback"></Close>
        </button>
      </div> */}
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
      <div className={output.title || tweet.name ? 'container-both': 'container-alone'}>
          {activeOutput()}
        <div id="right" className={output.title || tweet.name ? 'small right':'right'}>
        <div className="header">
          <Brain className='brain' alt='brain'/>
          <div className='header-title'>
            <h1>brainwashd?</h1>
          </div>
          <div className="header-subtitle">
            <h2> <span className='grammarly'>grammarly</span> for fake news</h2>
          </div>
        </div>
        <div className='h3contain'>
        <h3 aria-label= "Analyze content">Just drop a link and determine</h3>
        <h3 aria-label= "Analyze content">what's real or not. Analyze&nbsp;<span className="typewriter nocaret"></span>.</h3>
        </div>
          <div className='flexcol'>
          <div className='source-type'>
            <button className={(active == 0) ? 'source-button active' : 'source-button'} value={0} onClick={e => activeValue(e)}>News</button>
            <button className={(active == 1) ? 'source-button active' : 'source-button'} value={1} onClick={e => activeValue(e)}>Twitter</button>
            {/* <button className={(active == 2) ? 'source-button active' : 'source-button'}  value={2} onClick={e => activeValue(e)} disabled>Facebook</button> */}
          </div>
          <div className='input-submit'>
          <div className='prompt-container'>
            <input placeholder="Drop content link:" className="prompt-box" value={userInput} onChange={onUserChangedText} />
          </div>
            <button className={isGenerating ? 'generate-button loading' : 'generate-button'} onClick={callGenerateEndpoint} disabled={on} data-umami-event="generate-report">
              {isGenerating ? <span className="loader"></span> : <p>Generate</p>}
            </button>
          </div>
          </div>
        </div>
      </div>
      {/* <div className='chrome-extension'>
        <h1>Coming Soon. brainwashd analyzes content in the browser as you read!</h1>
        <a href='#'> Add to Chrome </a>
      </div> */}
      {/* Render the "Learn More" button only if output.context is not null */}
      {(output.text && !output.context) && (
        <h1 className='wait'> Generating something special .... </h1>
      )}
      {(output.context && !resources) && (
        <button className="learn-more-btn" onClick={handleResources}>Click for Resources</button>
      )}
      {(output.context && resources) && (
        <div className='resources'>
          <h1>Resources</h1>
          {renderContext()}
        </div>
      )}
      
      <div className='footer'>
      <p>brainwashd © 2023</p>
      <div className='socials'>
        <a href="https://www.producthunt.com/posts/brainwashd?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-brainwashd" target="_blank" data-umami-event="visit-ph"> <img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=389363&theme=dark" alt="product hunt button" width="250" height="50"/></a>
        <a href='https://twitter.com/yourbrainwashd' target="_blank" data-umami-event="visit-twitter">
        <Twitter className='social' alt='twitter logo'/>
        </a>
        <a href='https://www.facebook.com/people/brainwashd/100090847960599/' target="_blank" data-umami-event="visit-fb">
        <FB className='social' alt='facebook logo'/>
        </a>
      </div>
    </div>
    </main>
  );
};

export default Home;
