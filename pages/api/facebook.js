
const facebook = async(req, res) => {
    const body = JSON.parse(req.body);
    const url = body.userInput;
    console.log(url);
    
    // const response = await fetch(url);
    // const html = await response.text();
    // console.log("html:", html);
    // // res.status(200);
    // return '';

}

export default facebook;