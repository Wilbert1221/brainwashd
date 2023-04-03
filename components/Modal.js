import React, {useState, useEffect} from "react";
import ReactDOM  from "react-dom";
import styles from './modal.module.css';
import Close from '../assets/close.svg';
import Copy from '../assets/copy.svg';
import FB from '../assets/facebooksymbol.svg';
import Twitter from '../assets/twittersymbol.svg';

const Modal = ({modal, setModal, screenshot}) => {
  const [browser, setBrowser] = useState(false);
  const text = "Playing around w/ brainwashd, it's insane 🤯%0a%0aIt generated a report just from dropping the link to a news article!%0a%0acc: @yourbrainwashd%0a%0a";
  const textdisplay = "\nPlaying around w/ brainwashd, it's insane 🤯\n\nIt generated a report just from dropping the link to a news article!\n\ncc: @yourbrainwashd";
  useEffect( ()=> {
    setBrowser(true);
  }, [])
  
  
  const close = () => {
    setModal(false);
  }

  const copyimage = () => {
    fetch(screenshot).then(response => response.blob()).then(blob => {
        console.log(blob)
        const file = new File([blob], 'image', {type:blob.type});
        const data = [new ClipboardItem({ ["image/png"]: file })];
        navigator.clipboard.write(data);
    })
    console.log('copied');
  }

  if (!modal) return null
  if(browser){
    return ReactDOM.createPortal(
        <>
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <button className={styles.close} onClick={close}> 
                    <Close className={styles.closesvg}></Close>
                </button>
                <p className={styles.modaltitle}>Share brainwashd report</p>
                <p className={styles.modalsubtitle}>Make sure to copy & paste the image below in your post. Not only does it look 10x better but it'll also get more engagement!</p>
                <div className = {styles.content}>
                    <textarea className={styles.textarea} defaultValue={textdisplay}>
                    </textarea>
                    <div className={styles.imagecontainer}>
                        <img className={styles.image} src={screenshot}/> 
                        <button className={styles.copybutton} onClick={copyimage}>
                            <p>Copy</p>
                            <Copy className={styles.copyimage}></Copy>
                        </button>
                    </div>
                </div>
                <div className = {styles.buttons}>
                <a className={styles.twittermodal}
                    href= {`https://twitter.com/intent/tweet?text=${text}`}
                    target="_blank">
                    <Twitter></Twitter>
                    Share on Twitter </a>
                {/* <a className={styles.facebookmodal}
                    href={`https://twitter.com/intent/tweet?text=${text}`}
                    target="_blank">
                    <FB></FB>
                    Share on Facebook</a> */}
                    {/* data-href="https://developers.facebook.com/docs/plugins/" 
                    href="https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fplugins%2F&amp;src=sdkpreparse"  */}
                </div>
            </div>
        </div>
        </>,
        document.querySelector('#portal')
        );
  }
  else{
    return null;
  }
};

export default Modal;